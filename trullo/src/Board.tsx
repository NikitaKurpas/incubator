import cx from "classnames";
import { FC, PropsWithChildren } from "react";
import { Column } from "./Column";
import { useBoard } from "./data";

export function Board({ className }: { className?: string }) {
  const board = useBoard();
  return (
    <div
      className={cx(className, "min-w-full h-full py-8 flex flex-col gap-10")}
      data-testid="board"
    >
      <h1 className="px-8 text-4xl font-medium text-gray-600">Board Title</h1>
      <div className="flex-1 px-8 flex flex-row gap-8 overflow-x-scroll">
        {board.columns.map((column) => (
          <Column key={column.id} id={column.id} className="w-80 flex-none" />
        ))}
      </div>
    </div>
  );
}
