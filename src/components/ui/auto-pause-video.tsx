'use client'

import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface AutoPauseVideoProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  threshold?: number; // Intersection observer threshold (default 0.5)
}

export function AutoPauseVideo({
  src,
  poster,
  className = '',
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  threshold = 0.5
}: AutoPauseVideoProps) {
  const [, setIsPlaying] = useState(false);

  // Use intersection observer to detect when video is in viewport
  const { ref: videoRef, isIntersecting } = useIntersectionObserver({
    threshold,
    triggerOnce: false // Keep observing for enter/exit
  });

  useEffect(() => {
    const video = videoRef.current as unknown as HTMLVideoElement;
    if (!video) return;

    if (isIntersecting && autoPlay) {
      // Video is in viewport - play it
      video.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('Video autoplay prevented:', error);
      });
    } else {
      // Video is out of viewport - pause it
      video.pause();
      setIsPlaying(false);
    }
  }, [isIntersecting, autoPlay, videoRef]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current as unknown as HTMLVideoElement;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef]);

  return (
    <video
      ref={videoRef as unknown as React.RefObject<HTMLVideoElement>}
      className={className}
      poster={poster}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload="metadata"
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}