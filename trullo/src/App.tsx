import { BoardProvider } from "./data";
import { TopMenuBar } from "./TopMenuBar";
import { Board } from "./Board";
import { ReactNode, useState } from "react";
import cx from "classnames";

export function AppV0() {
  return (
    <BoardProvider>
      <div className="w-screen h-screen flex flex-col overflow-x-hidden bg-gray-100">
        <TopMenuBar className="hidden" />
        <Board className="flex-1" />
      </div>
    </BoardProvider>
  );
}

export function App() {
  return (
    <BoardProvider>
      <header>
        <h1>Kanban Board</h1>
      </header>

      <nav>
        <ul className="flex gap-2">
          <li>
            <a href="#todo">To Do</a>
          </li>
          <li>
            <a href="#inprogress">In Progress</a>
          </li>
          <li>
            <a href="#done">Done</a>
          </li>
        </ul>
      </nav>

      <main className="board">
        <section id="todo" className="column">
          <h2>To Do</h2>
          <Card title="Lorem ispum dolor sit amet, consectetur adipiscing elit." />
          <Card title="Task #2" />
        </section>

        <section id="inprogress" className="column">
          <h2>In Progress</h2>
          <article className="card">
            <p className="card-body">Description for Task 3</p>
          </article>
        </section>

        <section id="done" className="column">
          <h2>Done</h2>
          <article className="card">
            <p className="card-body">Description for Task 4</p>
          </article>
        </section>
      </main>

      <aside className="hidden">
        <h2>Card Details</h2>
        <article>
          <h3>Selected Card</h3>
          <p>Description for the selected card.</p>
        </article>
      </aside>

      <footer>
        <p>&copy; 2023 Kanban Board. All rights reserved.</p>
      </footer>
    </BoardProvider>
  );
}

const Card = ({ title, avatar }: { title: string; avatar?: ReactNode }) => {
  return (
    <article className="bg-gray-200 shadow-black rounded-xl p-4 w-72 flex flex-col gap-4 relative">
      <figure className="inline-block w-10 h-10 rounded-full overflow-hidden">
        <img src="https://via.placeholder.com/150" alt="Avatar" />
        <figcaption className="sr-only">Avatar</figcaption>
      </figure>
      <p className="text-base font-normal">{title}</p>
      <ul className="flex flex-row gap-1 flex-wrap">
        {["design", "frontend", "backend", "devops", "testing"].map((tag) => (
          <li key={tag} className="bg-gray-50 rounded-xl px-2 py-1 text-sm">
            #{tag}
          </li>
        ))}
      </ul>
    </article>
  );
};
