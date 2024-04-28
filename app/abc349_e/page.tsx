"use client";

import clsx from "clsx";
import { StrictMode, useState } from "react";
import { z } from "zod";

const A_MIN = -100;
const A_MAX = 100;

// 2次元配列で持つとややこしそうなので1次元にする
type String9 = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

type Player =
  | "first" // Takahashi, red
  | "second"; // Aoki, blue
type Owner = { score: number; player: Player | null };
type Owner9 = [Owner, Owner, Owner, Owner, Owner, Owner, Owner, Owner, Owner];

type State = { step: "input"; grid: String9 } | { step: "play"; grid: Owner9 };

const GridCell = z.coerce.number().int().min(A_MIN).max(A_MAX);

export default function ABC349_E() {
  const [state, setState] = useState<State>({
    step: "input",
    grid: [
      // row1
      "-1",
      "1",
      "0",
      // row2
      "-4",
      "-2",
      "-5",
      // row3
      "-4",
      "-1",
      "-5",
    ],
  });
  const [player, setPlayer] = useState<Player>("first");

  let hint = null;

  if (state.step === "input") {
    const grid = string9ToOwner9(state.grid);
    if (grid !== null) {
      const { result } = solve(grid);
      if (result === "first") {
        hint = "First-player win game";
      }
      if (result === "second") {
        hint = "Second-player win game";
      }
    }
  }

  let gameResult = null;
  let score = { first: 0, second: 0 };

  if (state.step === "play") {
    switch (judge(state.grid)) {
      case "draw":
        gameResult = "Draw";
        break;
      case "first":
        if (player === "first") {
          gameResult = "You win! 🎉";
        } else {
          gameResult = "You lose...";
        }
        break;
      case "second":
        if (player === "second") {
          gameResult = "You win! 🎉";
        } else {
          gameResult = "You lose...";
        }
        break;
      default: {
        const rest = state.grid.filter((c) => c.player === null).length;
        const isCpuTurn =
          rest >= 1 && player === "first" ? rest % 2 === 0 : rest % 2 === 1;
        if (isCpuTurn) {
          const p = choosePosition(state.grid);
          const newGrid = structuredClone(state.grid);
          newGrid[p] = {
            ...state.grid[p],
            player: player === "first" ? "second" : "first",
          };
          if (rest < state.grid.length) {
            setState({ step: "play", grid: newGrid });
          } else {
            // CPU first turn
            setTimeout(() => {
              setState({ step: "play", grid: newGrid });
            }, 200);
          }
        }
      }
    }
    score = calculateScore(state.grid);
  }

  // step: "input" -> "play"
  const handleStartButtonClick = () => {
    if (state.step === "input") {
      const grid = string9ToOwner9(state.grid);
      if (grid !== null) {
        setState({ step: "play", grid });
      }
    }
  };

  return (
    <StrictMode>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Problem
          </h1>
          <a
            className="inline-block mt-2 leading-6 text-indigo-600 hover:text-indigo-500"
            href="https://atcoder.jp/contests/abc349/tasks/abc349_e"
            target="blank"
          >
            ABC349 E - Weighted Tic-Tac-Toe
          </a>
          {state.step === "input" ? (
            <>
              <GridInput
                grid={state.grid}
                setGrid={(newGrid) => setState({ ...state, grid: newGrid })}
              />
            </>
          ) : (
            <>
              <GridButton
                player={player}
                grid={state.grid}
                setGrid={(newGrid) => setState({ ...state, grid: newGrid })}
              />
            </>
          )}
          <div className="grid place-items-center mt-2">
            <p className="text-sm text-gray-500">
              {A_MIN} ≦ A<sub>i,j</sub> ≦ {A_MAX}
            </p>
          </div>
          <div className="grid place-items-center mt-4">
            <label className="text-base font-semibold text-gray-900">
              Your Hand
            </label>
          </div>
          <div className="mt-2 space-y-2 sm:flex sm:items-center sm:justify-center sm:space-x-10 sm:space-y-0">
            <div className="flex items-center justify-center">
              <input
                id="hand_first"
                name="hand"
                type="radio"
                className={clsx(
                  "h-4 w-4 border-gray-300 text-rose-600 focus:ring-rose-600",
                  state.step === "input"
                    ? "cursor-pointer"
                    : "cursor-not-allowed",
                )}
                checked={player === "first"}
                onChange={(_e) => setPlayer("first")}
                disabled={state.step === "play"}
              />
              <label
                htmlFor="hand_first"
                className="ml-2 block text-sm font-medium leading-6 text-gray-900"
              >
                First
              </label>
            </div>
            <div className="flex items-center justify-center">
              <input
                id="hand_second"
                name="hand"
                type="radio"
                className={clsx(
                  "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600",
                  state.step === "input"
                    ? "cursor-pointer"
                    : "cursor-not-allowed",
                )}
                checked={player === "second"}
                onChange={(_e) => setPlayer("second")}
                disabled={state.step === "play"}
              />
              <label
                htmlFor="hand_second"
                className="ml-2 block text-sm font-medium leading-6 text-gray-900"
              >
                Second
              </label>
            </div>
          </div>
          <div className="grid place-items-center mt-4">
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300"
              onClick={handleStartButtonClick}
              disabled={
                state.step === "play" ||
                state.grid.some((s) => !GridCell.safeParse(s).success)
              }
            >
              Start
            </button>
          </div>
          {state.step === "input" && hint && (
            <div className="grid place-items-center mt-4">
              <p className="text-sm text-gray-500">hint: {hint}</p>
            </div>
          )}
          {state.step === "play" && (
            <>
              <div className="grid place-items-center mt-12">
                <span className="text-base font-semibold text-gray-900">
                  Score
                </span>
                <p className="grid grid-cols-2 gap-x-3 mt-2 ml-10 text-gray-900">
                  <span className="text-right">
                    You ({player === "first" ? "First" : "Second"})
                  </span>
                  <span>{player === "first" ? score.first : score.second}</span>
                </p>
                <p className="grid grid-cols-2 gap-x-3 mt-1 ml-10 text-gray-900">
                  <span className="text-right">
                    CPU ({player === "first" ? "Second" : "First"})
                  </span>
                  <span>{player === "first" ? score.second : score.first}</span>
                </p>
              </div>
              <div className="grid place-items-center mt-4">{gameResult}</div>
            </>
          )}
        </div>
      </div>
    </StrictMode>
  );
}

function GridInput({
  grid,
  setGrid,
}: {
  grid: String9;
  setGrid: (newGrid: String9) => void;
}) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    i: number,
    j: number,
  ) => {
    const value = e.target.value;
    const newGrid = structuredClone(grid);
    newGrid[i * 3 + j] = value;
    setGrid(newGrid);
  };

  return (
    <div className="grid place-items-center mt-8">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="grid grid-flow-col place-items-start border-t last:border-b border-gray-400"
        >
          {[0, 1, 2].map((j) => {
            const index = i * 3 + j;
            const isError = !GridCell.safeParse(grid[index]).success;
            return (
              <div
                key={j}
                className="grid place-items-center h-20 w-20 px-3 border-l last:border-r border-gray-400"
              >
                <div className="relative">
                  <input
                    type="text"
                    min={A_MIN}
                    max={A_MAX}
                    inputMode="numeric"
                    className={clsx(
                      "peer block w-full border-0 bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6",
                      {
                        "text-red-500": isError,
                      },
                    )}
                    value={grid[index]}
                    onChange={(e) => handleChange(e, i, j)}
                  />
                  <div
                    className={clsx(
                      "absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600",
                      {
                        "border-red-300 peer-focus:border-red-500": isError,
                      },
                    )}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function GridButton({
  player,
  grid,
  setGrid,
}: {
  player: Player;
  grid: Owner9;
  setGrid: (newGrid: Owner9) => void;
}) {
  const ongoing = judge(grid) === null;
  const rest = grid.filter((c) => c.player === null).length;
  const isYourTurn =
    ongoing &&
    rest >= 1 &&
    (player === "first" ? rest % 2 === 1 : rest % 2 === 0);

  const handleClick = (i: number, j: number) => {
    if (isYourTurn) {
      const newGrid = structuredClone(grid);
      newGrid[i * 3 + j] = { ...grid[i * 3 + j], player };
      setGrid(newGrid);
    }
  };

  return (
    <div className="grid place-items-center mt-8">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="grid grid-flow-col place-items-start border-t last:border-b border-gray-400"
        >
          {[0, 1, 2].map((j) => {
            const index = i * 3 + j;
            return (
              <div
                key={j}
                className={clsx(
                  "grid place-items-center h-20 w-20 border-l last:border-r border-gray-400",
                  grid[index].player === "first" && "bg-rose-100",
                  grid[index].player === "second" && "bg-indigo-100",
                  grid[index].player !== null &&
                    grid[index].player !== player &&
                    "transition-colors duration-500",
                  grid[index].player === null &&
                    isYourTurn &&
                    (player === "first"
                      ? "hover:bg-rose-100"
                      : "hover:bg-indigo-100"),
                )}
              >
                <button
                  type="button"
                  className="block h-full w-full"
                  disabled={!(grid[index].player === null && isYourTurn)}
                  onClick={(_e) => handleClick(i, j)}
                >
                  {grid[index].score}
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function string9ToOwner9(grid: String9): Owner9 | null {
  const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = [
    GridCell.safeParse(grid[0 * 3 + 0]),
    GridCell.safeParse(grid[0 * 3 + 1]),
    GridCell.safeParse(grid[0 * 3 + 2]),
    GridCell.safeParse(grid[1 * 3 + 0]),
    GridCell.safeParse(grid[1 * 3 + 1]),
    GridCell.safeParse(grid[1 * 3 + 2]),
    GridCell.safeParse(grid[2 * 3 + 0]),
    GridCell.safeParse(grid[2 * 3 + 1]),
    GridCell.safeParse(grid[2 * 3 + 2]),
  ];
  if (
    a00.success &&
    a01.success &&
    a02.success &&
    a10.success &&
    a11.success &&
    a12.success &&
    a20.success &&
    a21.success &&
    a22.success
  ) {
    return [
      { score: a00.data, player: null },
      { score: a01.data, player: null },
      { score: a02.data, player: null },
      { score: a10.data, player: null },
      { score: a11.data, player: null },
      { score: a12.data, player: null },
      { score: a20.data, player: null },
      { score: a21.data, player: null },
      { score: a22.data, player: null },
    ];
  }
  return null;
}

function choosePosition(grid: Owner9): number {
  const { index } = solve(structuredClone(grid));
  return randomChoice(index);
}

type SolveReturnType = { index: number[]; result: Player | "draw" };

function solve(
  grid: Owner9,
  memo: Map<string, SolveReturnType> = new Map(),
): SolveReturnType {
  const key = JSON.stringify(grid);
  const value = memo.get(key);
  if (value !== undefined) {
    return value;
  }

  const result = judge(grid);
  if (result !== null) {
    return { index: [], result };
  }

  const first = grid.filter((c) => c.player === "first").length;
  const second = grid.filter((c) => c.player === "second").length;
  const turn = first === second ? "first" : "second";

  const win: number[] = [];
  const draw: number[] = [];
  const lose: number[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      if (grid[index].player === null) {
        grid[index].player = turn;
        const { result } = solve(grid, memo);
        if (result === turn) {
          win.push(index);
        } else if (result === "draw") {
          draw.push(index);
        } else {
          lose.push(index);
        }
        grid[index].player = null;
      }
    }
  }

  if (win.length >= 1) {
    const valueWin = { index: win, result: turn } as const;
    memo.set(key, valueWin);
    return valueWin;
  }

  if (draw.length >= 1) {
    const valueDraw = { index: draw, result: "draw" } as const;
    memo.set(key, valueDraw);
    return valueDraw;
  }

  const valueLose = {
    index: lose,
    result: turn === "first" ? "second" : "first",
  } as const;
  memo.set(key, valueLose);
  return valueLose;
}

function judge(grid: Owner9): Player | "draw" | null {
  // 縦3
  for (let j = 0; j < 3; j++) {
    if ([0, 1, 2].every((i) => grid[i * 3 + j].player === "first")) {
      return "first";
    }
    if ([0, 1, 2].every((i) => grid[i * 3 + j].player === "second")) {
      return "second";
    }
  }
  // 横3
  for (let i = 0; i < 3; i++) {
    if ([0, 1, 2].every((j) => grid[i * 3 + j].player === "first")) {
      return "first";
    }
    if ([0, 1, 2].every((j) => grid[i * 3 + j].player === "second")) {
      return "second";
    }
  }
  // ななめ3
  if (
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ].every(([i, j]) => grid[i * 3 + j].player === "first")
  ) {
    return "first";
  }
  if (
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ].every(([i, j]) => grid[i * 3 + j].player === "first")
  ) {
    return "first";
  }
  if (
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ].every(([i, j]) => grid[i * 3 + j].player === "second")
  ) {
    return "second";
  }
  if (
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ].every(([i, j]) => grid[i * 3 + j].player === "second")
  ) {
    return "second";
  }

  const rest = grid.filter((c) => c.player === null).length;
  if (rest >= 1) {
    return null;
  }

  const score = calculateScore(grid);
  if (score.first > score.second) {
    return "first";
  }
  if (score.first < score.second) {
    return "second";
  }
  return "draw";
}

function calculateScore(grid: Owner9): { first: number; second: number } {
  let scoreFirst = 0;
  let scoreSecond = 0;
  for (const c of grid) {
    if (c.player === "first") {
      scoreFirst += c.score;
    }
    if (c.player === "second") {
      scoreSecond += c.score;
    }
  }
  return { first: scoreFirst, second: scoreSecond };
}

function randomChoice<T>(array: T[]): T {
  // array.length >= 1
  return array[Math.floor(Math.random() * array.length)];
}
