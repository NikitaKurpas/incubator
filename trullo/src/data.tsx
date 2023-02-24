import {
  createContext,
  Dispatch,
  useContext,
  useMemo,
  useReducer,
} from "react";

export type Id = string;

export type KanbanBoard = {
  id: Id;
  columns: KanbanColumn[];
  cards: KanbanCard[];
};

export type KanbanColumn = {
  id: Id;
  title: string;
  cards: Id[];
  boardId: Id;
};

export type KanbanCard = {
  id: Id;
  title: string;
  description?: string;
  columnId: Id;
  tags: string[];
};

export function useBoard(): KanbanBoard {
  const board = useContext(BoardContex);
  if (!board) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return board;
}

export function useColumn(id: Id): KanbanColumn {
  const board = useBoard();
  const column = board.columns.find((column) => column.id === id);
  if (!column) {
    throw new Error(`Column with id ${id} not found`);
  }
  return column;
}

export function useCard(id: Id): KanbanCard {
  const board = useBoard();
  const card = board.cards.find((card) => card.id === id);
  if (!card) {
    throw new Error(`Card with id ${id} not found`);
  }
  return card;
}

export function useBoardActions(): BoardActions {
  const dispatch = useContext(BoardDispatchContext);
  if (!dispatch) {
    throw new Error("useBoardActions must be used within a BoardProvider");
  }

  const actions: BoardActions = useMemo(
    () => ({
      addCard: (input) => {
        dispatch({ type: "ADD_CARD", payload: input });
      },
      updateCard: (input) => {
        dispatch({ type: "UPDATE_CARD", payload: input });
      },
      moveCard: (input) => {
        dispatch({ type: "MOVE_CARD", payload: input });
      },
    }),
    [dispatch]
  );

  return actions;
}

type BoardActions = {
  addCard: AddCardFn;
  updateCard: UpdateCardFn;
  moveCard: MoveCardFn;
};
type AddCardFn = (input: AddCardPayload) => void;
type AddCardPayload = { title: string; columnId: string };
type UpdateCardFn = (input: UpdateCardPayload) => void;
type UpdateCardPayload = {
  id: string;
  title?: string;
  description?: string;
  tags?: string[];
};
type MoveCardFn = (input: MoveCardPayload) => void;
type MoveCardPayload = { id: string; columnId: string };

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [board, dispatch] = useReducer(boardReducer, initialBoard);
  console.log("board", board);

  return (
    <BoardDispatchContext.Provider value={dispatch}>
      <BoardContex.Provider value={board}>{children}</BoardContex.Provider>
    </BoardDispatchContext.Provider>
  );
}

const boardReducer = (
  state: KanbanBoard,
  action: BoardReducerAction
): KanbanBoard => {
  switch (action.type) {
    case "ADD_CARD": {
      const { columnId, title } = action.payload;
      const card: KanbanCard = {
        id: `card-${state.cards.length + 1}`,
        title,
        columnId,
        tags: [],
      };

      return {
        ...state,
        cards: [...state.cards, card],
        columns: state.columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              cards: [...column.cards, card.id],
            };
          }
          return column;
        }),
      };
    }
    case "UPDATE_CARD": {
      const { id, title, description, tags } = action.payload;

      return {
        ...state,
        cards: state.cards.map((card) => {
          if (card.id === id) {
            return {
              ...card,
              title: title ?? card.title,
              description: description ?? card.description,
              tags: tags ?? card.tags,
            };
          }
          return card;
        }),
      };
    }
    case "MOVE_CARD": {
      const { id, columnId } = action.payload;

      return {
        ...state,
        cards: state.cards.map((card) => {
          if (card.id === id) {
            return {
              ...card,
              columnId,
            };
          }
          return card;
        }),
        columns: state.columns.map((column) => {
          if (column.id === columnId) {
            return {
              ...column,
              cards: [...column.cards, id],
            };
          }
          return {
            ...column,
            cards: column.cards.filter((cardId) => cardId !== id),
          };
        }),
      };
    }
    default: {
      return state;
    }
  }
};

type BoardReducerAction =
  | { type: "ADD_CARD"; payload: AddCardPayload }
  | { type: "UPDATE_CARD"; payload: UpdateCardPayload }
  | { type: "MOVE_CARD"; payload: MoveCardPayload };

const initialBoard: KanbanBoard = {
  id: "board-1",
  columns: [
    {
      id: "column-1",
      title: "To do",
      cards: ["card-1", "card-2"],
      boardId: "board-1",
    },
    {
      id: "column-2",
      title: "In progress",
      cards: ["card-3"],
      boardId: "board-1",
    },
    { id: "column-3", title: "Done", cards: ["card-4"], boardId: "board-1" },
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
};

const BoardContex = createContext<KanbanBoard | null>(null);
const BoardDispatchContext = createContext<Dispatch<BoardReducerAction> | null>(
  null
);
