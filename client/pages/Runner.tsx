import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Runner() {
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [playerY, setPlayerY] = useState(0);
  const [vel, setVel] = useState(0);
  const [obstacles, setObstacles] = useState<{ x: number; h: number }[]>([]);
  const ref = useRef<number | null>(null);

  const reset = () => {
    setScore(0);
    setPlayerY(0);
    setVel(0);
    setObstacles([{ x: 600, h: 24 }]);
  };

  useEffect(() => {
    reset();
  }, []);

  useEffect(() => {
    if (!running) return;
    const loop = () => {
      setScore((s) => s + 1);
      setVel((v) => v - 0.6);
      setPlayerY((y) => Math.max(0, y + vel));
      setObstacles((obs) =>
        obs
          .map((o) => ({ ...o, x: o.x - 6 }))
          .filter((o) => o.x > -40)
          .concat(obs[obs.length - 1]?.x < 250 ? [{ x: 600, h: 16 + Math.round(Math.random() * 28) }] : [])
      );
      // collisions
      const playerRect = { x: 60, y: 180 - playerY, w: 28, h: 28 };
      for (const o of obstacles) {
        const rect = { x: o.x, y: 200 - o.h, w: 24, h: o.h };
        if (rect.x < playerRect.x + playerRect.w && rect.x + rect.w > playerRect.x && rect.y < playerRect.y + playerRect.h && rect.y + rect.h > playerRect.y) {
          setRunning(false);
          setBest((b) => Math.max(b, score));
          toast.error("Crashed! Try again.");
          return;
        }
      }
      // rewards
      if (score > 0 && score % 200 === 0) {
        toast.success("Milestone reached! +5 AST");
      }
      ref.current = requestAnimationFrame(loop);
    };
    ref.current = requestAnimationFrame(loop);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [running, obstacles, vel, score, playerY]);

  const jump = () => {
    if (!running) setRunning(true);
    setVel(10);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="bg-white/10 border-white/10 text-white">
        <CardHeader>
          <CardTitle>Jump & Dodge</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 text-sm text-white/90">
            <div>Score: {score}</div>
            <div>Best: {best}</div>
          </div>
          <div className="relative h-52 rounded-xl bg-gradient-to-b from-white/10 to-white/5 overflow-hidden border border-white/10">
            <div className="absolute inset-x-0 bottom-8 h-1 bg-white/30" />
            <div className="absolute left-16 bottom-10" style={{ transform: `translateY(-${playerY}px)` }}>
              <div className="h-7 w-7 rounded-md bg-white text-[#3b1eeb] grid place-items-center shadow">◎</div>
            </div>
            {obstacles.map((o, i) => (
              <div key={i} className="absolute bottom-8 w-6 bg-white/70 rounded-t" style={{ left: o.x, height: o.h }} />
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={jump} className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90">{running ? "Jump" : "Start & Jump"}</Button>
            <Button variant="secondary" onClick={() => { setRunning(false); reset(); }} className="rounded-full bg-white/20 text-white hover:bg-white/30">Reset</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
