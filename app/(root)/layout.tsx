import type { Metadata } from "next";

// components imports 
import LeftSideBar from "@/components/LeftSideBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <main className="relative flex bg-black-3">
            <LeftSideBar />
            {children}
            <p className="text-white-1">RIGHT SIDEBAR</p>
        </main>
    </div>
  );
}
