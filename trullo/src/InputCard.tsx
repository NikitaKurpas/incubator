import { useEffect, useMemo, useRef } from "react";

export function InputCard({
  onSubmit,
  onCancel,
  autofocus = true,
}: {
  onSubmit: (title: string) => void;
  onCancel: () => void;
  autofocus?: boolean;
}) {
  const handleAddCard = useMemo(
    () => () => {
      const input = inputRef.current;
      const text = input?.value;

      if (text) {
        onSubmit(text);
      }
    },
    []
  );

  const handleInputKeyUp = useMemo(
    () => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleAddCard();
      } else if (event.key === "Escape") {
        onCancel();
      }
    },
    []
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <div className="px-8 py-6 flex flex-col gap-3 bg-white rounded-lg shadow">
      <input
        type="text"
        placeholder="Enter a title for this card..."
        className="text-lg text-gray-800"
        onKeyUp={handleInputKeyUp}
        ref={inputRef}
      />
      <div className="flex gap-2">
        <button
          className="px-3 py-1 rounded bg-gray-800 text-sm text-white"
          onClick={handleAddCard}
        >
          Add card
        </button>
        <button className="text-gray-800" onClick={onCancel}>
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
      </div>
    </div>
  );
}
