'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Music,
  Upload,
  Save,
  LogOut
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: string;
}

interface SettingsPageProps {
  userId?: string;
  onLogout?: () => void;
}

export function SettingsPage({ userId, onLogout }: SettingsPageProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    profilePublic: true,
    showOnlineStatus: true,
    allowMessages: true,
  });

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/profile?userId=${userId}`);
      const data = await response.json();
      setUser(data.user);
      setFormData({
        name: data.user.name || '',
        bio: data.user.bio || '',
        avatar: data.user.avatar || '',
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (category: string, name: string, value: boolean) => {
    if (category === 'notifications') {
      setNotifications(prev => ({ ...prev, [name]: value }));
    } else if (category === 'privacy') {
      setPrivacy(prev => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Settings
        </h2>
        <div className="flex items-center gap-2">
          {user?.isPremium && (
            <Badge variant="default">Premium User</Badge>
          )}
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email updates</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(value) => handleSwitchChange('notifications', 'email', value)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Get push notifications</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(value) => handleSwitchChange('notifications', 'push', value)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">Receive marketing updates</p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(value) => handleSwitchChange('notifications', 'marketing', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Public Profile</p>
                <p className="text-sm text-muted-foreground">Anyone can view your profile</p>
              </div>
              <Switch
                checked={privacy.profilePublic}
                onCheckedChange={(value) => handleSwitchChange('privacy', 'profilePublic', value)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Online Status</p>
                <p className="text-sm text-muted-foreground">Show when you're online</p>
              </div>
              <Switch
                checked={privacy.showOnlineStatus}
                onCheckedChange={(value) => handleSwitchChange('privacy', 'showOnlineStatus', value)}
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Allow Messages</p>
                <p className="text-sm text-muted-foreground">Anyone can send you messages</p>
              </div>
              <Switch
                checked={privacy.allowMessages}
                onCheckedChange={(value) => handleSwitchChange('privacy', 'allowMessages', value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Music Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Music Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Audio Quality</Label>
              <div className="flex items-center gap-2">
                <Badge variant={user?.isPremium ? "default" : "secondary"}>
                  {user?.isPremium ? "High Quality" : "Standard Quality"}
                </Badge>
                {!user?.isPremium && (
                  <Button variant="outline" size="sm">
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Upload Quality</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Lossless</Badge>
                <Badge variant="outline">High Bitrate</Badge>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label>Streaming Buffer</Label>
              <Progress value={75} />
              <p className="text-xs text-muted-foreground">Optimized for your connection</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}