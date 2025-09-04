import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Sword, Calendar, Clock, Star, Crown, Medal } from "lucide-react";
import { mockStore, Battle, User } from "@/lib/mockStore";
import { toast } from "sonner";

export default function Battles() {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [user, setUser] = useState<User>(mockStore.getUser());

  useEffect(() => {
    setBattles(mockStore.getBattles());
  }, []);

  const handleJoinBattle = (battleId: string) => {
    const battle = battles.find(b => b.id === battleId);
    if (battle?.participants.find(p => p.id === user.id)) {
      toast.info("You're already in this battle!");
      return;
    }

    mockStore.joinBattle(battleId);
    setBattles(mockStore.getBattles());
    toast.success("Joined battle successfully! Good luck!");
  };

  const activeBattles = battles.filter(b => b.status === 'active');
  const completedBattles = battles.filter(b => b.status === 'completed');
  const upcomingBattles = battles.filter(b => b.status === 'upcoming');

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-foreground flex items-center gap-3">
            <Sword className="h-8 w-8" />
            Battles & Leaderboards
          </h1>
          <p className="text-white/70 dark:text-muted-foreground mt-2">
            Compete with friends and climb the leaderboards to win prizes
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white dark:text-foreground">{user.astBalance} AST</div>
          <div className="text-sm text-white/70 dark:text-muted-foreground">Current Balance</div>
        </div>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-white/20 dark:bg-muted">
          <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Active ({activeBattles.length})
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Completed ({completedBattles.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeBattles.map((battle) => (
              <BattleCard 
                key={battle.id} 
                battle={battle} 
                user={user}
                onJoin={() => handleJoinBattle(battle.id)}
              />
            ))}
          </div>

          {activeBattles.length === 0 && (
            <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sword className="h-12 w-12 text-white/50 dark:text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Battles</h3>
                <p className="text-white/70 dark:text-muted-foreground text-center">
                  Check back soon for new battles to join!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <GlobalLeaderboard />
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedBattles.map((battle) => (
              <CompletedBattleCard key={battle.id} battle={battle} user={user} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BattleCard({ battle, user, onJoin }: { battle: Battle; user: User; onJoin: () => void }) {
  const isParticipant = battle.participants.find(p => p.id === user.id);
  const daysLeft = Math.ceil((new Date(battle.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.max(0, Math.min(100, ((7 - daysLeft) / 7) * 100));

  return (
    <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            {battle.name}
          </CardTitle>
          <Badge className={`${
            battle.type === 'weekly' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
            battle.type === 'monthly' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
            'bg-orange-500/20 text-orange-400 border-orange-500/30'
          }`}>
            {battle.type}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{battle.participants.length} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{daysLeft} days left</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70 dark:text-muted-foreground">Battle Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20 dark:bg-muted" />
        </div>

        <div className="bg-white/5 dark:bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70 dark:text-muted-foreground">Prize Pool</span>
            <span className="font-bold text-yellow-400">{battle.prize} AST</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Top Participants</div>
          <div className="space-y-1">
            {battle.participants.slice(0, 3).map((participant, index) => (
              <div key={participant.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-white/50 dark:text-muted-foreground">#{index + 1}</span>
                  <span>{participant.name}</span>
                  {participant.id === user.id && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">You</Badge>
                  )}
                </div>
                <span className="font-medium">{participant.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {isParticipant ? (
            <Button disabled className="flex-1 rounded-full">
              <Trophy className="h-4 w-4 mr-2" />
              Participating
            </Button>
          ) : (
            <Button 
              onClick={onJoin}
              className="flex-1 rounded-full bg-white text-[#3b1eeb] hover:bg-white/90 dark:bg-primary dark:text-primary-foreground"
            >
              Join Battle
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full border-white/20 text-white dark:border-border dark:text-foreground">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-card text-slate-900 dark:text-foreground max-w-md">
              <DialogHeader>
                <DialogTitle>{battle.name}</DialogTitle>
              </DialogHeader>
              <BattleLeaderboard battle={battle} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function BattleLeaderboard({ battle }: { battle: Battle }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-600 dark:text-muted-foreground">
        Battle ends on {new Date(battle.endDate).toLocaleDateString()}
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {battle.participants.map((participant, index) => (
            <TableRow key={participant.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  #{participant.rank}
                  {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                  {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                  {index === 2 && <Medal className="h-4 w-4 text-amber-600" />}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {participant.avatar || participant.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {participant.name}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">{participant.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function GlobalLeaderboard() {
  const allTimeLeaders = [
    { name: "Alex", score: 15280, avatar: "🚀", change: "+120" },
    { name: "Jordan", score: 14120, avatar: "⚡", change: "+85" },
    { name: "Sam", score: 12980, avatar: "🔥", change: "+200" },
    { name: "Taylor", score: 11860, avatar: "💎", change: "-45" },
    { name: "Player One", score: 8750, avatar: "🎯", change: "+150" },
    { name: "Casey", score: 7650, avatar: "🌟", change: "+90" },
    { name: "Morgan", score: 6540, avatar: "⭐", change: "+75" },
    { name: "Riley", score: 5430, avatar: "🎮", change: "+60" },
  ];

  return (
    <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          Global Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Total Score</TableHead>
              <TableHead className="text-right">24h Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTimeLeaders.map((leader, index) => (
              <TableRow key={leader.name}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    #{index + 1}
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                    {index === 1 && <Medal className="h-4 w-4 text-gray-400" />}
                    {index === 2 && <Medal className="h-4 w-4 text-amber-600" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white/30 text-white/90 dark:bg-muted dark:text-foreground">
                        {leader.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{leader.name}</div>
                      {leader.name === "Player One" && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">You</Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">{leader.score.toLocaleString()}</TableCell>
                <TableCell className={`text-right font-medium ${
                  leader.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {leader.change}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CompletedBattleCard({ battle, user }: { battle: Battle; user: User }) {
  const userParticipant = battle.participants.find(p => p.id === user.id);
  const winner = battle.participants[0];

  return (
    <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            {battle.name}
          </CardTitle>
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            Completed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="bg-white/5 dark:bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70 dark:text-muted-foreground">Winner</span>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-400" />
              <span className="font-bold">{winner.name}</span>
            </div>
          </div>
        </div>

        {userParticipant && (
          <div className="bg-white/5 dark:bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70 dark:text-muted-foreground">Your Result</span>
              <div className="text-right">
                <div className="font-bold">#{userParticipant.rank}</div>
                <div className="text-sm text-white/70 dark:text-muted-foreground">{userParticipant.score} points</div>
              </div>
            </div>
          </div>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full rounded-full border-white/20 text-white dark:border-border dark:text-foreground">
              View Final Results
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white dark:bg-card text-slate-900 dark:text-foreground max-w-md">
            <DialogHeader>
              <DialogTitle>{battle.name} - Final Results</DialogTitle>
            </DialogHeader>
            <BattleLeaderboard battle={battle} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
