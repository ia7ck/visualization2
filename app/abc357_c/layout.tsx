import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABC357 C Visualizer",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
