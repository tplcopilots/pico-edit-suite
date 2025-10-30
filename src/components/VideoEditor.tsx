import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play, Pause, SkipBack, SkipForward, Download, Loader2 } from "lucide-react";
import { VideoPreview, VideoPreviewRef } from "./editor/VideoPreview";
import { Timeline } from "./editor/Timeline";
import { ToolsPanel } from "./editor/ToolsPanel";
import { toast } from "sonner";
import { exportVideo } from "@/lib/videoExport";

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  startTime: number;
  endTime: number;
}

export const VideoEditor = () => {
  const videoPreviewRef = useRef<VideoPreviewRef>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [filters, setFilters] = useState("none");
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      setTrimStart(0);
      setTrimEnd(0);
      setFilters("none");
      setTextOverlays([]);
      toast.success("Video uploaded successfully!");
    } else {
      toast.error("Please upload a valid video file");
    }
  };

  const handleLoadedMetadata = (videoDuration: number) => {
    setDuration(videoDuration);
    setTrimEnd(videoDuration);
  };

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    videoPreviewRef.current?.seek(time);
  };

  const handleSkipBackward = () => {
    const newTime = Math.max(0, currentTime - 5);
    handleSeek(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 5);
    handleSeek(newTime);
  };

  const handleAddTextOverlay = (text: string, fontSize: number, color: string) => {
    const newOverlay: TextOverlay = {
      id: `text-${Date.now()}`,
      text,
      x: 0.5,
      y: 0.5,
      fontSize,
      color,
      startTime: currentTime,
      endTime: Math.min(currentTime + 5, duration),
    };
    setTextOverlays([...textOverlays, newOverlay]);
    toast.success("Text overlay added!");
  };

  const handleExport = async () => {
    if (!videoFile) {
      toast.error("No video to export");
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    
    try {
      toast.info("Starting export...", {
        description: "This may take a few moments",
      });

      const blob = await exportVideo({
        videoFile,
        trimStart,
        trimEnd,
        filters,
        textOverlays,
        onProgress: (progress) => {
          setExportProgress(progress);
        },
      });

      // Download the exported video
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edited-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Video exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export video", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            VideoFlow
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <label htmlFor="video-upload">
            <Button variant="secondary" className="gap-2" asChild>
              <span>
                <Upload className="w-4 h-4" />
                Import Video
              </span>
            </Button>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          
          <Button 
            variant="default" 
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={handleExport}
            disabled={!videoFile || isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting {exportProgress.toFixed(0)}%
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-80 bg-card border-r border-border overflow-y-auto">
          <ToolsPanel 
            onAddTextOverlay={handleAddTextOverlay}
            onApplyFilter={setFilters}
            currentFilter={filters}
            currentTime={currentTime}
          />
        </aside>

        {/* Center - Preview */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6 bg-background">
            <VideoPreview 
              ref={videoPreviewRef}
              videoFile={videoFile} 
              isPlaying={isPlaying}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
              onLoadedMetadata={handleLoadedMetadata}
              filters={filters}
              textOverlays={textOverlays}
            />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 py-4 bg-card border-t border-border">
            <Button 
              variant="secondary" 
              size="icon"
              onClick={handleSkipBackward}
              disabled={!videoFile}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="default" 
              size="icon"
              className="w-12 h-12 bg-primary hover:bg-primary/90"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!videoFile}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
            
            <Button 
              variant="secondary" 
              size="icon"
              onClick={handleSkipForward}
              disabled={!videoFile}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Timeline */}
          <div className="h-64 bg-card border-t border-border">
            <Timeline 
              duration={duration}
              currentTime={currentTime}
              onSeek={handleSeek}
              trimStart={trimStart}
              trimEnd={trimEnd}
              onTrimChange={(start, end) => {
                setTrimStart(start);
                setTrimEnd(end);
              }}
              textOverlays={textOverlays}
            />
          </div>
        </main>
      </div>
    </div>
  );
};
