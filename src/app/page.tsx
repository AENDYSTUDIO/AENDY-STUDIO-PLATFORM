'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AuthForm } from '@/components/auth/AuthForm';
import { TrackUpload } from '@/components/upload/TrackUpload';
import { PlaylistManager } from '@/components/playlists/PlaylistManager';
import { MessagingSystem } from '@/components/messages/MessagingSystem';
import { TrendingDiscovery } from '@/components/trending/TrendingDiscovery';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { RewardsSystem } from '@/components/rewards/RewardsSystem';
import { MusicPlayer } from '@/components/music/MusicPlayer';
import { useAuthStore } from '@/stores/auth';
import { 
  Music, 
  Home, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  Settings, 
  User, 
  Upload,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const { user, isAuthenticated, setUser, logout } = useAuthStore();

  const togglePlay = () => setPlaying(!playing);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const navItems = [
    { icon: Home, label: 'Home' },
    { icon: TrendingUp, label: 'Trending' },
    { icon: Heart, label: 'Favorites' },
    { icon: MessageSquare, label: 'Messages' },
    { icon: User, label: 'Profile' },
    { icon: Upload, label: 'Upload' },
    { icon: Settings, label: 'Settings' },
  ];

  const trendingTracks = [
    { id: 1, title: 'Summer Vibes', artist: 'DJ Sunshine', plays: '1.2M', duration: '3:45' },
    { id: 2, title: 'Night Drive', artist: 'Midnight Crew', plays: '890K', duration: '4:12' },
    { id: 3, title: 'Ocean Dreams', artist: 'Wave Rider', plays: '654K', duration: '3:28' },
    { id: 4, title: 'Mountain Echo', artist: 'Nature Sounds', plays: '432K', duration: '5:01' },
  ];

  const recentTracks = [
    { id: 5, title: 'City Lights', artist: 'Urban Beats', plays: '234K', duration: '3:15' },
    { id: 6, title: 'Desert Wind', artist: 'Sand Dunes', plays: '189K', duration: '4:33' },
  ];

  const tracks = [
    {
      id: 1,
      title: 'Summer Vibes',
      artist: 'DJ Sunshine',
      duration: 225,
      url: '/audio/summer-vibes.mp3',
      coverImage: '/covers/summer-vibes.jpg',
    },
    {
      id: 2,
      title: 'Night Drive',
      artist: 'Midnight Crew',
      duration: 252,
      url: '/audio/night-drive.mp3',
      coverImage: '/covers/night-drive.jpg',
    },
    {
      id: 3,
      title: 'Ocean Dreams',
      artist: 'Wave Rider',
      duration: 208,
      url: '/audio/ocean-dreams.mp3',
      coverImage: '/covers/ocean-dreams.jpg',
    },
  ];

  if (!isAuthenticated) {
    return <AuthForm onAuth={setUser} />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0 lg:static lg:inset-0"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 mb-8">
            <Music className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">MusicStream</h1>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.isPremium ? 'Premium User' : 'Free User'}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs">
                    <span>SAUDIO Balance</span>
                    <Badge variant="secondary">1,250</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-card border-b p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleSidebar}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            <div className="flex items-center gap-4">
              {!user?.isPremium && (
                <Button variant="outline" size="sm">
                  Upgrade to Premium
                </Button>
              )}
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="home" className="w-full">
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="rewards">Rewards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recently Played</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentTracks.map((track) => (
                          <div key={track.id} className="flex items-center gap-3">
                            <Button variant="ghost" size="icon">
                              <Play className="h-4 w-4" />
                            </Button>
                            <div className="flex-1">
                              <p className="font-medium">{track.title}</p>
                              <p className="text-sm text-muted-foreground">{track.artist}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{track.duration}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Artists</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {trendingTracks.map((track) => (
                          <div key={track.id} className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{track.artist.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium">{track.artist}</p>
                              <p className="text-sm text-muted-foreground">{track.plays} plays</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Your Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Tracks Played</span>
                            <span className="font-medium">1,234</span>
                          </div>
                          <Progress value={65} className="mt-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Playlists Created</span>
                            <span className="font-medium">12</span>
                          </div>
                          <Progress value={40} className="mt-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>SAUDIO Earned</span>
                            <span className="font-medium">1,250</span>
                          </div>
                          <Progress value={80} className="mt-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="trending" className="mt-6">
                <TrendingDiscovery userId={user?.id} />
              </TabsContent>
              
              <TabsContent value="upload" className="mt-6">
                <TrackUpload onUpload={(track) => console.log('Track uploaded:', track)} />
              </TabsContent>
              
              <TabsContent value="playlists" className="mt-6">
                <PlaylistManager userId={user?.id} />
              </TabsContent>
              
              <TabsContent value="messages" className="mt-6">
                <MessagingSystem userId={user?.id} />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <SettingsPage userId={user?.id} onLogout={logout} />
              </TabsContent>
              
              <TabsContent value="rewards" className="mt-6">
                <RewardsSystem userId={user?.id} />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Music Player */}
        <MusicPlayer tracks={tracks} />
      </div>
    </div>
  );
}