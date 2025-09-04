import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#3b1eeb] via-[#5b2bd7] to-[#0ea5e9] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-foreground">
      <div className="backdrop-blur-0">
        <Header onMenu={() => setSidebarOpen((v) => !v)} />
        <div className="flex">
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 px-4 md:px-8 lg:px-10 py-6 md:py-8">
            {children}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
