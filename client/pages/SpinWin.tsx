import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion, useAnimation } from "framer-motion";

const PRIZES = [
  { label: "+5 AST", value: 5 },
  { label: "+10 AST", value: 10 },
  { label: "Try Again", value: 0 },
  { label: "+2 AST", value: 2 },
  { label: "+20 AST", value: 20 },
  { label: "+1 AST", value: 1 },
  { label: "+15 AST", value: 15 },
  { label: "+8 AST", value: 8 },
] as const;

function canSpin(): boolean {
  const key = "asimply.spin.last";
  const last = localStorage.getItem(key);
  if (!last) return true;
  const lastDate = new Date(last);
  const now = new Date();
  return lastDate.toDateString() !== now.toDateString();
}

function setSpunNow() {
  localStorage.setItem("asimply.spin.last", new Date().toISOString());
}

export default function SpinWin() {
  const controls = useAnimation();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    setAllowed(canSpin());
  }, []);

  const onSpin = async () => {
    if (spinning) return;
    if (!canSpin()) {
      toast.info("Come back tomorrow for another free spin!");
      setAllowed(false);
      return;
    }
    setResult(null);
    setSpinning(true);
    const idx = Math.floor(Math.random() * PRIZES.length);
    const rounds = 6;
    const slice = 360 / PRIZES.length;
    const target = 360 * rounds + (360 - idx * slice) - slice / 2; // land at center of slice
    await controls.start({ rotate: target, transition: { duration: 4, ease: [0.12, 0.49, 0.15, 1] } });
    const prize = PRIZES[idx];
    if (prize.value > 0) toast.success(`You won ${prize.value} AST!`);
    else toast("No prize this time — try again tomorrow!");
    setResult(prize.label);
    setSpinning(false);
    setSpunNow();
    setAllowed(false);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="bg-white/10 border-white/10 text-white">
        <CardHeader>
          <CardTitle>Spin & Win</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="relative">
            <motion.div
              className="h-80 w-80 rounded-full border-8 border-white/20 shadow-[0_0_0_6px_rgba(255,255,255,0.1)] overflow-hidden bg-white/10"
              style={{ boxShadow: "inset 0 0 40px rgba(255,255,255,0.15)" }}
              animate={controls}
              initial={{ rotate: 0 }}
            >
              <Wheel />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={onSpin} disabled={spinning || !allowed} className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90">{allowed ? (spinning ? "Spinning..." : "Spin") : "Come Back Tomorrow"}</Button>
            </div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-[18px] border-l-transparent border-r-transparent border-b-white/90 rounded-sm" />
          </div>
          <div className="text-white/90 text-sm">{result ? `Result: ${result}` : "One free spin per day"}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function Wheel() {
  const segments = PRIZES.length;
  const slice = 360 / segments;
  const colors = ["#7c3aed", "#06b6d4"];
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      {Array.from({ length: segments }).map((_, i) => (
        <g key={i} transform={`rotate(${i * slice} 50 50)`}>
          <path d={`M50 50 L50 0 A50 50 0 0 1 ${50 + 50 * Math.sin((Math.PI * slice) / 180)} ${50 - 50 * Math.cos((Math.PI * slice) / 180)} Z`} fill={i % 2 ? colors[0] : colors[1]} opacity={0.85} />
          <text x="50" y="8" textAnchor="middle" fontSize="4" fill="#fff">
            {PRIZES[i].label}
          </text>
        </g>
      ))}
      <circle cx="50" cy="50" r="6" fill="#fff" />
    </svg>
  );
}
