'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Gift, 
  CheckCircle,
  Trophy,
  Music,
  Upload,
  List,
  MessageSquare,
  Heart,
  Diamond
} from 'lucide-react';

interface Reward {
  id: string;
  name: string;
  description?: string;
  type: 'STREAM' | 'UPLOAD' | 'PLAYLIST' | 'COMMENT' | 'LIKE' | 'PREMIUM';
  value: number;
  isClaimed: boolean;
  createdAt: string;
}

interface RewardsSystemProps {
  userId?: string;
}

export function RewardsSystem({ userId }: RewardsSystemProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [saudioBalance, setSaAudioBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchRewards();
    }
  }, [userId]);

  const fetchRewards = async () => {
    try {
      const response = await fetch(`/api/rewards?userId=${userId}`);
      const data = await response.json();
      setRewards(data.rewards);
      setSaAudioBalance(data.saudioBalance);
    } catch (error) {
      console.error('Rewards fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId: string) => {
    try {
      const response = await fetch('/api/rewards', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rewardId,
          isClaimed: true,
        }),
      });

      if (response.ok) {
        await fetchRewards();
      }
    } catch (error) {
      console.error('Reward claim error:', error);
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'STREAM': return <Music className="h-5 w-5" />;
      case 'UPLOAD': return <Upload className="h-5 w-5" />;
      case 'PLAYLIST': return <List className="h-5 w-5" />;
      case 'COMMENT': return <MessageSquare className="h-5 w-5" />;
      case 'LIKE': return <Heart className="h-5 w-5" />;
      case 'PREMIUM': return <Diamond className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const rewardPerks = [
    {
      name: 'HQ Streaming',
      description: 'High quality audio streaming',
      cost: 0,
      icon: <Music className="h-5 w-5" />,
    },
    {
      name: 'Flair Badges',
      description: 'Exclusive profile badges',
      cost: 500,
      icon: <Star className="h-5 w-5" />,
    },
    {
      name: 'Early Access',
      description: 'Access to new features',
      cost: 1000,
      icon: <Gift className="h-5 w-5" />,
    },
    {
      name: 'Premium Features',
      description: 'Unlock all premium features',
      cost: 2500,
      icon: <Diamond className="h-5 w-5" />,
    },
  ];

  if (loading) {
    return <div>Loading rewards...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rewards & Achievements</h2>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          <Badge variant="secondary">SAUDIO Balance: {saudioBalance}</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Reward Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewardPerks.map((perk, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {perk.icon}
                    <div>
                      <p className="font-medium">{perk.name}</p>
                      <p className="text-sm text-muted-foreground">{perk.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {perk.cost > 0 && (
                      <Badge variant="outline">{perk.cost} SAUDIO</Badge>
                    )}
                    <Button
                      variant={perk.cost === 0 ? "default" : "outline"}
                      size="sm"
                      disabled={perk.cost > saudioBalance}
                    >
                      {perk.cost === 0 ? "Active" : "Unlock"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rewards.length === 0 ? (
                <p className="text-muted-foreground">No achievements yet. Start streaming to earn rewards!</p>
              ) : (
                rewards.map((reward) => (
                  <div key={reward.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRewardIcon(reward.type)}
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{reward.value} SAUDIO</Badge>
                      {reward.isClaimed ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => claimReward(reward.id)}
                        >
                          Claim
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}