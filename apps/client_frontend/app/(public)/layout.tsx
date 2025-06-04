import FloatingActionButton from "@/components/floating-action-button";
import Navbar from "@/components/navbar";
import { Footer } from "react-day-picker";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-grow relative">{children}</main>
      <Footer />
      <FloatingActionButton />
    </>
  );
}
