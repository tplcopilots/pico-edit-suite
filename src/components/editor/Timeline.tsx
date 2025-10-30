import { Card } from "@/components/ui/card";
import { Film, Music, Type, Sparkles, Scissors } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TimelineProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
  trimStart: number;
  trimEnd: number;
  onTrimChange: (start: number, end: number) => void;
  textOverlays: Array<{
    id: string;
    text: string;
    startTime: number;
    endTime: number;
  }>;
}

export const Timeline = ({
  duration,
  currentTime,
  onSeek,
  trimStart,
  trimEnd,
  onTrimChange,
  textOverlays,
}: TimelineProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<"playhead" | "trim-start" | "trim-end" | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseDown = (e: React.MouseEvent, type: "playhead" | "trim-start" | "trim-end") => {
    e.stopPropagation();
    setIsDragging(true);
    setDragType(type);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !timelineRef.current || !dragType) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const time = (x / rect.width) * duration;

    if (dragType === "playhead") {
      onSeek(time);
    } else if (dragType === "trim-start") {
      onTrimChange(Math.min(time, trimEnd - 0.1), trimEnd);
    } else if (dragType === "trim-end") {
      onTrimChange(trimStart, Math.max(time, trimStart + 0.1));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = (x / rect.width) * duration;
    onSeek(time);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragType, duration, trimStart, trimEnd]);

  const playheadPosition = duration > 0 ? (currentTime / duration) * 100 : 0;
  const trimStartPosition = duration > 0 ? (trimStart / duration) * 100 : 0;
  const trimEndPosition = duration > 0 ? (trimEnd / duration) * 100 : 100;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Timeline</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">{formatTime(currentTime)} / {formatTime(duration)}</span>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Scissors className="w-3 h-3" />
            <span>Trim: {formatTime(trimStart)} - {formatTime(trimEnd)}</span>
          </div>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="px-4 py-3 border-b border-border">
        <div
          ref={timelineRef}
          className="relative h-12 bg-secondary/30 rounded cursor-pointer"
          onClick={handleTimelineClick}
        >
          {/* Trim indicators */}
          <div
            className="absolute top-0 bottom-0 bg-muted/20"
            style={{
              left: 0,
              width: `${trimStartPosition}%`,
            }}
          />
          <div
            className="absolute top-0 bottom-0 bg-muted/20"
            style={{
              left: `${trimEndPosition}%`,
              right: 0,
            }}
          />

          {/* Trim handles */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize hover:w-2 transition-all z-10"
            style={{ left: `${trimStartPosition}%` }}
            onMouseDown={(e) => handleMouseDown(e, "trim-start")}
          />
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize hover:w-2 transition-all z-10"
            style={{ left: `${trimEndPosition}%` }}
            onMouseDown={(e) => handleMouseDown(e, "trim-end")}
          />

          {/* Text overlay indicators */}
          {textOverlays.map((overlay) => {
            const startPos = (overlay.startTime / duration) * 100;
            const width = ((overlay.endTime - overlay.startTime) / duration) * 100;
            return (
              <div
                key={overlay.id}
                className="absolute top-1 h-2 bg-accent/60 rounded"
                style={{
                  left: `${startPos}%`,
                  width: `${width}%`,
                }}
              />
            );
          })}

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary z-20"
            style={{ left: `${playheadPosition}%` }}
          >
            <div
              className="absolute top-0 -translate-x-1/2 w-3 h-3 bg-primary rounded-full cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleMouseDown(e, "playhead")}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* Video Track */}
          <div className="flex items-center gap-3">
            <div className="w-12 flex items-center justify-center">
              <Film className="w-4 h-4 text-primary" />
            </div>
            <Card className="flex-1 h-16 bg-secondary/30 border-border hover:border-primary/50 transition-colors">
              <div className="h-full flex items-center px-3">
                <div 
                  className="h-10 bg-gradient-to-r from-primary/40 to-primary/20 rounded flex items-center justify-center"
                  style={{
                    width: `${((trimEnd - trimStart) / duration) * 100}%`,
                    marginLeft: `${(trimStart / duration) * 100}%`,
                  }}
                >
                  <span className="text-xs font-medium text-foreground">Video</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Text Overlays Track */}
          <div className="flex items-center gap-3">
            <div className="w-12 flex items-center justify-center">
              <Type className="w-4 h-4 text-primary" />
            </div>
            <Card className="flex-1 h-16 bg-secondary/30 border-border relative">
              <div className="h-full flex items-center px-3">
                {textOverlays.map((overlay) => {
                  const left = (overlay.startTime / duration) * 100;
                  const width = ((overlay.endTime - overlay.startTime) / duration) * 100;
                  return (
                    <div
                      key={overlay.id}
                      className="absolute h-10 bg-accent/40 rounded flex items-center justify-center px-2"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <span className="text-xs font-medium text-foreground truncate">
                        {overlay.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
