'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Play, 
  Heart, 
  MoreHorizontal,
  List,
  Music
} from 'lucide-react';

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
  tracks: Array<{
    id: string;
    track: {
      id: string;
      title: string;
      artist: string;
      duration: number;
      url: string;
      coverImage?: string;
    };
  }>;
}

interface PlaylistManagerProps {
  userId?: string;
}

export function PlaylistManager({ userId }: PlaylistManagerProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: userId || 'user-id-placeholder',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlaylists([data.playlist, ...playlists]);
        setFormData({ name: '', description: '', isPublic: true });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Playlist creation error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, value: boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Playlists</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Playlist
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Playlist Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(value) => handleSwitchChange('isPublic', value)}
                />
                <Label htmlFor="isPublic">Public Playlist</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="submit">Create Playlist</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{playlist.name}</CardTitle>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    {playlist._count.tracks} tracks
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    {playlist._count.likes} likes
                  </span>
                </div>
                {playlist.description && (
                  <p className="text-sm text-muted-foreground">
                    {playlist.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <Badge variant={playlist.isPublic ? 'default' : 'secondary'}>
                    {playlist.isPublic ? 'Public' : 'Private'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}