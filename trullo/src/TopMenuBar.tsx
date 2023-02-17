import cx from "classnames";

export function TopMenuBar({ className }: { className?: string }) {
  return <div className={cx(className, "h-16 border-b border-gray-300")}></div>;
}
