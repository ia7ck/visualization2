import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ARC176 A",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
