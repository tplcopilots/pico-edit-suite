import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Film, Music, Type, Sparkles } from "lucide-react";

export const Timeline = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Timeline</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">00:00:00</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {/* Video Track */}
          <div className="flex items-center gap-3">
            <div className="w-12 flex items-center justify-center">
              <Film className="w-4 h-4 text-primary" />
            </div>
            <Card className="flex-1 h-16 bg-secondary/30 border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="h-full flex items-center px-3">
                <div className="h-10 bg-gradient-to-r from-primary/40 to-primary/20 rounded flex items-center justify-center px-4">
                  <span className="text-xs font-medium text-foreground">Video Track</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Audio Track */}
          <div className="flex items-center gap-3">
            <div className="w-12 flex items-center justify-center">
              <Music className="w-4 h-4 text-primary" />
            </div>
            <Card className="flex-1 h-16 bg-secondary/30 border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="h-full flex items-center px-3 text-muted-foreground text-sm">
                Add audio track...
              </div>
            </Card>
          </div>

          {/* Text Track */}
          <div className="flex items-center gap-3">
            <div className="w-12 flex items-center justify-center">
              <Type className="w-4 h-4 text-primary" />
            </div>
            <Card className="flex-1 h-16 bg-secondary/30 border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="h-full flex items-center px-3 text-muted-foreground text-sm">
                Add text overlay...
              </div>
            </Card>
          </div>

          {/* Effects Track */}
          <div className="flex items-center gap-3">
            <div className="w-12 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <Card className="flex-1 h-16 bg-secondary/30 border-border hover:border-primary/50 transition-colors cursor-pointer">
              <div className="h-full flex items-center px-3 text-muted-foreground text-sm">
                Add effects...
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
