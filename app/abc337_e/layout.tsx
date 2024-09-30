import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABC337 E Visualizer",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
