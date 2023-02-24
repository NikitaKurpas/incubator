import cx from "classnames";

export function Chip({
  label,
  style = "subtle",
}: {
  label: string;
  style?: "solid" | "subtle" | "outline";
}) {
  return (
    <span className="px-3 py-1 text-sm text-gray-500 border border-gray-200 rounded">
      {label}
    </span>
  );
}
