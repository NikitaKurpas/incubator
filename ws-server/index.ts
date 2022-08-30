import { createServer } from 'http'
import express from 'express';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws'
import short from 'short-uuid';
import type { WebSocket, RawData } from 'ws'

const PORT = process.env.PORT ?? 8080

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, clientTracking: true })

type ClientId = string
type ClientData = { clientId: ClientId }
const tickets = new Map<string, ClientData>()
const json = (object: object): string => JSON.stringify(object)

app.use(express.static('public'))
app.post('/ticket', bodyParser.json(), (req, res) => {
    if (tickets.size >= 1000) {
        return res.sendStatus(429)
    }

    const clientId: unknown = req.body?.clientId
    if (!clientId || typeof clientId !== 'string' || clientId.length === 0) {
        return res.status(400).json({ error: '\'clientId\' must be present and must be a non-empty string'})
    }

    const ticket = short.generate()
    tickets.set(ticket, { clientId })
    setTimeout(() => tickets.delete(ticket), 1000)

    return res.status(200).json({ ticket });
})

wss.on('connection', (ws, req) => {
    if (!req.url) {
        return ws.close(1002, 'Unable to determine request URL')
    }

    const url = new URL(req.url, `ws://${req.headers.host}`);
    const ticket = url.searchParams.get('ticket');

    if (!ticket || !tickets.has(ticket)) {
        return ws.close(1008, 'Unknown ticket. Retrieve a ticket before connecting')
    }

    const clientData = tickets.get(ticket)!;
    tickets.delete(ticket);

    const broadcastToOthers: typeof WebSocket.prototype.send = (...args) => {
        wss.clients.forEach(client => {
            if (client === ws) {
                return
            }
            //@ts-ignore
            client.send(...args)
        })
    }

    broadcastToOthers(json({ type: 'server:client-connected', data: clientData }))

    ws.on('message', (data, isBinary) => {
        try {
            console.log('Recieved message:', data.toString('utf-8'))
        } catch {
            console.warn('Unable to decode recieved data. Is it in UTF-8?', data)
        }        

        broadcastToOthers(data, { binary: isBinary })
    })

    ws.on('close', () => {
        broadcastToOthers(json({ type: 'server:client-disconnected', data: clientData }))
    })

    ws.on('error', (error) => {
        console.error('WS client error', error)
    })

    console.log('Client connected');
});

wss.on('close', () => [
    console.log(`WS server closed`)
])

wss.on('error', (error) => {
    console.error('WS server error', error)
})

wss.on('listening', () => {
    console.log(`WS server listening on port ${PORT}`)
})

server.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`)
})