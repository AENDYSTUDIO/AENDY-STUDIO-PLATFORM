'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  Heart
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  coverImage?: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  currentTrackIndex?: number;
  onTrackChange?: (index: number) => void;
}

export function MusicPlayer({ tracks, currentTrackIndex = 0, onTrackChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(tracks[currentTrackIndex]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setCurrentTrack(tracks[currentTrackIndex]);
    setCurrentTime(0);
  }, [currentTrackIndex, tracks]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setCurrentTime(0);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      audioRef.current?.play();
    } else {
      handleNext();
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handlePrevious = () => {
    const newIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    onTrackChange?.(newIndex);
  };

  const handleNext = () => {
    let newIndex;
    if (isShuffle) {
      newIndex = Math.floor(Math.random() * tracks.length);
    } else {
      newIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
    }
    onTrackChange?.(newIndex);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border-t p-4">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-4">
        {/* Track Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={currentTrack.coverImage} />
            <AvatarFallback>{currentTrack.artist.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{currentTrack.title}</p>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsShuffle(!isShuffle)}
            className={isShuffle ? 'text-primary' : 'text-muted-foreground'}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsRepeat(!isRepeat)}
            className={isRepeat ? 'text-primary' : 'text-muted-foreground'}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={currentTrack.duration}
              value={currentTime}
              onChange={handleProgressChange}
              className="flex-1 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground">
              {formatTime(currentTrack.duration)}
            </span>
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-muted rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}