import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp, Clock, AlertCircle, CheckCircle, DollarSign } from "lucide-react";
import { mockStore, StakingPosition, User } from "@/lib/mockStore";
import { toast } from "sonner";

export default function Staking() {
  const [user, setUser] = useState<User>(mockStore.getUser());
  const [stakingPools, setStakingPools] = useState<StakingPosition[]>([]);
  const [selectedPool, setSelectedPool] = useState<'30day' | '90day'>('30day');
  const [stakeAmount, setStakeAmount] = useState('');
  const [showStakeDialog, setShowStakeDialog] = useState(false);

  useEffect(() => {
    setStakingPools(mockStore.getStakingPools());
  }, []);

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (amount > user.astBalance) {
      toast.error("Insufficient balance");
      return;
    }

    const position = mockStore.createStakePosition(amount, selectedPool);
    setUser(mockStore.getUser());
    setStakingPools(mockStore.getStakingPools());
    setStakeAmount('');
    setShowStakeDialog(false);
    
    toast.success(`Successfully staked ${amount} AST in ${selectedPool} pool!`);
  };

  const handleUnstake = (positionId: string) => {
    const position = mockStore.unstakePosition(positionId);
    setUser(mockStore.getUser());
    setStakingPools(mockStore.getStakingPools());
    
    toast.success(`Unstaked ${position.amount} AST plus ${position.rewards.toFixed(2)} AST rewards!`);
  };

  const activePositions = stakingPools.filter(p => p.status === 'active');
  const completedPositions = stakingPools.filter(p => p.status === 'completed' || p.status === 'withdrawn');

  const totalStaked = activePositions.reduce((sum, p) => sum + p.amount, 0);
  const totalRewards = activePositions.reduce((sum, p) => sum + p.rewards, 0);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-foreground flex items-center gap-3">
            <Wallet className="h-8 w-8" />
            Staking Pools
          </h1>
          <p className="text-white/70 dark:text-muted-foreground mt-2">
            Stake your AST tokens to earn passive rewards
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white dark:text-foreground">{user.astBalance} AST</div>
          <div className="text-sm text-white/70 dark:text-muted-foreground">Available Balance</div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 dark:text-muted-foreground">Total Staked</p>
                <p className="text-2xl font-bold">{totalStaked} AST</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 dark:text-muted-foreground">Total Rewards</p>
                <p className="text-2xl font-bold text-green-400">{totalRewards.toFixed(2)} AST</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70 dark:text-muted-foreground">Active Positions</p>
                <p className="text-2xl font-bold">{activePositions.length}</p>
              </div>
              <Wallet className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staking Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StakingPoolCard
          poolType="30day"
          apy={8}
          minStake={100}
          onStake={() => {
            setSelectedPool('30day');
            setShowStakeDialog(true);
          }}
        />
        <StakingPoolCard
          poolType="90day"
          apy={16}
          minStake={500}
          onStake={() => {
            setSelectedPool('90day');
            setShowStakeDialog(true);
          }}
        />
      </div>

      {/* User Positions */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-white/20 dark:bg-muted">
          <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Active Positions ({activePositions.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            History ({completedPositions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activePositions.map((position) => (
              <StakingPositionCard
                key={position.id}
                position={position}
                onUnstake={() => handleUnstake(position.id)}
              />
            ))}
          </div>
          
          {activePositions.length === 0 && (
            <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Wallet className="h-12 w-12 text-white/50 dark:text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Stakes</h3>
                <p className="text-white/70 dark:text-muted-foreground text-center mb-4">
                  Start staking your AST tokens to earn passive rewards
                </p>
                <Button 
                  onClick={() => setShowStakeDialog(true)}
                  className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90 dark:bg-primary dark:text-primary-foreground"
                >
                  Start Staking
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedPositions.map((position) => (
              <CompletedStakingCard key={position.id} position={position} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Stake Dialog */}
      <Dialog open={showStakeDialog} onOpenChange={setShowStakeDialog}>
        <DialogContent className="bg-white dark:bg-card text-slate-900 dark:text-foreground">
          <DialogHeader>
            <DialogTitle>Stake AST Tokens</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Selected Pool</Label>
              <div className="flex gap-2">
                <Button
                  variant={selectedPool === '30day' ? 'default' : 'outline'}
                  onClick={() => setSelectedPool('30day')}
                  className="flex-1"
                >
                  30 Day (8% APY)
                </Button>
                <Button
                  variant={selectedPool === '90day' ? 'default' : 'outline'}
                  onClick={() => setSelectedPool('90day')}
                  className="flex-1"
                >
                  90 Day (16% APY)
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Stake</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                max={user.astBalance}
              />
              <div className="flex justify-between text-sm text-slate-600 dark:text-muted-foreground">
                <span>Available: {user.astBalance} AST</span>
                <Button
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={() => setStakeAmount(user.astBalance.toString())}
                >
                  Use Max
                </Button>
              </div>
            </div>

            <div className="bg-slate-100 dark:bg-muted rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pool Duration:</span>
                <span className="font-medium">{selectedPool === '30day' ? '30' : '90'} days</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>APY:</span>
                <span className="font-medium text-green-600">{selectedPool === '30day' ? '8' : '16'}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estimated Rewards:</span>
                <span className="font-medium text-green-600">
                  {stakeAmount ? (
                    (parseFloat(stakeAmount) * (selectedPool === '30day' ? 0.08 : 0.16) * (selectedPool === '30day' ? 30 : 90) / 365).toFixed(2)
                  ) : '0'} AST
                </span>
              </div>
            </div>

            <Button onClick={handleStake} className="w-full">
              Stake {stakeAmount || '0'} AST
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StakingPoolCard({ 
  poolType, 
  apy, 
  minStake, 
  onStake 
}: { 
  poolType: '30day' | '90day'; 
  apy: number; 
  minStake: number; 
  onStake: () => void; 
}) {
  return (
    <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {poolType === '30day' ? '30 Day Pool' : '90 Day Pool'}
          </CardTitle>
          <Badge className={`${
            poolType === '30day' 
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
              : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
          }`}>
            {apy}% APY
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/70 dark:text-muted-foreground">Lock Period:</span>
            <span className="font-medium">{poolType === '30day' ? '30' : '90'} days</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70 dark:text-muted-foreground">Minimum Stake:</span>
            <span className="font-medium">{minStake} AST</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/70 dark:text-muted-foreground">Reward Frequency:</span>
            <span className="font-medium">Daily</span>
          </div>
        </div>

        <div className="bg-white/5 dark:bg-muted/50 rounded-lg p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{apy}%</div>
            <div className="text-sm text-white/70 dark:text-muted-foreground">Annual Percentage Yield</div>
          </div>
        </div>

        <Button 
          onClick={onStake}
          className="w-full rounded-full bg-white text-[#3b1eeb] hover:bg-white/90 dark:bg-primary dark:text-primary-foreground"
        >
          Stake Now
        </Button>
      </CardContent>
    </Card>
  );
}

function StakingPositionCard({ 
  position, 
  onUnstake 
}: { 
  position: StakingPosition; 
  onUnstake: () => void; 
}) {
  const startDate = new Date(position.startDate);
  const endDate = new Date(position.endDate);
  const now = new Date();
  
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, (daysElapsed / totalDays) * 100);
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  
  const canUnstake = now >= endDate;

  return (
    <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            {position.poolType === '30day' ? '30 Day' : '90 Day'} Stake
          </CardTitle>
          <Badge className={`${
            position.status === 'active' 
              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
              : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
          }`}>
            {position.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/70 dark:text-muted-foreground">Staked Amount</p>
            <p className="text-lg font-bold">{position.amount} AST</p>
          </div>
          <div>
            <p className="text-sm text-white/70 dark:text-muted-foreground">Current Rewards</p>
            <p className="text-lg font-bold text-green-400">{position.rewards.toFixed(2)} AST</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70 dark:text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20 dark:bg-muted" />
          <div className="flex items-center justify-between text-xs text-white/60 dark:text-muted-foreground">
            <span>Started: {startDate.toLocaleDateString()}</span>
            <span>Ends: {endDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="bg-white/5 dark:bg-muted/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70 dark:text-muted-foreground">
              {canUnstake ? 'Ready to unstake' : `${daysRemaining} days remaining`}
            </span>
            <span className="font-medium">{position.apy}% APY</span>
          </div>
        </div>

        <Button 
          onClick={onUnstake}
          disabled={!canUnstake}
          className={`w-full rounded-full ${
            canUnstake 
              ? 'bg-white text-[#3b1eeb] hover:bg-white/90 dark:bg-primary dark:text-primary-foreground' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {canUnstake ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Unstake & Claim
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 mr-2" />
              Locked ({daysRemaining}d)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function CompletedStakingCard({ position }: { position: StakingPosition }) {
  return (
    <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground opacity-75">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            {position.poolType === '30day' ? '30 Day' : '90 Day'} Stake
          </CardTitle>
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            {position.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white/70 dark:text-muted-foreground">Staked Amount</p>
            <p className="text-lg font-bold">{position.amount} AST</p>
          </div>
          <div>
            <p className="text-sm text-white/70 dark:text-muted-foreground">Total Rewards</p>
            <p className="text-lg font-bold text-green-400">{position.rewards.toFixed(2)} AST</p>
          </div>
        </div>

        <div className="text-xs text-white/60 dark:text-muted-foreground">
          <div>Started: {new Date(position.startDate).toLocaleDateString()}</div>
          <div>Completed: {new Date(position.endDate).toLocaleDateString()}</div>
        </div>
      </CardContent>
    </Card>
  );
}
