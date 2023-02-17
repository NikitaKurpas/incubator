// import { createPortal } from "react-dom";

import { FC, HTMLAttributes } from "react";
import { Id, useCard, useColumn } from "./data";
import { Chip } from "./Tag";

const modalRoot = document.createElement("div");
modalRoot.setAttribute("id", "modal-root");
document.body.appendChild(modalRoot);

export function CardDialog({
  id,
  isOpen,
  onClose,
}: {
  id: Id;
  isOpen: boolean;
  onClose: () => void;
}) {
  const card = useCard(id);
  const column = useColumn(card.columnId);

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h1 className="mb-8 text-2xl">{card.title}</h1>

        <div className="mb-8 grid grid-cols-3 gap-y-4 items-baseline">
          <span className="flex gap-2 items-baseline text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 self-center"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6h.008v.008H6V6z"
              />
            </svg>
            Tags
          </span>
          <div className="col-span-2 flex gap-2">
            {card.tags.map((tag) => (
              <Chip tag={tag} key={tag} />
            ))}
          </div>
          <span className="flex gap-2 items-baseline text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 self-center"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
            List
          </span>
          <div className="col-span-2">
            <button className="px-3 py-1 rounded bg-gray-200 text-sm text-gray-800 font-medium">
              {column.title}
            </button>
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
