"use client";

import TextInput, { Hint, Input, Label } from "@/components/TextInput";
import { VSpace } from "@/components/VSpace";
import { CheckCircleIcon as CheckCircleIcon20Solid } from "@heroicons/react/20/solid";
import {
  CheckCircleIcon as CheckCircleIconOutline,
  UserIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleIcon24Solid } from "@heroicons/react/24/solid";
import clsx from "clsx";
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
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Problem
      </h1>
      <a
        className="inline-block mt-2 leading-6 text-indigo-600 hover:text-indigo-500"
        href="https://atcoder.jp/contests/abc337/tasks/abc337_e"
        target="blank"
      >
        ABC337 E - Bad Juice
      </a>
      <VSpace size="M" />
      <TextInput invalid={!bottle.success}>
        <Label>
          Number of bottles <var>N</var>
        </Label>
        <Input
          type="number"
          inputMode="numeric"
          min={BOTTLE_MIN}
          max={BOTTLE_MAX}
          value={bottleText}
          onChange={(e) => setBottleText(e.target.value)}
        />
        <Hint>{`${BOTTLE_MIN} ≦ N ≦ ${BOTTLE_MAX}`}</Hint>
      </TextInput>
      <VSpace size="S" />
      <TextInput invalid={!spoiled.success}>
        <Label>
          Spoiled bottle <var>X</var>
        </Label>
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          max={bottle.success ? bottle.data : undefined}
          value={spoiledText}
          onChange={(e) => setSpoiledText(e.target.value)}
        />
        <Hint>1 ≦ X ≦ N</Hint>
      </TextInput>
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
                  {row.map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: uum...
                    <UserIcon key={i} className="inline-block h-10 w-10" />
                  ))}
                </div>
              ) : null;
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: uum...
              <div key={index}>
                {friends}
                <div className="grid grid-flow-col place-items-center">
                  {row.toReversed().map((served, i) =>
                    served ? (
                      <CheckCircleIcon24Solid
                        // biome-ignore lint/suspicious/noArrayIndexKey: uum...
                        key={i}
                        className={clsx(
                          "inline-block h-10 w-10",
                          spoiled.success && index + 1 === spoiled.data
                            ? "text-indigo-600"
                            : "text-gray-800",
                        )}
                      />
                    ) : (
                      <CheckCircleIconOutline
                        // biome-ignore lint/suspicious/noArrayIndexKey: uum...
                        key={i}
                        className={clsx(
                          "inline-block h-10 w-10",
                          spoiled.success && index + 1 === spoiled.data
                            ? "text-indigo-200"
                            : "text-gray-200",
                        )}
                      />
                    ),
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
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
