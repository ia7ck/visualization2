import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABC341 E Visualizer",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
