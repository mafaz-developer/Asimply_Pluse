import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Coins, Gift, Wallet, Gamepad2, Trophy, Users2, CreditCard, Megaphone, Sparkles } from "lucide-react";
import { useAstBalance } from "@/hooks/useAstBalance";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function SectionTitle({ title, icon: Icon }: { title: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 text-white/90">
      <Icon className="h-5 w-5" />
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

export default function Index() {
  const { connected } = useAstBalance();
  const { address } = useAccount();

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      {/* Token balance card */}
      <Card className="bg-white/10 border-white/10 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Coins className="h-5 w-5" /> AsimplyTokens (AST)
          </CardTitle>
          <div className="text-xs text-white/70">{address ? `${address.slice(0,6)}…${address.slice(-4)}` : "Not connected"}</div>
        </CardHeader>
        <CardContent>
          <BalanceContent />
        </CardContent>
      </Card>

      {/* Activities + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionTitle title="Activities" icon={Gamepad2} />
          <ActivitiesGrid />

          <SectionTitle title="Friend Battles & Leaderboard" icon={Users2} />
          <Leaderboard />
        </div>
        <div className="space-y-6">
          <SectionTitle title="Achievements" icon={Trophy} />
          <Achievements />

          <SectionTitle title="Staking Pools" icon={Wallet} />
          <StakingPools />
        </div>
      </div>
    </div>
  );
}

function BalanceContent() {
  const { connected, loading, symbol, balance } = useAstBalance();
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">{loading ? "—" : balance}</div>
        <div className="text-white/70 mt-1">{symbol} Balance</div>
      </div>
      <div className="flex items-center gap-3">
        <Button onClick={() => toast.success("Earning flow started") } className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white"><Gift className="mr-2 h-4 w-4" /> Earn</Button>
        <Button onClick={() => toast.info("Redeem flow opened") } variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30"><Wallet className="mr-2 h-4 w-4" /> Redeem</Button>
      </div>
    </div>
  );
}

function ActivitiesGrid() {
  const navigate = useNavigate();
  const items = [
    { title: "Bill Payment", icon: CreditCard, progress: 60, earned: 12, action: () => toast("Open bill pay"), cta: "Pay Now" },
    { title: "Referrals", icon: Megaphone, progress: 30, earned: 8, action: () => navigate("/activities"), cta: "Invite" },
    { title: "Mini Games", icon: Gamepad2, progress: 80, earned: 25, action: () => navigate("/games/spin-win"), cta: "Play" },
    { title: "Staking", icon: Wallet, progress: 50, earned: 40, action: () => navigate("/staking"), cta: "Stake" },
    { title: "Surveys", icon: Sparkles, progress: 20, earned: 5, action: () => toast("Start survey"), cta: "Start" },
  ] as const;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((it) => (
        <Card key={it.title} className="bg-white/10 border-white/10 text-white">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base"><it.icon className="h-5 w-5" />{it.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={it.progress} className="h-2 bg-white/20" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Rewards progress • Earned +{it.earned} AST</span>
              <Button size="sm" onClick={it.action} className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90">{it.cta}</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Achievements() {
  const items = [
    { title: "First Bill Payer", minted: true },
    { title: "Super Referrer", minted: false },
    { title: "Staking Starter", minted: false },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((it) => (
        <Card key={it.title} className="bg-white/10 border-white/10 text-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-white/40 to-white/10 backdrop-blur flex items-center justify-center text-[#3b1eeb] font-bold">NFT</div>
            <div className="flex-1">
              <div className="font-semibold">{it.title}</div>
              <div className="text-xs text-white/70">{it.minted ? "Collected" : "Mint available"}</div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90">{it.minted ? "View" : "Mint"}</Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white text-[#0f172a]">
                        <DialogHeader>
                          <DialogTitle>{it.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2">
                          <div className="h-40 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-400" />
                          <p className="mt-3 text-sm text-slate-700">Your collectible NFT for {it.title}.</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-slate-900">{it.minted ? "View badge" : "Mint this NFT"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Leaderboard() {
  const rows = [
    { name: "Alex", score: 1280 },
    { name: "Jordan", score: 1120 },
    { name: "Sam", score: 980 },
    { name: "Taylor", score: 860 },
  ];
  return (
    <Card className="bg-white/10 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-base">Weekly Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={r.name}>
                <TableCell>#{i + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white/30 text-white/90">{r.name.slice(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-xs text-white/70">Recent: +{Math.round(Math.random()*50)} AST</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{r.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="pt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90">Challenge Friends</Button>
            </DialogTrigger>
            <DialogContent className="bg-white text-[#0f172a]">
              <DialogHeader>
                <DialogTitle>Start a Weekly Battle</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-slate-600">Invite friends and compete to earn the most AST this week.</p>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function StakingPools() {
  return (
    <Card className="bg-white/10 border-white/10 text-white">
      <CardContent className="p-4">
        <Tabs defaultValue="30">
          <TabsList className="bg-white/20">
            <TabsTrigger value="30">30 Day</TabsTrigger>
            <TabsTrigger value="90">90 Day</TabsTrigger>
          </TabsList>
          <TabsContent value="30" className="mt-4">
            <StakeCard apy={8} />
          </TabsContent>
          <TabsContent value="90" className="mt-4">
            <StakeCard apy={16} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function StakeCard({ apy }: { apy: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/70">APY</div>
          <div className="text-2xl font-bold">{apy}%</div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90">Stake</Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-[#0f172a]">
            <DialogHeader>
              <DialogTitle>Stake AST</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="text-sm">Selected Pool: {apy}% APY</div>
              <input type="number" min={0} placeholder="Amount" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <Button className="w-full">Confirm Stake</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-white/90">
        <span>Your staked: 0 AST</span>
        <Button variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30">Unstake</Button>
      </div>
    </div>
  );
}
