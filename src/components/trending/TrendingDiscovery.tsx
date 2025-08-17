'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Play, 
  Heart,
  Clock,
  Users,
  Music,
  List
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  plays: number;
  url: string;
  coverImage?: string;
  createdAt: string;
}

interface Playlist {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  _count: {
    tracks: number;
    likes: number;
  };
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface TrendingDiscoveryProps {
  userId?: string;
}

export function TrendingDiscovery({ userId }: TrendingDiscoveryProps) {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [trendingPlaylists, setTrendingPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tracks' | 'playlists'>('tracks');

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    try {
      const [tracksResponse, playlistsResponse] = await Promise.all([
        fetch('/api/tracks?trending=true'),
        fetch('/api/playlists'),
      ]);

      const tracksData = await tracksResponse.json();
      const playlistsData = await playlistsResponse.json();

      setTrendingTracks(tracksData.tracks);
      setTrendingPlaylists(playlistsData.playlists.filter((p: Playlist) => p.isPublic));
    } catch (error) {
      console.error('Trending data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatPlays = (plays: number) => {
    if (plays >= 1000000) {
      return `${(plays / 1000000).toFixed(1)}M`;
    } else if (plays >= 1000) {
      return `${(plays / 1000).toFixed(1)}K`;
    }
    return plays.toString();
  };

  if (loading) {
    return <div>Loading trending content...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Now
        </h2>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'tracks' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('tracks')}
          >
            <Music className="h-4 w-4 mr-2" />
            Tracks
          </Button>
          <Button
            variant={activeTab === 'playlists' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('playlists')}
          >
            <List className="h-4 w-4 mr-2" />
            Playlists
          </Button>
        </div>
      </div>

      {activeTab === 'tracks' && (
        <div className="space-y-4">
          {trendingTracks.map((track, index) => (
            <Card key={track.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-muted-foreground">
                      #{index + 1}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={track.coverImage} />
                      <AvatarFallback>{track.artist.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-muted-foreground">{track.artist}</p>
                    {track.album && (
                      <p className="text-xs text-muted-foreground">{track.album}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDuration(track.duration)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {formatPlays(track.plays)} plays
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trendingPlaylists.map((playlist, index) => (
            <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <Badge variant="outline">
                    <List className="h-3 w-3 mr-1" />
                    {playlist._count.tracks} tracks
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">{playlist.name}</h3>
                    {playlist.description && (
                      <p className="text-sm text-muted-foreground">{playlist.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={playlist.user.avatar} />
                      <AvatarFallback>{playlist.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      by {playlist.user.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Heart className="h-4 w-4" />
                      {playlist._count.likes} likes
                    </div>
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}