import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface VideoPreviewProps {
  videoFile: File | null;
  isPlaying: boolean;
}

export const VideoPreview = ({ videoFile, isPlaying }: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && videoFile) {
      const url = URL.createObjectURL(videoFile);
      videoRef.current.src = url;
      
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <Card className="w-full max-w-4xl aspect-video bg-secondary/50 border-2 border-border flex items-center justify-center overflow-hidden">
      {videoFile ? (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls={false}
        />
      ) : (
        <div className="text-center p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-foreground">No video loaded</h3>
          <p className="text-muted-foreground">Import a video to start editing</p>
        </div>
      )}
    </Card>
  );
};
