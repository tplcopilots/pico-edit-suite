import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;

export const loadFFmpeg = async (onProgress?: (progress: number) => void) => {
  if (ffmpegInstance) return ffmpegInstance;
  if (isLoading) {
    // Wait for loading to complete
    while (isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return ffmpegInstance;
  }

  isLoading = true;
  const ffmpeg = new FFmpeg();

  ffmpeg.on("log", ({ message }) => {
    console.log(message);
  });

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.(progress * 100);
  });

  try {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegInstance = ffmpeg;
    return ffmpeg;
  } finally {
    isLoading = false;
  }
};

export interface ExportOptions {
  videoFile: File;
  trimStart: number;
  trimEnd: number;
  filters: string;
  textOverlays: Array<{
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
    startTime: number;
    endTime: number;
  }>;
  onProgress?: (progress: number) => void;
}

export const exportVideo = async ({
  videoFile,
  trimStart,
  trimEnd,
  filters,
  textOverlays,
  onProgress,
}: ExportOptions): Promise<Blob> => {
  const ffmpeg = await loadFFmpeg(onProgress);

  // Write input file
  await ffmpeg.writeFile("input.mp4", await fetchFile(videoFile));

  // Build FFmpeg command
  const duration = trimEnd - trimStart;
  let filterComplex = "";

  // Apply visual filters
  if (filters && filters !== "none") {
    const ffmpegFilter = convertCSSFilterToFFmpeg(filters);
    filterComplex = ffmpegFilter;
  }

  // Add text overlays
  if (textOverlays.length > 0) {
    const textFilters = textOverlays.map((overlay, index) => {
      const startTime = Math.max(0, overlay.startTime - trimStart);
      const endTime = Math.min(duration, overlay.endTime - trimStart);
      
      // Convert CSS color to FFmpeg color
      const color = overlay.color.replace("#", "0x");
      
      return `drawtext=text='${overlay.text}':x=(w*${overlay.x}-text_w/2):y=(h*${overlay.y}-text_h/2):fontsize=${overlay.fontSize}:fontcolor=${color}:borderw=3:bordercolor=0x000000:enable='between(t,${startTime},${endTime})'`;
    });

    if (filterComplex) {
      filterComplex += "," + textFilters.join(",");
    } else {
      filterComplex = textFilters.join(",");
    }
  }

  // Build command
  const command = [
    "-ss", trimStart.toString(),
    "-i", "input.mp4",
    "-t", duration.toString(),
  ];

  if (filterComplex) {
    command.push("-vf", filterComplex);
  }

  command.push(
    "-c:v", "libx264",
    "-preset", "medium",
    "-crf", "23",
    "-c:a", "copy",
    "output.mp4"
  );

  await ffmpeg.exec(command);

  // Read output file
  const data = await ffmpeg.readFile("output.mp4");
  const blob = new Blob([new Uint8Array(data as Uint8Array)], { type: "video/mp4" });

  // Cleanup
  await ffmpeg.deleteFile("input.mp4");
  await ffmpeg.deleteFile("output.mp4");

  return blob;
};

const convertCSSFilterToFFmpeg = (cssFilter: string): string => {
  const filters: string[] = [];

  if (cssFilter.includes("grayscale")) {
    filters.push("hue=s=0");
  }
  if (cssFilter.includes("sepia")) {
    const match = cssFilter.match(/sepia\((\d+)%?\)/);
    const value = match ? parseInt(match[1]) / 100 : 1;
    filters.push(`colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131`);
  }
  if (cssFilter.includes("brightness")) {
    const match = cssFilter.match(/brightness\((\d+)%?\)/);
    const value = match ? parseInt(match[1]) / 100 : 1;
    filters.push(`eq=brightness=${(value - 1) * 0.5}`);
  }
  if (cssFilter.includes("contrast")) {
    const match = cssFilter.match(/contrast\((\d+)%?\)/);
    const value = match ? parseInt(match[1]) / 100 : 1;
    filters.push(`eq=contrast=${value}`);
  }
  if (cssFilter.includes("saturate")) {
    const match = cssFilter.match(/saturate\((\d+)%?\)/);
    const value = match ? parseInt(match[1]) / 100 : 1;
    filters.push(`eq=saturation=${value}`);
  }
  if (cssFilter.includes("blur")) {
    const match = cssFilter.match(/blur\((\d+)px\)/);
    const value = match ? parseInt(match[1]) : 3;
    filters.push(`boxblur=${value}:${value}`);
  }
  if (cssFilter.includes("hue-rotate")) {
    const match = cssFilter.match(/hue-rotate\((\d+)deg\)/);
    const value = match ? parseInt(match[1]) : 0;
    filters.push(`hue=h=${value}`);
  }

  return filters.join(",");
};
