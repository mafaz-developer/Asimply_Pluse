import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Megaphone, Gamepad2, Wallet, Sparkles, CheckCircle, Clock, Trophy } from "lucide-react";
import { mockStore, Activity } from "@/lib/mockStore";
import { toast } from "sonner";

const activityIcons = {
  bill_payment: CreditCard,
  referral: Megaphone,
  game: Gamepad2,
  staking: Wallet,
  survey: Sparkles,
};

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [user, setUser] = useState(mockStore.getUser());

  useEffect(() => {
    setActivities(mockStore.getActivities());
  }, []);

  const handleActivityAction = (activity: Activity) => {
    if (activity.completed) {
      toast.info("Activity already completed!");
      return;
    }

    let newProgress = activity.progress;
    
    switch (activity.type) {
      case 'bill_payment':
        newProgress = Math.min(activity.progress + 1, activity.maxProgress);
        toast.success("Bill payment completed! +10 AST");
        break;
      case 'referral':
        newProgress = Math.min(activity.progress + 1, activity.maxProgress);
        toast.success("Friend invited! +20 AST");
        break;
      case 'game':
        newProgress = Math.min(activity.progress + 1, activity.maxProgress);
        toast.success("Game completed! +15 AST");
        break;
      case 'staking':
        newProgress = Math.min(activity.progress + 1, activity.maxProgress);
        toast.success("Staking position created! +50 AST");
        break;
      case 'survey':
        newProgress = Math.min(activity.progress + 1, activity.maxProgress);
        toast.success("Survey completed! +5 AST");
        break;
    }

    const updatedActivity = mockStore.updateActivityProgress(activity.id, newProgress);
    setActivities(mockStore.getActivities());
    setUser(mockStore.getUser());

    if (updatedActivity.completed) {
      toast.success(`🎉 Activity completed! Earned ${updatedActivity.reward} AST!`);
    }
  };

  const completedActivities = activities.filter(a => a.completed);
  const activeActivities = activities.filter(a => !a.completed);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white dark:text-foreground">Activities</h1>
          <p className="text-white/70 dark:text-muted-foreground mt-2">
            Complete activities to earn AST tokens and unlock achievements
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
            Active ({activeActivities.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-slate-900">
            Completed ({completedActivities.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeActivities.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                onAction={() => handleActivityAction(activity)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedActivities.map((activity) => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                onAction={() => handleActivityAction(activity)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ActivityCard({ activity, onAction }: { activity: Activity; onAction: () => void }) {
  const Icon = activityIcons[activity.type];
  const progressPercent = (activity.progress / activity.maxProgress) * 100;

  return (
    <Card className="bg-white/10 dark:bg-card border-white/10 dark:border-border text-white dark:text-foreground">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Icon className="h-5 w-5" />
            {activity.title}
          </CardTitle>
          {activity.completed && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" />
              Done
            </Badge>
          )}
        </div>
        <p className="text-sm text-white/70 dark:text-muted-foreground">
          {activity.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70 dark:text-muted-foreground">Progress</span>
            <span className="font-medium">{activity.progress}/{activity.maxProgress}</span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-white/20 dark:bg-muted" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-white/70 dark:text-muted-foreground">Reward: {activity.reward} AST</span>
          </div>
          
          {activity.completed ? (
            <Button size="sm" disabled className="rounded-full">
              <CheckCircle className="h-4 w-4 mr-1" />
              Completed
            </Button>
          ) : (
            <ActivityActionButton activity={activity} onAction={onAction} />
          )}
        </div>

        {activity.completedDate && (
          <div className="flex items-center gap-2 text-xs text-white/60 dark:text-muted-foreground">
            <Clock className="h-3 w-3" />
            Completed on {new Date(activity.completedDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityActionButton({ activity, onAction }: { activity: Activity; onAction: () => void }) {
  const [showDialog, setShowDialog] = useState(false);

  const getActionText = () => {
    switch (activity.type) {
      case 'bill_payment': return 'Pay Bill';
      case 'referral': return 'Invite Friend';
      case 'game': return 'Play Game';
      case 'staking': return 'Stake Tokens';
      case 'survey': return 'Take Survey';
      default: return 'Start';
    }
  };

  const handleAction = () => {
    if (activity.type === 'referral') {
      setShowDialog(true);
    } else {
      onAction();
    }
  };

  return (
    <>
      <Button 
        size="sm" 
        onClick={handleAction}
        className="rounded-full bg-white text-[#3b1eeb] hover:bg-white/90 dark:bg-primary dark:text-primary-foreground"
      >
        {getActionText()}
      </Button>

      {activity.type === 'referral' && (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="bg-white dark:bg-card text-slate-900 dark:text-foreground">
            <DialogHeader>
              <DialogTitle>Invite a Friend</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Friend's Email</Label>
                <Input id="email" placeholder="friend@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Referral Link</Label>
                <div className="flex gap-2">
                  <Input 
                    value="https://asimply-pluse.com/ref/player1" 
                    readOnly 
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText("https://asimply-pluse.com/ref/player1");
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={() => {
                  onAction();
                  setShowDialog(false);
                }}
              >
                Send Invitation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
