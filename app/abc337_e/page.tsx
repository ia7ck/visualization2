"use client";

import { CheckCircleIcon as CheckCircleIcon20Solid } from "@heroicons/react/20/solid";
import {
  CheckCircleIcon as CheckCircleIconOutline,
  UserIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIcon24Solid } from "@heroicons/react/24/solid";
import { StrictMode, useState } from "react";
import { z } from "zod";

const BOTTLE_MIN = 2;
const BOTTLE_MAX = 100;

const Int = z.coerce.number().int();
const Bottle = Int.min(BOTTLE_MIN).max(BOTTLE_MAX);
const createSpoiledSchema = (max?: number) =>
  max === undefined ? Int.min(1) : Int.min(1).max(max);

export default function ABC337_E() {
  const [bottleText, setBottleText] = useState("10");
  const [spoiledText, setSpoiledText] = useState("4");

  const bottle = Bottle.safeParse(bottleText);

  const Spoiled = createSpoiledSchema(bottle.success ? bottle.data : undefined);
  const spoiled = Spoiled.safeParse(spoiledText);

  return (
    <StrictMode>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Problem
          </h1>
          <a
            className="inline-block mt-2 leading-6 text-indigo-600 hover:text-indigo-500"
            href="https://atcoder.jp/contests/abc337/tasks/abc337_e"
            target="blank"
          >
            ABC337 E - Bad Juice
          </a>
          <label
            htmlFor="n_bottle"
            className="block mt-5 text-sm font-medium leading-6 text-gray-900"
          >
            Number of bottles <var>N</var>
          </label>
          <input
            name="n_bottle"
            id="n_bottle"
            type="number"
            min={BOTTLE_MIN}
            max={BOTTLE_MAX}
            inputMode="numeric"
            className={`block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              bottle.success
                ? ""
                : "text-red-900 ring-red-300 focus:ring-red-500" // overwrite
            }`}
            value={bottleText}
            onChange={(e) => setBottleText(e.target.value)}
          />
          <p
            className={`mt-2 text-sm text-gray-500 ${
              bottle.success ? "" : "text-red-600"
            }`}
          >
            {BOTTLE_MIN} ≦ N ≦ {BOTTLE_MAX}
          </p>
          <label
            htmlFor="spoiled"
            className="block mt-2 text-sm font-medium leading-6 text-gray-900"
          >
            Spoiled bottle <var>X</var>
          </label>
          <input
            name="spoiled"
            id="spoiled"
            type="number"
            min={1}
            max={bottle.success ? bottle.data : undefined}
            inputMode="numeric"
            className={`block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
              spoiled.success
                ? ""
                : "text-red-900 ring-red-300 focus:ring-red-500" // overwrite
            }`}
            value={spoiledText}
            onChange={(e) => setSpoiledText(e.target.value)}
          />
          <p
            className={`mt-2 text-sm text-gray-500 ${
              spoiled.success ? "" : "text-red-600"
            }`}
          >
            1 ≦ X ≦ N
          </p>
          <p className="mt-2">
            <CheckCircleIcon20Solid className="inline-block h-5 w-5 text-gray-800" />
            <CheckCircleIcon20Solid className="inline-block h-5 w-5 text-indigo-600" />
            : serve the bottle to the friend
          </p>
          {bottle.success && (
            <div className="grid place-items-center mt-10 mb-6">
              {serve(bottle.data).map((row, index) => {
                const friends =
                  index === 0 ? (
                    <div className="grid grid-flow-col place-items-center">
                      {row.map((_) => (
                        <UserIcon className="inline-block h-10 w-10" />
                      ))}
                    </div>
                  ) : null;
                return (
                  <>
                    {friends}
                    <div className="grid grid-flow-col place-items-center">
                      {row
                        .toReversed()
                        .map((served) =>
                          served ? (
                            <CheckCircleIcon24Solid
                              className={`inline-block h-10 w-10 ${
                                spoiled.success && index + 1 === spoiled.data
                                  ? "text-indigo-600"
                                  : "text-gray-800"
                              }`}
                            />
                          ) : (
                            <CheckCircleIconOutline
                              className={`inline-block h-10 w-10 ${
                                spoiled.success && index + 1 === spoiled.data
                                  ? "text-indigo-200"
                                  : "text-gray-200"
                              }`}
                            />
                          ),
                        )}
                    </div>
                  </>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StrictMode>
  );
}

function serve(bottle: number): boolean[][] {
  const m = Math.ceil(Math.log2(bottle)); // # of friends

  const result: boolean[][] = [];
  for (let i = 0; i < bottle; i++) {
    result[i] = [];
    for (let j = 0; j < m; j++) {
      result[i][j] = ((i >> j) & 1) === 1;
    }
  }

  return result;
}
