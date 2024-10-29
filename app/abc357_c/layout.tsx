import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABC357 C",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
