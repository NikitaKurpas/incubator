import { useState } from "react";
import cx from "classnames";
import { Card } from "./Card";
import { Id, useBoardActions, useColumn } from "./data";
import { InputCard } from "./InputCard";

export function Column({ id, className }: { id: Id; className?: string }) {
  const column = useColumn(id);
  const { addCard } = useBoardActions();
  const [isAddingCard, setAddingCard] = useState(false);

  return (
    <section className={cx(className, "flex flex-col gap-8")}>
      <div className="flex gap-4 items-baseline">
        <h2 className="text-xl text-gray-600">{column.title}</h2>
        <div className="h-6 w-7 flex items-center justify-center bg-gray-200 rounded text-md text-gray-600 font-medium">
          {column.cards.length}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {column.cards.map((cardId) => (
          <Card key={cardId} id={cardId} />
        ))}

        {isAddingCard ? (
          <InputCard
            onCancel={() => setAddingCard(false)}
            onSubmit={(title) => {
              addCard({ title, columnId: id });
              setAddingCard(false);
            }}
          />
        ) : (
          <button
            className="flex gap-2 items-center text-md text-gray-800"
            onClick={() => setAddingCard(true)}
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
                d="M12 6v12m6-6H6"
              />
            </svg>
            Add card
          </button>
        )}
      </div>
    </section>
  );
}
