import { createContext, useContext } from "react";

export function App() {
  return (
    <BoardProvider>
      <Board />
    </BoardProvider>
  );
}

function BoardProvider({ children }: { children: React.ReactNode }) {
  const board = {
    id: "board-1",
    columns: [
      { id: "column-1", title: "To do", cards: ["card-1", "card-2"] },
      { id: "column-2", title: "In progress", cards: ["card-3"] },
      { id: "column-3", title: "Done", cards: ["card-4"] },
    ],
    cards: [
      {
        id: "card-1",
        title: "Take out the garbage",
        description: "The garbage is overflowing",
        columnId: "column-1",
      },
      {
        id: "card-2",
        title: "Watch my favorite show",
        description: "The new season is about to start",
        columnId: "column-1",
      },
      {
        id: "card-3",
        title: "Charge my phone",
        description: "The battery is about to die",
        columnId: "column-2",
      },
      {
        id: "card-4",
        title: "Cook dinner",
        description: "We need to eat",
        columnId: "column-3",
      },
    ],
  };
  return <BoardContex.Provider value={board}>{children}</BoardContex.Provider>;
}

function Board() {
  const board = useBoard();
  return (
    <div className="flex flex-row min-w-full min-h-full overflow-x-visible">
      {board.columns.map((column) => (
        <Column key={column.id} id={column.id} className="w-80 flex-none" />
      ))}
    </div>
  );
}

function useBoard() {
  const board = useContext(BoardContex);
  if (!board) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return board;
}
const BoardContex = createContext<NormalizedKanbanBoard | null>(null);
type NormalizedKanbanBoard = {
  id: Id;
  columns: KanbanColumn[];
  cards: KanbanCard[];
};
type Id = string;
type KanbanColumn = {
  id: Id;
  title: string;
  cards: Id[];
};
type KanbanCard = {
  id: Id;
  title: string;
  description: string;
  columnId: Id;
};

function Column({ id, className }: { id: Id; className?: string }) {
  const column = useColumn(id);
  return (
    <section className={className}>
      <h2 className="text-xl font-bold">{column.title}</h2>
      <div className="flex flex-col">
        {column.cards.map((cardId) => (
          <Card key={cardId} id={cardId} />
        ))}
      </div>
    </section>
  );
}

function useColumn(id: Id) {
  const board = useBoard();
  const column = board.columns.find((column) => column.id === id);
  if (!column) {
    throw new Error(`Column with id ${id} not found`);
  }
  return column;
}

function Card({ id }: { id: Id }) {
  const card = useCard(id);
  return (
    <div className="p-2 m-1 bg-white hover:bg-slate-100 rounded shadow cursor-pointer" onClick={() => {}}>
      <h3 className="text-lg font-bold">{card.title}</h3>
      <p>{card.description}</p>
    </div>
  );
}

function useCard(id: Id) {
  const board = useBoard();
  const card = board.cards.find((card) => card.id === id);
  if (!card) {
    throw new Error(`Card with id ${id} not found`);
  }
  return card;
}
