import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Play, Pause, SkipBack, SkipForward, Download } from "lucide-react";
import { VideoPreview } from "./editor/VideoPreview";
import { Timeline } from "./editor/Timeline";
import { ToolsPanel } from "./editor/ToolsPanel";
import { toast } from "sonner";

export const VideoEditor = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
      toast.success("Video uploaded successfully!");
    } else {
      toast.error("Please upload a valid video file");
    }
  };

  const handleExport = () => {
    toast.success("Exporting video...", {
      description: "Your video is being processed",
    });
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
            disabled={!videoFile}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-80 bg-card border-r border-border overflow-y-auto">
          <ToolsPanel />
        </aside>

        {/* Center - Preview */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-6 bg-background">
            <VideoPreview videoFile={videoFile} isPlaying={isPlaying} />
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-center gap-4 py-4 bg-card border-t border-border">
            <Button variant="secondary" size="icon">
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
            
            <Button variant="secondary" size="icon">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Timeline */}
          <div className="h-64 bg-card border-t border-border">
            <Timeline />
          </div>
        </main>
      </div>
    </div>
  );
};
