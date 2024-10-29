import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABC341 E",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
