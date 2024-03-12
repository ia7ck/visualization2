"use client";

import { CubeIcon, FlagIcon, UserIcon } from "@heroicons/react/16/solid";
import { ArrowUturnLeftIcon } from "@heroicons/react/16/solid";
import { StrictMode, useEffect, useState } from "react";
import { z } from "zod";

const X_MIN = -5;
const X_MAX = 5;
const Y_MIN = X_MIN;
const Y_MAX = X_MAX;

const PositionX = z.coerce.number().int().min(X_MIN).max(X_MAX);
const PositionY = z.coerce.number().int().min(Y_MIN).max(Y_MAX);
const XY = z.object({ x: PositionX, y: PositionY });
type XY = z.infer<typeof XY>;

const StartPositions = z
  .object({ player: XY, cargo: XY, goal: XY })
  .refine(({ player, cargo }) => player.x !== cargo.x || player.y !== cargo.y, {
    message: "Player and cargo cannot be at the same position.",
    path: ["player", "cargo"],
  })
  .refine(({ cargo, goal }) => cargo.x !== goal.x || cargo.y !== goal.y, {
    message: "Cargo and goal cannot be at the same position.",
    path: ["cargo", "goal"],
  });

export default function ABC323_F() {
  const [playerXText, setPlayerXText] = useState("1");
  const [playerYText, setPlayerYText] = useState("2");
  const [cargoXText, setCargoXText] = useState("3");
  const [cargoYText, setCargoYText] = useState("3");
  const [goalXText, setGoalXText] = useState("0");
  const [goalYText, setGoalYText] = useState("5");

  const [player, setPlayer] = useState({ x: 1, y: 2 });
  const [cargo, setCargo] = useState({ x: 3, y: 3 });
  const [goal, setGoal] = useState({ x: 0, y: 5 });

  const [actions, setActions] = useState(0);
  const [minActions, setMinActions] = useState(
    minimumActions(player, cargo, goal),
  );

  const startPositions = StartPositions.safeParse({
    player: { x: playerXText, y: playerYText },
    cargo: { x: cargoXText, y: cargoYText },
    goal: { x: goalXText, y: goalYText },
  });
  const finish = cargo.x === goal.x && cargo.y === goal.y;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const nextPositions = listNextPositions(player, cargo);
      let nextPosition: undefined | { player: XY; cargo: XY };
      if (e.key === "w") {
        nextPosition = nextPositions.find(
          ({ player: { x, y } }) => x === player.x && y === player.y + 1,
        );
      } else if (e.key === "a") {
        nextPosition = nextPositions.find(
          ({ player: { x, y } }) => x === player.x - 1 && y === player.y,
        );
      } else if (e.key === "s") {
        nextPosition = nextPositions.find(
          ({ player: { x, y } }) => x === player.x && y === player.y - 1,
        );
      } else if (e.key === "d") {
        nextPosition = nextPositions.find(
          ({ player: { x, y } }) => x === player.x + 1 && y === player.y,
        );
      }
      if (nextPosition) {
        handleCellClick(nextPosition);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // useEffectEvent を使うと依存値いらなくなるかも
    // https://ja.react.dev/learn/separating-events-from-effects
  }, [player, cargo]);

  function handleGachaButtonClick() {
    const player = {
      x: getRandomInt(X_MIN, X_MAX + 1),
      y: getRandomInt(Y_MIN, Y_MAX + 1),
    };
    const cargo = {
      x: getRandomInt(X_MIN, X_MAX + 1),
      y: getRandomInt(Y_MIN, Y_MAX + 1),
    };
    const goal = {
      x: getRandomInt(X_MIN, X_MAX + 1),
      y: getRandomInt(Y_MIN, Y_MAX + 1),
    };
    while (!StartPositions.safeParse({ player, cargo, goal }).success) {
      cargo.x = getRandomInt(X_MIN, X_MAX + 1);
      cargo.y = getRandomInt(Y_MIN, Y_MAX + 1);
    }

    setPlayerXText(player.x.toString());
    setPlayerYText(player.y.toString());
    setCargoXText(cargo.x.toString());
    setCargoYText(cargo.y.toString());
    setGoalXText(goal.x.toString());
    setGoalYText(goal.y.toString());

    setPlayer(player);
    setCargo(cargo);
    setGoal(goal);

    setActions(0);
    setMinActions(minimumActions(player, cargo, goal));
  }

  function handleCellClick(nextPosition?: { player: XY; cargo: XY }) {
    if (!finish && nextPosition) {
      setPlayer(nextPosition.player);
      setCargo(nextPosition.cargo);

      const distance =
        Math.abs(nextPosition.player.x - player.x) +
        Math.abs(nextPosition.player.y - player.y);
      setActions(actions + distance);
    }
  }

  function handleResetButtonClick() {
    if (startPositions.success) {
      const { player, cargo, goal } = startPositions.data;

      setPlayer(player);
      setCargo(cargo);
      setGoal(goal);

      setActions(0);
      setMinActions(minimumActions(player, cargo, goal));
    }
  }

  return (
    <StrictMode>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Problem
          </h1>
          <a
            className="inline-block mt-2 leading-6 text-indigo-600 hover:text-indigo-500"
            href="https://atcoder.jp/contests/abc323/tasks/abc323_f"
            target="blank"
          >
            ABC323 F - Push and Carry
          </a>
          <div className="grid place-items-center">
            <button
              type="button"
              className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={handleGachaButtonClick}
            >
              Gacha
            </button>
          </div>
          <div className="grid place-items-center mt-4">
            {range(Y_MIN - 1, Y_MAX + 1)
              .toReversed()
              .map((y) => (
                <div
                  key={y}
                  className="grid grid-flow-col place-items-start border-t last:border-b border-gray-400"
                >
                  {range(X_MIN - 1, X_MAX + 1).map((x) => {
                    let icon = null;
                    if (x === player.x && y === player.y) {
                      icon = <UserIcon className="inline-block h-6 w-6" />;
                    } else if (x === cargo.x && y === cargo.y) {
                      icon = <CubeIcon className="inline-block h-6 w-6" />;
                    } else if (x === goal.x && y === goal.y) {
                      icon = <FlagIcon className="inline-block h-6 w-6" />;
                    }
                    const nextP = listNextPositions(player, cargo).find(
                      ({ player }) => player.x === x && player.y === y,
                    );
                    return (
                      // biome-ignore lint/a11y/useKeyWithClickEvents: ;-;
                      <span
                        key={x}
                        className={`inline-block h-6 w-6 border-l last:border-r border-gray-400 ${
                          !finish && nextP ? "bg-green-100 cursor-pointer" : ""
                        }`}
                        data-y={y}
                        data-x={x}
                        onClick={() => handleCellClick(nextP)}
                      >
                        {icon}
                      </span>
                    );
                  })}
                </div>
              ))}
          </div>
          <div className="grid mt-2">
            <p className="text-center text-sm leading-6 text-gray-500">
              You can move with WASD keys.
            </p>
            <p className="grid grid-cols-2 gap-x-1  text-gray-900">
              <span className="text-right">actions:</span>
              <span>
                {actions} {finish && actions <= minActions && "🎉"}
              </span>
            </p>
            <p className="grid grid-cols-2 gap-x-1 text-gray-900">
              <span className="text-right">best:</span>
              <span>{minActions}</span>
            </p>
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300"
              onClick={handleResetButtonClick}
              disabled={!startPositions.success}
            >
              Reset to start positions
              <ArrowUturnLeftIcon
                className="-mr-0.5 h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            {X_MIN} ≦ X<sub>A</sub>, X<sub>B</sub>, X<sub>C</sub> ≦ {X_MAX}
            <br />
            {Y_MIN} ≦ Y<sub>A</sub>, Y<sub>B</sub>, Y<sub>C</sub> ≦ {Y_MAX}
            <br />
            (X<sub>A</sub>, Y<sub>A</sub>) ≠ (X<sub>B</sub>, Y<sub>B</sub>)
            <br />
            (X<sub>B</sub>, Y<sub>B</sub>) ≠ (X<sub>C</sub>, Y<sub>C</sub>)
          </p>
          <label
            htmlFor="player_x"
            className="block mt-2 text-sm font-medium leading-6 text-gray-900"
          >
            Takahashi&nbsp;
            <var>
              X<sub>A</sub>
            </var>
          </label>
          <input
            name="player_x"
            id="player_x"
            type="number"
            min={X_MIN}
            max={X_MAX}
            inputMode="numeric"
            className={`block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              !startPositions.success &&
              startPositions.error.issues.some(
                (issue) =>
                  (issue.path.includes("player") && issue.path.includes("x")) ||
                  (issue.path.includes("player") &&
                    issue.path.includes("cargo")),
              )
                ? "text-red-900 ring-red-300 focus:ring-red-500"
                : ""
            }`}
            value={playerXText}
            onChange={(e) => setPlayerXText(e.target.value)}
          />
          <label
            htmlFor="player_y"
            className="block mt-5 text-sm font-medium leading-6 text-gray-900"
          >
            Takahashi&nbsp;
            <var>
              Y<sub>A</sub>
            </var>
          </label>
          <input
            name="player_y"
            id="player_y"
            type="number"
            min={Y_MIN}
            max={Y_MAX}
            inputMode="numeric"
            className={`block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              !startPositions.success &&
              startPositions.error.issues.some(
                (issue) =>
                  (issue.path.includes("player") && issue.path.includes("y")) ||
                  (issue.path.includes("player") &&
                    issue.path.includes("cargo")),
              )
                ? "text-red-900 ring-red-300 focus:ring-red-500"
                : ""
            }`}
            value={playerYText}
            onChange={(e) => setPlayerYText(e.target.value)}
          />
          <label
            htmlFor="cargo_x"
            className="block mt-5 text-sm font-medium leading-6 text-gray-900"
          >
            Cargo&nbsp;
            <var>
              X<sub>B</sub>
            </var>
          </label>
          <input
            name="cargo_x"
            id="cargo_x"
            type="number"
            min={X_MIN}
            max={X_MAX}
            inputMode="numeric"
            className={`block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              !startPositions.success &&
              startPositions.error.issues.some(
                (issue) =>
                  issue.path.includes("cargo") && issue.path.includes("x"),
              )
                ? "text-red-900 ring-red-300 focus:ring-red-500"
                : ""
            }`}
            value={cargoXText}
            onChange={(e) => setCargoXText(e.target.value)}
          />
          <label
            htmlFor="cargo_y"
            className="block mt-5 text-sm font-medium leading-6 text-gray-900"
          >
            Cargo&nbsp;
            <var>
              Y<sub>B</sub>
            </var>
          </label>
          <input
            name="cargo_y"
            id="cargo_y"
            type="number"
            min={X_MIN}
            max={X_MAX}
            inputMode="numeric"
            className={`block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              !startPositions.success &&
              startPositions.error.issues.some(
                (issue) =>
                  issue.path.includes("cargo") && issue.path.includes("y"),
              )
                ? "text-red-900 ring-red-300 focus:ring-red-500"
                : ""
            }`}
            value={cargoYText}
            onChange={(e) => setCargoYText(e.target.value)}
          />
          <label
            htmlFor="goal_x"
            className="block mt-5 text-sm font-medium leading-6 text-gray-900"
          >
            Goal&nbsp;
            <var>
              X<sub>C</sub>
            </var>
          </label>
          <input
            name="goal_x"
            id="goal_x"
            type="number"
            min={X_MIN}
            max={X_MAX}
            inputMode="numeric"
            className={`block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              !startPositions.success &&
              startPositions.error.issues.some(
                (issue) =>
                  (issue.path.includes("goal") && issue.path.includes("x")) ||
                  (issue.path.includes("goal") && issue.path.includes("cargo")),
              )
                ? "text-red-900 ring-red-300 focus:ring-red-500"
                : ""
            }`}
            value={goalXText}
            onChange={(e) => setGoalXText(e.target.value)}
          />
          <label
            htmlFor="goal_y"
            className="block mt-5 text-sm font-medium leading-6 text-gray-900"
          >
            Goal&nbsp;
            <var>
              Y<sub>C</sub>
            </var>
          </label>
          <input
            name="goal_y"
            id="goal_y"
            type="number"
            min={X_MIN}
            max={X_MAX}
            inputMode="numeric"
            className={`block w-full rounded-md border-0 mt-2 mb-6 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              !startPositions.success &&
              startPositions.error.issues.some(
                (issue) =>
                  (issue.path.includes("goal") && issue.path.includes("y")) ||
                  (issue.path.includes("goal") && issue.path.includes("cargo")),
              )
                ? "text-red-900 ring-red-300 focus:ring-red-500"
                : ""
            }`}
            value={goalYText}
            onChange={(e) => setGoalYText(e.target.value)}
          />
        </div>
      </div>
    </StrictMode>
  );
}

function listNextPositions(player: XY, cargo: XY): { player: XY; cargo: XY }[] {
  const result: { player: XY; cargo: XY }[] = [];

  for (let y = player.y + 1; y <= Y_MAX + 1; y++) {
    if (player.x === cargo.x && y === cargo.y) {
      if (y + 1 <= Y_MAX + 1) {
        result.push({
          player: { ...player, y },
          cargo: { ...cargo, y: y + 1 },
        });
      }
      break;
    }
    result.push({ player: { ...player, y }, cargo });
  }

  for (let y = player.y - 1; y >= Y_MIN - 1; y--) {
    if (player.x === cargo.x && y === cargo.y) {
      if (y - 1 >= Y_MIN - 1) {
        result.push({
          player: { ...player, y },
          cargo: { ...cargo, y: y - 1 },
        });
      }
      break;
    }
    result.push({ player: { ...player, y }, cargo });
  }

  for (let x = player.x + 1; x <= X_MAX + 1; x++) {
    if (x === cargo.x && player.y === cargo.y) {
      if (x + 1 <= X_MAX + 1) {
        result.push({
          player: { ...player, x },
          cargo: { ...cargo, x: x + 1 },
        });
      }
      break;
    }
    result.push({ player: { ...player, x }, cargo });
  }

  for (let x = player.x - 1; x >= X_MIN - 1; x--) {
    if (x === cargo.x && player.y === cargo.y) {
      if (x - 1 >= X_MIN - 1) {
        result.push({
          player: { ...player, x },
          cargo: { ...cargo, x: x - 1 },
        });
      }
      break;
    }
    result.push({ player: { ...player, x }, cargo });
  }

  return result;
}

// https://atcoder.jp/contests/abc323/submissions/51186675
function minimumActions(player: XY, cargo: XY, goal: XY): number {
  function solve(player: XY, cargo: XY, goal: XY): number {
    const cargo_ = { x: cargo.x - player.x, y: cargo.y - player.y };
    const goal_ = { x: goal.x - player.x, y: goal.y - player.y };
    if (cargo_.x < 0) {
      cargo_.x *= -1;
      goal_.x *= -1;
    }
    if (cargo_.y < 0) {
      cargo_.y *= -1;
      goal_.y *= -1;
    }

    // cargo_.x >= 0
    // cargo_.y >= 0
    // cargo_ != { x: 0, y: 0 }
    // cargo_ != goal_

    let newPlayer: XY;
    let newCargo: XY;
    let actions: number;
    if (cargo_.x < goal_.x) {
      newPlayer = { x: goal_.x - 1, y: cargo_.y };
      newCargo = { x: goal_.x, y: cargo_.y };
      actions =
        cargo_.x === 0 ? 1 + cargo_.y + goal_.x : cargo_.y + (goal_.x - 1);
    } else if (goal_.x < cargo_.x) {
      newPlayer = { x: goal_.x + 1, y: cargo_.y };
      newCargo = { x: goal_.x, y: cargo_.y };
      actions =
        cargo_.y === 0
          ? 1 + (cargo_.x + 1) + 1 + (cargo_.x - goal_.x)
          : cargo_.x + 1 + cargo_.y + (cargo_.x - goal_.x);
    } else {
      newPlayer = { x: 0, y: 0 };
      newCargo = { ...cargo_ };
      actions = 0;
    }

    // newPlayer.x === goal_.x

    if (newPlayer.y === goal_.y) {
      return actions;
    }

    return (
      actions +
      solve(
        { x: newPlayer.y, y: newPlayer.x },
        { x: newCargo.y, y: newCargo.x },
        { x: goal_.y, y: goal_.x },
      )
    );
  }

  return Math.min(
    solve(player, cargo, goal),
    solve(
      { x: player.y, y: player.x },
      { x: cargo.y, y: cargo.x },
      { x: goal.y, y: goal.x },
    ),
  );
}

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/from
function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

// https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min: number, max: number) {
  const min_ = Math.ceil(min);
  const max_ = Math.floor(max);
  return Math.floor(Math.random() * (max_ - min_) + min_);
}
