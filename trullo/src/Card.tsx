import { useState } from "react";
import { CardDialog } from "./CardDialog";
import { Id, useCard } from "./data";
import { Chip } from "./Chip";

export function Card({ id }: { id: Id }) {
  const card = useCard(id);
  const [areDetailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <div
        className="px-6 py-4 flex flex-col gap-3 bg-white rounded-lg shadow cursor-pointer"
        onClick={() => setDetailsOpen(true)}
      >
        <h3 className="text-lg text-gray-800">{card.title}</h3>

        {card.tags.length > 0 && (
          <div className="flex gap-2">
            {card.tags.map((tag) => (
              <Chip tag={tag} key={tag} />
            ))}
          </div>
        )}
      </div>

      <CardDialog
        id={id}
        isOpen={areDetailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
}
