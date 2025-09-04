import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Star, Crown, Medal, CheckCircle, Clock, Sparkles } from "lucide-react";
import { mockStore, Achievement, User } from "@/lib/mockStore";
import { toast } from "sonner";

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [user, setUser] = useState<User>(mockStore.getUser());

  useEffect(() => {
    setAchievements(mockStore.getAchievements());
  }, []);

  const handleMintAchievement = (achievementId: string) => {
    const achievement = mockStore.mintAchievement(achievementId);
    setAchievements(mockStore.getAchievements());
    setUser(mockStore.getUser());
    toast.success(`🎉 Achievement "${achievement.title}" minted! +50 AST bonus!`);
  };

  const mintedAchievements = achievements.filter(a => a.minted);
  const availableAchievements = achievements.filter(a => !a.minted);
  const totalAchievements = achievements.length;
  const completionRate = totalAchievements > 0 ? (mintedAchievements.length / totalAchievements) * 100 : 0;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'rare': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'legendary': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-foreground flex items-center gap-3">
            <Trophy className="h-8 w-8" />
            Achievements
          </h1>
          <p className="text-white/70 dark:text-muted-foreground mt-2">
            Unlock achievements and mint them as NFTs to earn bonus rewards
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white dark:text-foreground">{user.astBalance} AST</div>
          <div className="text-sm text-white/70 dark:text-muted-foreground">Current Balance</div>
        </div>
      </div>

      {/* Achievement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">{mintedAchievements.length}</div>
            <div className="text-xs text-white/70 dark:text-muted-foreground">Minted</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">{availableAchievements.length}</div>
            <div className="text-xs text-white/70 dark:text-muted-foreground">Available</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
          <CardContent className="p-6 text-center">
            <Award className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <div className="text-xs text-white/70 dark:text-muted-foreground">Complete</div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
          <CardContent className="p-6 text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">{mintedAchievements.length * 50}</div>
            <div className="text-xs text-white/70 dark:text-muted-foreground">Bonus AST</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Achievement Progress</span>
              <span className="text-sm text-white/70 dark:text-muted-foreground">
                {mintedAchievements.length} / {totalAchievements}
              </span>
            </div>
            <Progress value={completionRate} className="h-3 bg-white/20 dark:bg-muted" />
            <div className="text-xs text-white/60 dark:text-muted-foreground text-center">
              {totalAchievements - mintedAchievements.length} achievements remaining
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white/20 dark:bg-muted">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            All ({totalAchievements})
          </TabsTrigger>
          <TabsTrigger value="minted" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Minted ({mintedAchievements.length})
          </TabsTrigger>
          <TabsTrigger value="available" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Available ({availableAchievements.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onMint={() => handleMintAchievement(achievement.id)}
                getRarityColor={getRarityColor}
                getRarityBadgeColor={getRarityBadgeColor}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="minted" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mintedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onMint={() => handleMintAchievement(achievement.id)}
                getRarityColor={getRarityColor}
                getRarityBadgeColor={getRarityBadgeColor}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="available" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onMint={() => handleMintAchievement(achievement.id)}
                getRarityColor={getRarityColor}
                getRarityBadgeColor={getRarityBadgeColor}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AchievementCard({ 
  achievement, 
  onMint,
  getRarityColor,
  getRarityBadgeColor
}: { 
  achievement: Achievement; 
  onMint: () => void;
  getRarityColor: (rarity: string) => string;
  getRarityBadgeColor: (rarity: string) => string;
}) {
  return (
    <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-white text-2xl font-bold`}>
            {achievement.icon}
          </div>
          <Badge className={getRarityBadgeColor(achievement.rarity)}>
            {achievement.rarity}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-bold text-lg">{achievement.title}</h3>
          <p className="text-sm text-white/70 dark:text-muted-foreground">
            {achievement.description}
          </p>
        </div>

        <div className="mt-6">
          {achievement.minted ? (
            <div className="space-y-3">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 w-full justify-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Minted
              </Badge>
              {achievement.mintDate && (
                <p className="text-xs text-white/60 dark:text-muted-foreground text-center">
                  Minted on {new Date(achievement.mintDate).toLocaleDateString()}
                </p>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full rounded-full border-white/20 text-white dark:border-border dark:text-foreground"
                  >
                    View NFT
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white dark:bg-card text-slate-900 dark:text-foreground">
                  <DialogHeader>
                    <DialogTitle>{achievement.title}</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    <div className={`h-40 rounded-2xl bg-gradient-to-br ${getRarityColor(achievement.rarity)} flex items-center justify-center text-white text-6xl mb-4`}>
                      {achievement.icon}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-muted-foreground mb-4">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={getRarityBadgeColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      {achievement.mintDate && (
                        <span className="text-xs text-slate-500">
                          Minted: {new Date(achievement.mintDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Button
              onClick={onMint}
              className="w-full rounded-full bg-white text-[#3b1eeb] hover:bg-white/90 dark:bg-primary dark:text-primary-foreground"
            >
              <Award className="h-4 w-4 mr-2" />
              Mint NFT (+50 AST)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
