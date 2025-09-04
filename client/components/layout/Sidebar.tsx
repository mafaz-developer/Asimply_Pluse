import { NavLink } from "react-router-dom";
import { 
  Home, Gamepad2, Trophy, Users2, Wallet, User2
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const links = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/activities", label: "Activities", icon: Gamepad2 },
  { to: "/achievements", label: "Achievements", icon: Trophy },
  { to: "/battles", label: "Battles", icon: Users2 },
  { to: "/staking", label: "Staking", icon: Wallet },
  { to: "/profile", label: "Profile", icon: User2 },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const content = (
    <nav className="w-64 shrink-0 px-4 py-6 hidden md:block">
      <ul className="space-y-2">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2 text-white/90 hover:bg-white/10 ${isActive ? "bg-white/15" : ""}`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{l.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      <div className="hidden md:block">{content}</div>
      <Sheet open={open} onOpenChange={(o) => (o ? null : onClose())}>
        <SheetContent side="left" className="p-0 w-72 bg-gradient-to-b from-[#3b1eeb]/95 to-[#0ea5e9]/95 text-white">
          <div className="px-4 py-6">
            <ul className="space-y-2">
              {links.map((l) => {
                const Icon = l.icon;
                return (
                  <li key={l.to}>
                    <NavLink onClick={onClose}
                      to={l.to}
                      className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2 text-white/90 hover:bg-white/10 ${isActive ? "bg-white/15" : ""}`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{l.label}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
