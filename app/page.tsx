import { VSpace } from "@/components/VSpace";
import Link from "next/link";

const pages = [
  {
    title: "ABC323 F",
    description: "Push and Carry",
    image: "/img/abc323_f.png",
    link: "/abc323_f",
  },
  {
    title: "ABC337 E",
    description: "Bad Juice",
    image: "/img/abc337_e.png",
    link: "/abc337_e",
  },
  {
    title: "ABC357 C",
    description: "Sierpinski carpet",
    image: "/img/abc357_c.png",
    link: "/abc357_c",
  },
  {
    title: "ARC176 A",
    description: "01 Matrix Again",
    image: "/img/arc176_a.png",
    link: "/arc176_a",
  },
  {
    title: "ABC349 E",
    description: "Weighted Tic-Tac-Toe",
    image: "/img/abc349_e.png",
    link: "/abc349_e",
  },
  {
    title: "ABC341 E",
    description: "Alternating String",
    image: "/img/abc341_e.png",
    link: "/abc341_e",
  },
  {
    title: "Graph",
    description: "",
    image: "/img/graph.png",
    link: "/graph",
  },
];

export default function Root() {
  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 xl:gap-x-8">
        {pages.map((page) => (
          <li key={page.image} className="relative">
            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              <img
                alt={page.title}
                src={page.image}
                className="pointer-events-none object-cover group-hover:opacity-75"
              />
              <Link
                href={page.link}
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">View details for {page.title}</span>
              </Link>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
              {page.title}
            </p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">
              {page.description}
            </p>
          </li>
        ))}
      </ul>
      <VSpace size="L" />
    </>
  );
}
