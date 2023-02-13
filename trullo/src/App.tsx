import { createContext, useContext, useMemo, useState } from "react";
// import { createPortal } from "react-dom";
import cx from "classnames";

export function App() {
  return (
    <BoardProvider>
      <div className="w-screen h-screen flex flex-col overflow-x-hidden bg-gray-400">
        <MenuBar />
        <Board className="flex-1" />
      </div>
    </BoardProvider>
  );
}

function MenuBar({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        className,
        "flex flex-row items-center justify-start p-2 bg-gray-300"
      )}
    >
      <button className="p-2 m-1 bg-white hover:bg-gray-100 rounded shadow">
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>
  );
}

function BoardProvider({ children }: { children: React.ReactNode }) {
  const board = useMemo(
    () => ({
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
          tags: ["errand", "home"],
        },
        {
          id: "card-2",
          title: "Watch my favorite show",
          description: "The new season is about to start",
          columnId: "column-1",
          tags: ["entertainment", "home"],
        },
        {
          id: "card-3",
          title: "Charge my phone",
          description: "The battery is about to die",
          columnId: "column-2",
          tags: ["errand", "home"],
        },
        {
          id: "card-4",
          title: "Cook dinner",
          description: "We need to eat",
          columnId: "column-3",
          tags: ["errand", "home"],
        },
      ],
    }),
    []
  );
  return <BoardContex.Provider value={board}>{children}</BoardContex.Provider>;
}

function Board({ className }: { className?: string }) {
  const board = useBoard();
  return (
    <div
      className={cx(
        className,
        "flex flex-row min-w-full h-full p-2 overflow-x-scroll"
      )}
    >
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
  tags: string[];
};

function Column({ id, className }: { id: Id; className?: string }) {
  const column = useColumn(id);
  return (
    <section
      className={cx(
        className,
        "p-2 m-2 flex flex-col gap-2 bg-gray-200 rounded"
      )}
    >
      <div className="px-3 py-2">
        <h2 className="text-xl font-bold text-gray-800">{column.title}</h2>
        <div className="text-gray-500">{column.cards.length} cards</div>
      </div>
      {column.cards.map((cardId) => (
        <Card key={cardId} id={cardId} />
      ))}
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
  const [areDetailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <div
        className="p-3 bg-white hover:bg-slate-100 rounded shadow cursor-pointer"
        onClick={() => setDetailsOpen(true)}
      >
        <h3 className="text-lg font-bold mb-3">{card.title}</h3>
        <div className="flex gap-2">
          {card.tags.map((tag) => (
            <CardTag tag={tag} />
          ))}
        </div>
      </div>
      <CardDetails
        id={id}
        isOpen={areDetailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
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

function CardTag({ tag }: { tag: string }) {
  return (
    <span className="px-2 py-1 text-sm text-gray-800 bg-gray-200 rounded">
      #{tag}
    </span>
  );
}

const modalRoot = document.createElement("div");
modalRoot.setAttribute("id", "modal-root");
document.body.appendChild(modalRoot);

function CardDetails({
  id,
  isOpen,
  onClose,
}: {
  id: Id;
  isOpen: boolean;
  onClose: () => void;
}) {
  const card = useCard(id);

  if (!isOpen) {
    return null;
  }

  // return createPortal(
  //   <div className="fixed inset-0 flex items-center justify-center">
  //     <div className="bg-white rounded shadow p-4">
  //       <h2 className="text-xl font-bold">{card.title}</h2>
  //       <p>{card.description}</p>
  //     </div>
  //   </div>,
  //   modalRoot
  // );

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10"
      onClick={onClose}
    >
      <div className="bg-white rounded shadow p-4">
        <h2 className="text-xl font-bold">{card.title}</h2>
        <p>{card.description}</p>
      </div>
    </div>
  );
}
