import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ARC176 A Visualizer",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
