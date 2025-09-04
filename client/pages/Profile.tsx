import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Edit, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Wallet, 
  Star, 
  Award, 
  Target, 
  Activity,
  Settings,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import { mockStore, User as UserType, Achievement, GameSession } from "@/lib/mockStore";
import { toast } from "sonner";

export default function Profile() {
  const [user, setUser] = useState<UserType>(mockStore.getUser());
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email
  });

  useEffect(() => {
    setAchievements(mockStore.getAchievements());
    setGameSessions(mockStore.getGameSessions());
  }, []);

  const handleSaveProfile = () => {
    const updatedUser = mockStore.updateUser(editForm);
    setUser(updatedUser);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleMintAchievement = (achievementId: string) => {
    const achievement = mockStore.mintAchievement(achievementId);
    setAchievements(mockStore.getAchievements());
    setUser(mockStore.getUser());
    toast.success(`🎉 Achievement "${achievement.title}" minted! +50 AST bonus!`);
  };

  const mintedAchievements = achievements.filter(a => a.minted);
  const availableAchievements = achievements.filter(a => !a.minted);
  
  const xpToNextLevel = (user.level * 1000) - user.xp;
  const currentLevelProgress = (user.xp % 1000) / 10;

  const totalGamesPlayed = gameSessions.length;
  const totalGameRewards = gameSessions.reduce((sum, session) => sum + session.reward, 0);
  const averageScore = totalGamesPlayed > 0 ? 
    Math.round(gameSessions.reduce((sum, session) => sum + session.score, 0) / totalGamesPlayed) : 0;

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-foreground flex items-center gap-3">
            <User className="h-8 w-8" />
            Profile
          </h1>
          <p className="text-white/70 dark:text-muted-foreground mt-2">
            Manage your account and view your progress
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(true)}
          className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90 dark:bg-primary dark:text-primary-foreground"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-white/30 text-white/90 dark:bg-muted dark:text-foreground text-2xl">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-white/70 dark:text-muted-foreground">{user.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-lg font-semibold">Level {user.level}</span>
              </div>

              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70 dark:text-muted-foreground">XP Progress</span>
                  <span className="font-medium">{user.xp} XP</span>
                </div>
                <Progress value={currentLevelProgress} className="h-2 bg-white/20 dark:bg-muted" />
                <p className="text-xs text-white/60 dark:text-muted-foreground text-center">
                  {xpToNextLevel} XP to level {user.level + 1}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
              <CardContent className="p-4 text-center">
                <Wallet className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">{user.astBalance}</div>
                <div className="text-xs text-white/70 dark:text-muted-foreground">AST Balance</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">{user.totalEarned}</div>
                <div className="text-xs text-white/70 dark:text-muted-foreground">Total Earned</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold">{mintedAchievements.length}</div>
                <div className="text-xs text-white/70 dark:text-muted-foreground">Achievements</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">{totalGamesPlayed}</div>
                <div className="text-xs text-white/70 dark:text-muted-foreground">Games Played</div>
              </CardContent>
            </Card>
          </div>

          {/* Account Info */}
          <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-white/70 dark:text-muted-foreground" />
                  <div>
                    <div className="text-sm text-white/70 dark:text-muted-foreground">Email</div>
                    <div className="font-medium">{user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-white/70 dark:text-muted-foreground" />
                  <div>
                    <div className="text-sm text-white/70 dark:text-muted-foreground">Member Since</div>
                    <div className="font-medium">{new Date(user.joinDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              {user.walletAddress && (
                <div className="flex items-center gap-3">
                  <Wallet className="h-4 w-4 text-white/70 dark:text-muted-foreground" />
                  <div>
                    <div className="text-sm text-white/70 dark:text-muted-foreground">Wallet Address</div>
                    <div className="font-mono text-sm">{user.walletAddress}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="achievements" className="space-y-6">
        <TabsList className="bg-white/20 dark:bg-muted">
          <TabsTrigger value="achievements" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Achievements ({achievements.length})
          </TabsTrigger>
          <TabsTrigger value="gaming" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Gaming Stats
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onMint={() => handleMintAchievement(achievement.id)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gaming" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
              <CardContent className="p-6 text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                <div className="text-3xl font-bold">{averageScore}</div>
                <div className="text-sm text-white/70 dark:text-muted-foreground">Average Score</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                <div className="text-3xl font-bold">{totalGameRewards}</div>
                <div className="text-sm text-white/70 dark:text-muted-foreground">Game Rewards</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
              <CardContent className="p-6 text-center">
                <Activity className="h-12 w-12 mx-auto mb-4 text-green-400" />
                <div className="text-3xl font-bold">{totalGamesPlayed}</div>
                <div className="text-sm text-white/70 dark:text-muted-foreground">Games Played</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
            <CardHeader>
              <CardTitle>Recent Game Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gameSessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 dark:bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-white/20 dark:bg-muted flex items-center justify-center">
                        {session.gameType === 'spin-win' ? '🎰' : '🏃'}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{session.gameType.replace('-', ' ')}</div>
                        <div className="text-sm text-white/70 dark:text-muted-foreground">
                          {new Date(session.playedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{session.score} pts</div>
                      <div className="text-sm text-green-400">+{session.reward} AST</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/5 dark:bg-muted/50 rounded-lg">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                  <div className="flex-1">
                    <div className="font-medium">Achievement Unlocked</div>
                    <div className="text-sm text-white/70 dark:text-muted-foreground">
                      Earned "First Bill Payer" achievement
                    </div>
                  </div>
                  <div className="text-sm text-white/60 dark:text-muted-foreground">2 days ago</div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 dark:bg-muted/50 rounded-lg">
                  <Wallet className="h-8 w-8 text-green-400" />
                  <div className="flex-1">
                    <div className="font-medium">Staking Reward</div>
                    <div className="text-sm text-white/70 dark:text-muted-foreground">
                      Received 33.33 AST from staking pool
                    </div>
                  </div>
                  <div className="text-sm text-white/60 dark:text-muted-foreground">3 days ago</div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/5 dark:bg-muted/50 rounded-lg">
                  <Activity className="h-8 w-8 text-blue-400" />
                  <div className="flex-1">
                    <div className="font-medium">Game Completed</div>
                    <div className="text-sm text-white/70 dark:text-muted-foreground">
                      Played Runner game and earned 25 AST
                    </div>
                  </div>
                  <div className="text-sm text-white/60 dark:text-muted-foreground">5 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="bg-white dark:bg-card text-slate-900 dark:text-foreground">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveProfile} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AchievementCard({ 
  achievement, 
  onMint 
}: { 
  achievement: Achievement; 
  onMint: () => void; 
}) {
  const rarityColors = {
    common: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    rare: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    epic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    legendary: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  };

  return (
    <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{achievement.icon}</div>
          <Badge className={rarityColors[achievement.rarity]}>
            {achievement.rarity}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-lg">{achievement.title}</h3>
          <p className="text-sm text-white/70 dark:text-muted-foreground">
            {achievement.description}
          </p>
        </div>

        <div className="mt-4">
          {achievement.minted ? (
            <div className="space-y-2">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Award className="h-3 w-3 mr-1" />
                Minted
              </Badge>
              {achievement.mintDate && (
                <p className="text-xs text-white/60 dark:text-muted-foreground">
                  Minted on {new Date(achievement.mintDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : (
            <Button
              onClick={onMint}
              className="w-full rounded-full bg-white text-[#3b1eeb] hover:bg-white/90 dark:bg-primary dark:text-primary-foreground"
            >
              Mint NFT
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
