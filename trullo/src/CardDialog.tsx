// import { createPortal } from "react-dom";

import {
  FC,
  HTMLAttributes,
  PropsWithChildren,
  createContext,
  useState,
  useContext,
} from "react";
import { Id, useBoard, useBoardActions, useCard, useColumn } from "./data";
import { Chip } from "./Chip";
import { XMarkIcon, TagIcon, Bars4Icon } from "@heroicons/react/20/solid";

export const useCardDialog = () => {
  const context = useContext(CardDialogContext);
  if (!context) {
    throw new Error("useCardDialog must be used within a CardDialogProvider");
  }
  return context;
};

const CardDialogContext = createContext<{
  isOpen: boolean;
  open: (id: Id) => void;
  close: () => void;
  cardId: Id | null;
} | null>(null);

export const CardDialogProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cardId, setCardId] = useState<Id | null>(null);

  const open = (id: Id) => {
    setCardId(id);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <CardDialogContext.Provider value={{ isOpen, open, close, cardId }}>
      {children}
      <CardDialog
        isOpen={isOpen}
        id={cardId}
        onClose={() => setIsOpen(false)}
      />
    </CardDialogContext.Provider>
  );
};

function CardDialog({
  id,
  isOpen,
  onClose,
}: {
  id: Id;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { cardId } = useCardDialog();
  const card = useCard(id);
  const column = useColumn(card.columnId);
  const board = useBoard();
  const { moveCard } = useBoardActions();

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
    <Backdrop onClick={onClose}>
      <div
        className="z-10 w-full mx-4 p-8 relative bg-white rounded-xl shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h1 className="mb-8 text-2xl">{card.title}</h1>

        <div className="mb-8 grid grid-cols-3 gap-y-4 items-baseline">
          <span className="flex gap-2 items-baseline text-gray-600">
            <TagIcon className="h-6 w-6 self-center" />
            Tags
          </span>
          <div className="col-span-2 flex gap-2">
            {card.tags.map((tag) => (
              <Chip label={tag} key={tag} />
            ))}
          </div>
          <span className="flex gap-2 items-baseline text-gray-600">
            <Bars4Icon className="h-6 w-6 self-center" />
            List
          </span>
          <div className="col-span-2">
            <select
              value={column.id}
              onChange={(e) => moveCard({ id, columnId: e.target.value })}
              className="block w-full text-sm text-gray-800 font-medium"
            >
              {board.columns.map((column) => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
            {/* <Menu as="div" className="relative">
              <Menu.Button className="px-3 py-1 rounded bg-gray-200 text-sm text-gray-800 font-medium">
                {column.title}
              </Menu.Button>

              <Menu.Items className="absolute left-0 w-32 p-1 bg-white rounded shadow-lg">
                {board.columns.map((column) => (
                  <Menu.Item>
                    <button
                      key={column.id}
                      className="block w-full ui-active:bg-blue-100"
                    >
                      {column.title}
                    </button>
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Menu> */}
          </div>
        </div>

        <hr className="my-8" />

        <p>{card.description}</p>
      </div>
    </Backdrop>
  );
}

const Backdrop: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <div
    className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10"
    {...props}
  ></div>
);

// const modalRoot = document.createElement("div");
// modalRoot.setAttribute("id", "modal-root");
// document.body.appendChild(modalRoot);
