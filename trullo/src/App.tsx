import { BoardProvider } from "./data";
import { TopMenuBar } from "./TopMenuBar";
import { Board } from "./Board";

export function App() {
  return (
    <BoardProvider>
      <div className="w-screen h-screen flex flex-col overflow-x-hidden bg-gray-100">
        <TopMenuBar className="hidden" />
        <Board className="flex-1" />
      </div>
    </BoardProvider>
  );
}

