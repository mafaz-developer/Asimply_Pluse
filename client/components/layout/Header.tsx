import { Menu, Bell, Settings, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectWallet } from "@/components/wallet/ConnectWallet";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-white/10 bg-white/10 text-white">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="md:hidden text-white/90">
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Asimply Pluse" className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight">Asimply Pluse</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-2 w-[32rem] max-w-[45vw]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input placeholder="Search" className="pl-9 bg-white/10 border-white/10 placeholder:text-white/60 text-white" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10"><Bell className="h-5 w-5" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/95 text-slate-800 dark:bg-slate-900/95 dark:text-slate-200">
              <DropdownMenuItem>New reward available</DropdownMenuItem>
              <DropdownMenuItem>Weekly battle starts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          <Button variant="ghost" className="hidden md:inline-flex text-white/90 hover:text-white hover:bg-white/10"><Settings className="h-5 w-5" /></Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-white/30 text-white/90">AP</AvatarFallback>
          </Avatar>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
