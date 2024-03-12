import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABC323 F Visualizer",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
