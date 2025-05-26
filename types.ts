// Configuration interface for the Img.ly background removal tool
export interface ImglyBackgroundRemovalConfig {
  publicPath?: string; // URL to the directory containing wasm and model files
  model?: 'small' | 'medium'; // Model size/quality
  output?: {
    type?: 'image/png' | 'image/jpeg'; // Output format
    quality?: number; // For JPEG, 0 to 1
  };
  debug?: boolean; // Enable debug logging
  progress?: ( // Callback for progress updates
    key: string,      // Stage of processing (e.g., 'load-model', 'process')
    current: number,  // Current progress value
    total: number     // Total steps for this stage
  ) => void;
}

// Augment the global Window interface to include imglyRemoveBackground
declare global {
  interface Window {
    imglyRemoveBackground?: (
      imageSrc: string | Blob | HTMLImageElement | ImageData | ArrayBuffer,
      config?: ImglyBackgroundRemovalConfig
    ) => Promise<Blob>;
  }
}

export interface BackgroundRemovalOptions {
  threshold: number;  // 0-1, higher values keep more pixels (less aggressive removal)
  model: "isnet_fp16" | "isnet" | "isnet_quint8";
  quality: "fast" | "high";
  feathering: number; // 0-10, higher values create softer edges
}

// This export ensures the file is treated as a module
export {};
