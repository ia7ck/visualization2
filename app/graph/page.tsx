"use client";

import { Field, Label, Switch } from "@headlessui/react";
import clsx from "clsx";
import { useRef, useState } from "react";

import CytoscapeComponent from "react-cytoscapejs";

import { VSpace } from "@/components/VSpace";
import { parseGraph } from "./parse";

export default function Graph() {
  const layouts = ["random", "grid", "circle"] as const;
  type Layout = (typeof layouts)[number];
  const indexings = ["0-indexed", "1-indexed"] as const;
  type Indexing = (typeof indexings)[number];

  type Graph = {
    n: number;
    edges: { from: number; to: number }[];
  };
  type Params = {
    text: string;
    option: { indexing: Indexing };
  };

  type Element =
    | {
        group: "nodes";
        data: { id: string; label: string };
        renderedPosition: { x: number; y: number };
      }
    | { group: "edges"; data: { id: string; source: string; target: string } };

  const cyRef = useRef<cytoscape.Core>();
  const [graphText, setGraphText] = useState("3\n1 2");
  const [layout, setLayout] = useState<Layout>("random");
  const [indexing, setIndexing] = useState<Indexing>("1-indexed");
  const [directed, setDirected] = useState(true);
  // 最後に parse が成功したときのグラフとパラメータ
  const [graph, setGraph] = useState<{ data: Graph; params: Params }>({
    data: { n: 3, edges: [{ from: 1, to: 2 }] },
    params: { text: graphText, option: { indexing } },
  });
  const [invalid, setInvalid] = useState(false);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setGraphText(value);
    updateGraph(value, { indexing });
  };

  const handleLayoutChange = (ly: Layout) => {
    setLayout(ly);
    cyRef.current?.layout({ name: ly }).run();
  };

  const handleIndexingChange = (ind: Indexing) => {
    setIndexing(ind);
    updateGraph(graphText, { indexing: ind });
  };

  const updateGraph = (text: string, option: { indexing: Indexing }) => {
    const graph = parseGraph(text, { indexStart: option.indexing });
    if (graph.ok) {
      setGraph({ data: graph.data, params: { text, option } });
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  };

  const elements: Element[] = [];
  const width = cyRef.current?.width() ?? 300;
  const height = cyRef.current?.height() ?? 400;
  for (let i = 1; i <= graph.data.n; i++) {
    const label =
      graph.params.option.indexing === "0-indexed" ? `${i - 1}` : `${i}`;
    elements.push({
      group: "nodes",
      data: { id: `n${label}`, label },
      renderedPosition: {
        x: (Math.random() + 0.5) * (width / 2),
        y: (Math.random() + 0.5) * (height / 2),
      },
    });
  }
  for (const [i, e] of graph.data.edges.entries()) {
    elements.push({
      group: "edges",
      data: { id: `e${i}`, source: `n${e.from}`, target: `n${e.to}` },
    });
  }

  return (
    <>
      <label
        htmlFor="graph-text"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Graph Input
      </label>
      <div className="mt-2">
        <textarea
          id="graph-text"
          rows={4}
          className={clsx(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            invalid && "text-red-900 ring-red-300 focus:ring-red-500",
          )}
          value={graphText}
          onChange={handleTextAreaChange}
        />
      </div>
      <VSpace size="M" />
      <fieldset>
        <legend className="text-sm font-semibold leading-6 text-gray-900">
          Layout
        </legend>
        <div className="mt-2 space-y-2 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {layouts.map((ly) => (
            <div key={ly} className="flex items-center">
              <input
                id={ly}
                type="radio"
                checked={ly === layout}
                onChange={() => handleLayoutChange(ly)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor={ly}
                className="ml-3 block text-sm font-medium leading-6 text-gray-900"
              >
                {ly}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <VSpace size="M" />
      <fieldset>
        <legend className="text-sm font-semibold leading-6 text-gray-900">
          Indexing
        </legend>
        <div className="mt-2 space-y-2 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {indexings.map((ind) => (
            <div key={ind} className="flex items-center">
              <input
                id={ind}
                type="radio"
                checked={ind === indexing}
                onChange={() => handleIndexingChange(ind)}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor={ind}
                className="ml-3 block text-sm font-medium leading-6 text-gray-900"
              >
                {ind}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <VSpace size="M" />
      <fieldset>
        <legend className="text-sm font-semibold leading-6 text-gray-900">
          Edge Type
        </legend>
        <VSpace size="S" />
        <Field className="flex items-center">
          <Label as="span" className="mr-3 text-sm">
            <span className="font-medium text-gray-900">directed</span>
          </Label>
          <Switch
            checked={directed}
            onChange={setDirected}
            className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
            />
          </Switch>
        </Field>
      </fieldset>
      <VSpace size="L" />
      <CytoscapeComponent
        className="border"
        cy={(cy) => {
          cyRef.current = cy;
        }}
        elements={elements}
        style={{ width: "100%", height: "80vh" }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(label)",
              color: "white",
              "text-halign": "center",
              "text-valign": "center",
            },
          },
          {
            selector: "edge",
            style: {
              "curve-style": "bezier",
              "target-arrow-shape": directed ? "triangle" : "none",
            },
          },
        ]}
      />
      <VSpace size="L" />
    </>
  );
}
