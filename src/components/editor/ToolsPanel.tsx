import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Type, 
  Sparkles, 
  Wand2
} from "lucide-react";
import { useState } from "react";

interface ToolsPanelProps {
  onAddTextOverlay: (text: string, fontSize: number, color: string) => void;
  onApplyFilter: (filter: string) => void;
  currentFilter: string;
  currentTime: number;
}

export const ToolsPanel = ({ onAddTextOverlay, onApplyFilter, currentFilter, currentTime }: ToolsPanelProps) => {
  const [textContent, setTextContent] = useState("");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#ffffff");

  const filters = [
    { name: "None", value: "none" },
    { name: "Grayscale", value: "grayscale(100%)" },
    { name: "Sepia", value: "sepia(100%)" },
    { name: "Blur", value: "blur(3px)" },
    { name: "Brightness", value: "brightness(150%)" },
    { name: "Contrast", value: "contrast(150%)" },
    { name: "Saturate", value: "saturate(200%)" },
    { name: "Vintage", value: "sepia(50%) contrast(120%) brightness(90%)" },
    { name: "Fade", value: "contrast(80%) brightness(110%)" },
    { name: "Cool", value: "hue-rotate(180deg) saturate(150%)" },
  ];

  const handleAddText = () => {
    if (textContent.trim()) {
      onAddTextOverlay(textContent, fontSize, textColor);
      setTextContent("");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Tools</h2>
      </div>

      <Tabs defaultValue="effects" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 w-full rounded-none border-b border-border bg-transparent">
          <TabsTrigger value="effects" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="text" className="gap-2">
            <Type className="w-4 h-4" />
            Text
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="effects" className="p-4 space-y-4 mt-0">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-foreground">Video Filters</h3>
              <div className="grid grid-cols-2 gap-2">
                {filters.map((filter) => (
                  <Card 
                    key={filter.name}
                    onClick={() => onApplyFilter(filter.value)}
                    className={`p-3 bg-secondary/50 hover:bg-secondary border-border hover:border-primary/50 transition-all cursor-pointer group ${
                      currentFilter === filter.value ? "border-primary bg-secondary" : ""
                    }`}
                  >
                    <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded mb-2 flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/10 transition-all">
                      <Wand2 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-xs font-medium text-center text-foreground">{filter.name}</p>
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
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="font-size" className="text-foreground">
                  Font Size: {fontSize}px
                </Label>
                <Slider
                  id="font-size"
                  value={[fontSize]}
                  onValueChange={(values) => setFontSize(values[0])}
                  max={120}
                  min={20}
                  step={2}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="text-color" className="text-foreground">Text Color</Label>
                <div className="flex gap-2 mt-1.5">
                  <Input
                    id="text-color"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 bg-secondary border-border"
                  />
                </div>
              </div>

              <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">
                  Text will appear at: {currentTime.toFixed(2)}s
                </p>
                <p className="text-xs text-muted-foreground">
                  Duration: 5 seconds
                </p>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleAddText}
                disabled={!textContent.trim()}
              >
                Add Text to Timeline
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
