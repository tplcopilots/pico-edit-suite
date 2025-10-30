import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Scissors, 
  Type, 
  Sparkles, 
  Music, 
  Palette,
  Wand2
} from "lucide-react";

export const ToolsPanel = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Tools</h2>
      </div>

      <Tabs defaultValue="effects" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 w-full rounded-none border-b border-border bg-transparent">
          <TabsTrigger value="effects" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="text" className="gap-2">
            <Type className="w-4 h-4" />
            Text
          </TabsTrigger>
          <TabsTrigger value="audio" className="gap-2">
            <Music className="w-4 h-4" />
            Audio
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="effects" className="p-4 space-y-4 mt-0">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-foreground">Video Effects</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Blur', 'Sharpen', 'Vintage', 'Fade', 'Glow', 'Zoom'].map((effect) => (
                  <Card 
                    key={effect}
                    className="p-3 bg-secondary/50 hover:bg-secondary border-border hover:border-primary/50 transition-all cursor-pointer group"
                  >
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded mb-2 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                      <Wand2 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xs font-medium text-center text-foreground">{effect}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3 text-foreground">Transitions</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Fade', 'Slide', 'Zoom', 'Dissolve'].map((transition) => (
                  <Card 
                    key={transition}
                    className="p-3 bg-secondary/50 hover:bg-secondary border-border hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="h-12 bg-gradient-to-r from-primary/20 to-transparent rounded mb-2"></div>
                    <p className="text-xs font-medium text-center text-foreground">{transition}</p>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="text" className="p-4 space-y-4 mt-0">
            <div className="space-y-3">
              <div>
                <Label htmlFor="text-content" className="text-foreground">Text Content</Label>
                <Input 
                  id="text-content"
                  placeholder="Enter your text..."
                  className="mt-1.5 bg-secondary border-border focus:border-primary"
                />
              </div>

              <div>
                <Label htmlFor="font-size" className="text-foreground">Font Size</Label>
                <Slider
                  id="font-size"
                  defaultValue={[32]}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-foreground mb-2 block">Text Styles</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Bold', 'Italic', 'Outline', 'Shadow'].map((style) => (
                    <Button 
                      key={style}
                      variant="secondary"
                      size="sm"
                      className="justify-start"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90">
                Add Text to Timeline
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="p-4 space-y-4 mt-0">
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start gap-2">
                <Music className="w-4 h-4" />
                Import Audio File
              </Button>

              <div>
                <Label htmlFor="volume" className="text-foreground">Volume</Label>
                <Slider
                  id="volume"
                  defaultValue={[80]}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-foreground mb-2 block">Audio Effects</Label>
                <div className="space-y-2">
                  {['Fade In', 'Fade Out', 'Echo', 'Pitch Shift'].map((effect) => (
                    <Button 
                      key={effect}
                      variant="secondary"
                      size="sm"
                      className="w-full justify-start"
                    >
                      {effect}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
