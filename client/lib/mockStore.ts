// Mock data store with localStorage persistence
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  walletAddress?: string;
  walletId?: string;
  astBalance: number;
  level: number;
  xp: number;
  joinDate: string;
  totalEarned: number;
  achievements: Achievement[];
  stakingPools: StakingPosition[];
}

export interface WalletConnection {
  id: string;
  address: string;
  connectedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  minted: boolean;
  mintDate?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Activity {
  id: string;
  type: 'bill_payment' | 'referral' | 'game' | 'staking' | 'survey';
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  reward: number;
  completed: boolean;
  completedDate?: string;
}

export interface StakingPosition {
  id: string;
  poolType: '30day' | '90day';
  amount: number;
  apy: number;
  startDate: string;
  endDate: string;
  rewards: number;
  status: 'active' | 'completed' | 'withdrawn';
}

export interface Battle {
  id: string;
  name: string;
  participants: BattleParticipant[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'upcoming';
  prize: number;
  type: 'weekly' | 'monthly' | 'special';
}

export interface BattleParticipant {
  id: string;
  name: string;
  score: number;
  rank: number;
  avatar?: string;
}

export interface GameSession {
  id: string;
  gameType: 'spin-win' | 'runner';
  score: number;
  reward: number;
  playedAt: string;
  duration: number;
}

class MockStore {
  private storageKey = 'asimply-pluse-data';

  private defaultUser: User = {
    id: '1',
    name: 'Player One',
    email: 'player@example.com',
    astBalance: 1250,
    level: 5,
    xp: 2340,
    joinDate: '2024-01-15',
    totalEarned: 3450,
    achievements: [
      {
        id: 'first-bill',
        title: 'First Bill Payer',
        description: 'Paid your first bill through the platform',
        icon: '💳',
        minted: true,
        mintDate: '2024-02-01',
        rarity: 'common'
      },
      {
        id: 'super-referrer',
        title: 'Super Referrer',
        description: 'Referred 10 friends to the platform',
        icon: '📢',
        minted: false,
        rarity: 'rare'
      },
      {
        id: 'staking-starter',
        title: 'Staking Starter',
        description: 'Made your first staking deposit',
        icon: '💰',
        minted: false,
        rarity: 'common'
      }
    ],
    stakingPools: [
      {
        id: 'stake-1',
        poolType: '30day',
        amount: 500,
        apy: 8,
        startDate: '2024-08-01',
        endDate: '2024-09-01',
        rewards: 33.33,
        status: 'active'
      }
    ]
  };

  private defaultActivities: Activity[] = [
    {
      id: 'bill-1',
      type: 'bill_payment',
      title: 'Bill Payment',
      description: 'Pay utility bills and earn rewards',
      progress: 3,
      maxProgress: 5,
      reward: 50,
      completed: false
    },
    {
      id: 'ref-1',
      type: 'referral',
      title: 'Referrals',
      description: 'Invite friends and earn together',
      progress: 2,
      maxProgress: 10,
      reward: 100,
      completed: false
    },
    {
      id: 'game-1',
      type: 'game',
      title: 'Mini Games',
      description: 'Play games and win AST tokens',
      progress: 8,
      maxProgress: 10,
      reward: 75,
      completed: false
    },
    {
      id: 'stake-1',
      type: 'staking',
      title: 'Staking',
      description: 'Stake tokens for passive rewards',
      progress: 1,
      maxProgress: 3,
      reward: 200,
      completed: false
    },
    {
      id: 'survey-1',
      type: 'survey',
      title: 'Surveys',
      description: 'Complete surveys for bonus rewards',
      progress: 1,
      maxProgress: 5,
      reward: 25,
      completed: false
    }
  ];

  private defaultBattles: Battle[] = [
    {
      id: 'weekly-1',
      name: 'Weekly Champions',
      participants: [
        { id: '1', name: 'Alex', score: 1280, rank: 1, avatar: '🚀' },
        { id: '2', name: 'Jordan', score: 1120, rank: 2, avatar: '⚡' },
        { id: '3', name: 'Sam', score: 980, rank: 3, avatar: '🔥' },
        { id: '4', name: 'Taylor', score: 860, rank: 4, avatar: '💎' },
        { id: '5', name: 'Player One', score: 750, rank: 5, avatar: '🎯' }
      ],
      startDate: '2024-09-02',
      endDate: '2024-09-09',
      status: 'active',
      prize: 1000,
      type: 'weekly'
    }
  ];

  private defaultGameSessions: GameSession[] = [
    {
      id: 'game-1',
      gameType: 'spin-win',
      score: 250,
      reward: 15,
      playedAt: '2024-09-03T10:30:00Z',
      duration: 120
    },
    {
      id: 'game-2',
      gameType: 'runner',
      score: 1850,
      reward: 25,
      playedAt: '2024-09-03T14:15:00Z',
      duration: 180
    }
  ];

  private getData() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultData = {
      user: this.defaultUser,
      activities: this.defaultActivities,
      battles: this.defaultBattles,
      gameSessions: this.defaultGameSessions
    };
    
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data: any) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // User methods
  getUser(): User {
    return this.getData().user;
  }

  updateUser(updates: Partial<User>): User {
    const data = this.getData();
    data.user = { ...data.user, ...updates };
    this.saveData(data);
    return data.user;
  }

  updateBalance(amount: number): User {
    const data = this.getData();
    data.user.astBalance += amount;
    if (amount > 0) {
      data.user.totalEarned += amount;
    }
    this.saveData(data);
    return data.user;
  }

  // Activities methods
  getActivities(): Activity[] {
    return this.getData().activities;
  }

  updateActivityProgress(activityId: string, progress: number): Activity {
    const data = this.getData();
    const activity = data.activities.find((a: Activity) => a.id === activityId);
    if (activity) {
      activity.progress = Math.min(progress, activity.maxProgress);
      if (activity.progress >= activity.maxProgress && !activity.completed) {
        activity.completed = true;
        activity.completedDate = new Date().toISOString();
        // Award reward
        this.updateBalance(activity.reward);
      }
    }
    this.saveData(data);
    return activity;
  }

  // Achievements methods
  getAchievements(): Achievement[] {
    return this.getData().user.achievements;
  }

  mintAchievement(achievementId: string): Achievement {
    const data = this.getData();
    const achievement = data.user.achievements.find((a: Achievement) => a.id === achievementId);
    if (achievement && !achievement.minted) {
      achievement.minted = true;
      achievement.mintDate = new Date().toISOString();
      // Award bonus for minting
      this.updateBalance(50);
    }
    this.saveData(data);
    return achievement;
  }

  // Staking methods
  getStakingPools(): StakingPosition[] {
    return this.getData().user.stakingPools;
  }

  createStakePosition(amount: number, poolType: '30day' | '90day'): StakingPosition {
    const data = this.getData();
    const apy = poolType === '30day' ? 8 : 16;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (poolType === '30day' ? 30 : 90));

    const position: StakingPosition = {
      id: `stake-${Date.now()}`,
      poolType,
      amount,
      apy,
      startDate: new Date().toISOString(),
      endDate: endDate.toISOString(),
      rewards: 0,
      status: 'active'
    };

    data.user.stakingPools.push(position);
    data.user.astBalance -= amount;
    this.saveData(data);
    return position;
  }

  unstakePosition(positionId: string): StakingPosition {
    const data = this.getData();
    const position = data.user.stakingPools.find((p: StakingPosition) => p.id === positionId);
    if (position && position.status === 'active') {
      position.status = 'withdrawn';
      data.user.astBalance += position.amount + position.rewards;
    }
    this.saveData(data);
    return position;
  }

  // Battles methods
  getBattles(): Battle[] {
    return this.getData().battles;
  }

  joinBattle(battleId: string): Battle {
    const data = this.getData();
    const battle = data.battles.find((b: Battle) => b.id === battleId);
    const user = data.user;
    
    if (battle && !battle.participants.find(p => p.id === user.id)) {
      battle.participants.push({
        id: user.id,
        name: user.name,
        score: 0,
        rank: battle.participants.length + 1
      });
    }
    this.saveData(data);
    return battle;
  }

  // Game sessions methods
  getGameSessions(): GameSession[] {
    return this.getData().gameSessions;
  }

  addGameSession(gameType: 'spin-win' | 'runner', score: number, reward: number, duration: number): GameSession {
    const data = this.getData();
    const session: GameSession = {
      id: `game-${Date.now()}`,
      gameType,
      score,
      reward,
      playedAt: new Date().toISOString(),
      duration
    };

    data.gameSessions.push(session);
    this.updateBalance(reward);
    this.saveData(data);
    return session;
  }

  // Wallet connection methods
  connectWallet(walletId: string, address: string): WalletConnection {
    const data = this.getData();
    const connection: WalletConnection = {
      id: walletId,
      address,
      connectedAt: new Date().toISOString()
    };

    // Update user with wallet info
    data.user.walletId = walletId;
    data.user.walletAddress = address;
    
    // Save wallet connection separately
    localStorage.setItem("wallet-connection", JSON.stringify(connection));
    this.saveData(data);
    return connection;
  }

  getWalletConnection(): WalletConnection | null {
    const saved = localStorage.getItem("wallet-connection");
    return saved ? JSON.parse(saved) : null;
  }

  disconnectWallet(): void {
    const data = this.getData();
    data.user.walletId = undefined;
    data.user.walletAddress = undefined;
    localStorage.removeItem("wallet-connection");
    this.saveData(data);
  }

  // Reset data
  resetData(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem("wallet-connection");
  }
}

export const mockStore = new MockStore();
