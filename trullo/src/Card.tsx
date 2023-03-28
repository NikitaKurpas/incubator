import { ElementType, useState } from "react";
// import { CardDialog } from "./CardDialog";
import { Id, useCard } from "./data";
import { Chip } from "./Chip";

export function Card({ id }: { id: Id }) {
  const card = useCard(id);
  const [areDetailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <UICard onClick={() => setDetailsOpen(true)}>
        <span className="text text-gray-800">{card.title}</span>

        {card.tags.length > 0 && (
          <div className="flex gap-2">
            {card.tags.map((tag) => (
              <Chip key={tag} label={tag} style="outline" />
            ))}
          </div>
        )}
      </UICard>

      {/* <CardDialog
        id={id}
        isOpen={areDetailsOpen}
        onClose={() => setDetailsOpen(false)}
      /> */}
    </>
  );
}

export function UICard<T extends keyof JSX.IntrinsicElements>({
  as: Component = "div",
  ...rest
}: { as?: string } & React.ComponentPropsWithoutRef<T>) {
  return (
    <Component
      className="px-6 py-4 flex flex-col gap-3 bg-white border border-gray-200 rounded shadow cursor-pointer"
      {...rest}
    />
  );
}
