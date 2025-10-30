import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Card } from "@/components/ui/card";

interface VideoPreviewProps {
  videoFile: File | null;
  isPlaying: boolean;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  onLoadedMetadata: (duration: number) => void;
  filters: string;
  textOverlays: Array<{
    id: string;
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    startTime: number;
    endTime: number;
  }>;
}

export interface VideoPreviewRef {
  getCurrentTime: () => number;
  getDuration: () => number;
  seek: (time: number) => void;
}

export const VideoPreview = forwardRef<VideoPreviewRef, VideoPreviewProps>(
  ({ videoFile, isPlaying, currentTime, onTimeUpdate, onLoadedMetadata, filters, textOverlays }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => videoRef.current?.currentTime || 0,
      getDuration: () => videoRef.current?.duration || 0,
      seek: (time: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = time;
        }
      },
    }));

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

    useEffect(() => {
      if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.1) {
        videoRef.current.currentTime = currentTime;
      }
    }, [currentTime]);

    useEffect(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const renderFrame = () => {
        if (video.paused && !video.seeking) {
          animationFrameRef.current = requestAnimationFrame(renderFrame);
          return;
        }

        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;

        // Apply filters
        ctx.filter = filters;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none";

        // Draw text overlays
        const currentTime = video.currentTime;
        textOverlays.forEach((overlay) => {
          if (currentTime >= overlay.startTime && currentTime <= overlay.endTime) {
            ctx.font = `bold ${overlay.fontSize}px Arial`;
            ctx.fillStyle = overlay.color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            // Add text stroke for better visibility
            ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
            ctx.lineWidth = 3;
            ctx.strokeText(overlay.text, overlay.x * canvas.width, overlay.y * canvas.height);
            ctx.fillText(overlay.text, overlay.x * canvas.width, overlay.y * canvas.height);
          }
        });

        animationFrameRef.current = requestAnimationFrame(renderFrame);
      };

      video.addEventListener("loadedmetadata", () => {
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        onLoadedMetadata(video.duration);
        renderFrame();
      });

      video.addEventListener("timeupdate", () => {
        onTimeUpdate(video.currentTime);
      });

      renderFrame();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [filters, textOverlays, onTimeUpdate, onLoadedMetadata]);

    return (
      <Card className="w-full max-w-4xl aspect-video bg-secondary/50 border-2 border-border flex items-center justify-center overflow-hidden relative">
        {videoFile ? (
          <>
            <video
              ref={videoRef}
              className="hidden"
              controls={false}
            />
            <canvas
              ref={canvasRef}
              className="w-full h-full object-contain"
            />
          </>
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
  }
);

VideoPreview.displayName = "VideoPreview";
