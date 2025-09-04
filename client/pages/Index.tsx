import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coins, Gift, Wallet, Gamepad2, Trophy, Users2, CreditCard, Megaphone, Sparkles, Plus, TrendingUp, Clock, Star } from "lucide-react";
import { useAstBalance } from "@/hooks/useAstBalance";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { mockStore, type User, type Activity, type Achievement, type StakingPosition, type Battle } from "@/lib/mockStore";

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
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stakingPools, setStakingPools] = useState<StakingPosition[]>([]);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from mock store
    const loadData = () => {
      try {
        const userData = mockStore.getUser();
        const activitiesData = mockStore.getActivities();
        const achievementsData = mockStore.getAchievements();
        const stakingData = mockStore.getStakingPools();
        const battlesData = mockStore.getBattles();

        setUser(userData);
        setActivities(activitiesData);
        setAchievements(achievementsData);
        setStakingPools(stakingData);
        setBattles(battlesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const refreshData = () => {
    setUser(mockStore.getUser());
    setActivities(mockStore.getActivities());
    setAchievements(mockStore.getAchievements());
    setStakingPools(mockStore.getStakingPools());
    setBattles(mockStore.getBattles());
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1600px] space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-white/70">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user?.name || 'Player'}!</h1>
          <p className="text-white/70 mt-1">Level {user?.level || 1} • {user?.xp || 0} XP</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-white/70">Total Earned</div>
          <div className="text-2xl font-bold text-emerald-400">{user?.totalEarned || 0} AST</div>
        </div>
      </div>

      {/* Token balance card */}
      <Card className="bg-white/10 border-white/10 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Coins className="h-5 w-5" /> AsimplyTokens (AST)
          </CardTitle>
          <div className="text-xs text-white/70">{address ? `${address.slice(0,6)}…${address.slice(-4)}` : "Not connected"}</div>
        </CardHeader>
        <CardContent>
          <BalanceContent user={user} onRefresh={refreshData} />
        </CardContent>
      </Card>

      {/* Activities + Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionTitle title="Activities" icon={Gamepad2} />
          <ActivitiesGrid activities={activities} onActivityUpdate={refreshData} />

          <SectionTitle title="Friend Battles & Leaderboard" icon={Users2} />
          <Leaderboard battles={battles} user={user} onJoinBattle={refreshData} />
        </div>
        <div className="space-y-6">
          <SectionTitle title="Achievements" icon={Trophy} />
          <Achievements achievements={achievements} onMintAchievement={refreshData} />

          <SectionTitle title="Staking Pools" icon={Wallet} />
          <StakingPools stakingPools={stakingPools} user={user} onStakeUpdate={refreshData} />
        </div>
      </div>
    </div>
  );
}

function BalanceContent({ user, onRefresh }: { user: User | null; onRefresh: () => void }) {
  const { connected, loading, symbol, balance } = useAstBalance();
  const [showEarnDialog, setShowEarnDialog] = useState(false);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [earnAmount, setEarnAmount] = useState(10);
  const [redeemAmount, setRedeemAmount] = useState(50);

  const handleEarn = () => {
    if (earnAmount > 0) {
      mockStore.updateBalance(earnAmount);
      onRefresh();
      toast.success(`Earned ${earnAmount} AST!`);
      setShowEarnDialog(false);
    }
  };

  const handleRedeem = () => {
    if (redeemAmount > 0 && user && user.astBalance >= redeemAmount) {
      mockStore.updateBalance(-redeemAmount);
      onRefresh();
      toast.success(`Redeemed ${redeemAmount} AST!`);
      setShowRedeemDialog(false);
    } else {
      toast.error("Insufficient balance");
    }
  };

  const displayBalance = user ? user.astBalance.toString() : (loading ? "—" : balance);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <div className="text-4xl md:text-5xl font-extrabold tracking-tight">{displayBalance}</div>
        <div className="text-white/70 mt-1">{symbol} Balance</div>
      </div>
      <div className="flex items-center gap-3">
        <Dialog open={showEarnDialog} onOpenChange={setShowEarnDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white">
              <Gift className="mr-2 h-4 w-4" /> Earn
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-slate-900">
            <DialogHeader>
              <DialogTitle>Earn AST Tokens</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="earn-amount">Amount to earn</Label>
                <Input
                  id="earn-amount"
                  type="number"
                  value={earnAmount}
                  onChange={(e) => setEarnAmount(Number(e.target.value))}
                  min="1"
                  max="1000"
                />
              </div>
              <Button onClick={handleEarn} className="w-full">Earn {earnAmount} AST</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="rounded-full bg-white/20 text-white hover:bg-white/30">
              <Wallet className="mr-2 h-4 w-4" /> Redeem
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-slate-900">
            <DialogHeader>
              <DialogTitle>Redeem AST Tokens</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="redeem-amount">Amount to redeem</Label>
                <Input
                  id="redeem-amount"
                  type="number"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(Number(e.target.value))}
                  min="1"
                  max={user?.astBalance || 0}
                />
                <p className="text-sm text-slate-600 mt-1">Available: {user?.astBalance || 0} AST</p>
              </div>
              <Button onClick={handleRedeem} className="w-full">Redeem {redeemAmount} AST</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function ActivitiesGrid({ activities, onActivityUpdate }: { activities: Activity[]; onActivityUpdate: () => void }) {
  const navigate = useNavigate();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'bill_payment': return CreditCard;
      case 'referral': return Megaphone;
      case 'game': return Gamepad2;
      case 'staking': return Wallet;
      case 'survey': return Sparkles;
      default: return Sparkles;
    }
  };

  const handleActivityAction = (activity: Activity) => {
    const newProgress = Math.min(activity.progress + 1, activity.maxProgress);
    mockStore.updateActivityProgress(activity.id, newProgress);
    onActivityUpdate();
    
    if (newProgress >= activity.maxProgress) {
      toast.success(`Completed ${activity.title}! Earned ${activity.reward} AST`);
    } else {
      toast.info(`Progress updated: ${newProgress}/${activity.maxProgress}`);
    }
  };

  const getActivityCTA = (activity: Activity) => {
    if (activity.completed) return "Completed";
    if (activity.progress >= activity.maxProgress) return "Claim";
    return "Continue";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {activities.map((activity) => {
        const Icon = getActivityIcon(activity.type);
        const progressPercentage = (activity.progress / activity.maxProgress) * 100;
        
        return (
          <Card key={activity.id} className="bg-white/10 border-white/10 text-white">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-base">
                <Icon className="h-5 w-5" />
                {activity.title}
              </CardTitle>
              <p className="text-sm text-white/70">{activity.description}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{activity.progress}/{activity.maxProgress}</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-white/20" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">
                  Reward: {activity.reward} AST
                  {activity.completed && <span className="text-emerald-400 ml-2">✓</span>}
                </span>
                <Button 
                  size="sm" 
                  onClick={() => handleActivityAction(activity)}
                  disabled={activity.completed}
                  className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90 disabled:opacity-50"
                >
                  {getActivityCTA(activity)}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function Achievements({ achievements, onMintAchievement }: { achievements: Achievement[]; onMintAchievement: () => void }) {
  const handleMintAchievement = (achievement: Achievement) => {
    if (!achievement.minted) {
      mockStore.mintAchievement(achievement.id);
      onMintAchievement();
      toast.success(`Minted ${achievement.title}! Earned 50 AST bonus`);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className="bg-white/10 border-white/10 text-white">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-white font-bold text-lg`}>
              {achievement.icon}
            </div>
            <div className="flex-1">
              <div className="font-semibold">{achievement.title}</div>
              <div className="text-xs text-white/70">
                {achievement.minted ? "Collected" : "Mint available"}
              </div>
              <div className="text-xs text-white/50 capitalize">{achievement.rarity}</div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90"
                          onClick={() => handleMintAchievement(achievement)}
                        >
                          {achievement.minted ? "View" : "Mint"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white text-[#0f172a]">
                        <DialogHeader>
                          <DialogTitle>{achievement.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2">
                          <div className={`h-40 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-white text-6xl`}>
                            {achievement.icon}
                          </div>
                          <p className="mt-3 text-sm text-slate-700">{achievement.description}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded capitalize">{achievement.rarity}</span>
                            {achievement.minted && achievement.mintDate && (
                              <span className="text-xs text-slate-500">
                                Minted: {new Date(achievement.mintDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-slate-900">
                  {achievement.minted ? "View badge" : "Mint this NFT"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Leaderboard({ battles, user, onJoinBattle }: { battles: Battle[]; user: User | null; onJoinBattle: () => void }) {
  const activeBattle = battles.find(b => b.status === 'active');
  
  if (!activeBattle) {
    return (
      <Card className="bg-white/10 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-base">Weekly Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-white/70">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active battles</p>
            <p className="text-sm">Check back later for new competitions!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleJoinBattle = () => {
    mockStore.joinBattle(activeBattle.id);
    onJoinBattle();
    toast.success("Joined the battle! Good luck!");
  };

  const isUserParticipating = activeBattle.participants.some(p => p.id === user?.id);

  return (
    <Card className="bg-white/10 border-white/10 text-white">
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          {activeBattle.name}
          <div className="text-sm font-normal text-white/70">
            Prize: {activeBattle.prize} AST
          </div>
        </CardTitle>
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
            {activeBattle.participants.slice(0, 5).map((participant, i) => (
              <TableRow key={participant.id} className={participant.id === user?.id ? "bg-white/5" : ""}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {i < 3 && <Trophy className="h-4 w-4 text-yellow-400" />}
                    #{i + 1}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-white/30 text-white/90">
                        {participant.avatar || participant.name.slice(0,2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {participant.name}
                        {participant.id === user?.id && <span className="text-xs text-blue-400 ml-2">(You)</span>}
                      </div>
                      <div className="text-xs text-white/70">
                        Recent: +{Math.round(Math.random()*50)} AST
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{participant.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="pt-2">
          {!isUserParticipating ? (
            <Button 
              onClick={handleJoinBattle}
              className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90 w-full"
            >
              <Users2 className="mr-2 h-4 w-4" />
              Join Battle
            </Button>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-emerald-400">✓ You're in this battle!</p>
              <p className="text-xs text-white/70">Keep earning AST to climb the leaderboard</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StakingPools({ stakingPools, user, onStakeUpdate }: { stakingPools: StakingPosition[]; user: User | null; onStakeUpdate: () => void }) {
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [selectedPool, setSelectedPool] = useState<'30day' | '90day'>('30day');
  const [stakeAmount, setStakeAmount] = useState(100);

  const handleStake = () => {
    if (stakeAmount > 0 && user && user.astBalance >= stakeAmount) {
      mockStore.createStakePosition(stakeAmount, selectedPool);
      onStakeUpdate();
      toast.success(`Staked ${stakeAmount} AST for ${selectedPool === '30day' ? '30' : '90'} days!`);
      setShowStakeDialog(false);
    } else {
      toast.error("Insufficient balance");
    }
  };

  const handleUnstake = (positionId: string) => {
    mockStore.unstakePosition(positionId);
    onStakeUpdate();
    toast.success("Unstaked successfully!");
  };

  const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.amount, 0);
  const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.rewards, 0);

  return (
    <Card className="bg-white/10 border-white/10 text-white">
      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Total Staked</span>
            <span className="font-semibold">{totalStaked} AST</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Pending Rewards</span>
            <span className="font-semibold text-emerald-400">{totalRewards.toFixed(2)} AST</span>
          </div>
        </div>

        <Tabs defaultValue="30">
          <TabsList className="bg-white/20">
            <TabsTrigger value="30">30 Day</TabsTrigger>
            <TabsTrigger value="90">90 Day</TabsTrigger>
          </TabsList>
          <TabsContent value="30" className="mt-4">
            <StakeCard 
              apy={8} 
              poolType="30day"
              user={user}
              onStake={() => {
                setSelectedPool('30day');
                setShowStakeDialog(true);
              }}
            />
          </TabsContent>
          <TabsContent value="90" className="mt-4">
            <StakeCard 
              apy={16} 
              poolType="90day"
              user={user}
              onStake={() => {
                setSelectedPool('90day');
                setShowStakeDialog(true);
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Active Positions */}
        {stakingPools.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-white/90">Active Positions</h4>
            {stakingPools.map((position) => (
              <div key={position.id} className="rounded-lg border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{position.amount} AST</div>
                    <div className="text-xs text-white/70">
                      {position.poolType} • {position.apy}% APY
                    </div>
                    <div className="text-xs text-white/50">
                      Ends: {new Date(position.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-emerald-400">+{position.rewards.toFixed(2)} AST</div>
                    <Button 
                      size="sm" 
                      variant="secondary"
                      className="rounded-full bg-white/20 text-white hover:bg-white/30 mt-1"
                      onClick={() => handleUnstake(position.id)}
                    >
                      Unstake
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stake Dialog */}
        <Dialog open={showStakeDialog} onOpenChange={setShowStakeDialog}>
          <DialogContent className="bg-white text-[#0f172a]">
            <DialogHeader>
              <DialogTitle>Stake AST</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm">Selected Pool: {selectedPool === '30day' ? '30' : '90'} days • {selectedPool === '30day' ? '8' : '16'}% APY</div>
              <div>
                <Label htmlFor="stake-amount">Amount to stake</Label>
                <Input
                  id="stake-amount"
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Number(e.target.value))}
                  min="1"
                  max={user?.astBalance || 0}
                />
                <p className="text-sm text-slate-600 mt-1">Available: {user?.astBalance || 0} AST</p>
              </div>
              <div className="text-sm text-slate-600">
                Expected reward: {((stakeAmount * (selectedPool === '30day' ? 8 : 16)) / 100).toFixed(2)} AST
              </div>
              <Button onClick={handleStake} className="w-full">Confirm Stake</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function StakeCard({ apy, poolType, user, onStake }: { apy: number; poolType: '30day' | '90day'; user: User | null; onStake: () => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/70">APY</div>
          <div className="text-2xl font-bold">{apy}%</div>
        </div>
        <Button 
          onClick={onStake}
          className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90"
          disabled={!user || user.astBalance <= 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Stake
        </Button>
      </div>
      <div className="mt-4 text-sm text-white/70">
        Lock period: {poolType === '30day' ? '30' : '90'} days
      </div>
    </div>
  );
}
