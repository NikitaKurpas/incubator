import cx from "classnames";

export function Chip({
  label,
  style = "subtle",
}: {
  label: string;
  style?: "solid" | "subtle" | "outline";
}) {
  return (
    <span className={cx("px-3 py-1 text-sm rounded", styles[style])}>
      {label}
    </span>
  );
}

const styles = {
  subtle: "text-gray-500 bg-gray-100 border border-gray-200",
  solid: "text-white bg-gray-500",
  outline: "text-gray-500 border border-gray-200",
};
