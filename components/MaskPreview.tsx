import React, { useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';

interface MaskPreviewProps {
  originalImageUrl: string | null;
  maskImageUrl: string | null;
  opacity: number;
  width: number;
  height: number;
}

export const MaskPreview: React.FC<MaskPreviewProps> = ({
  originalImageUrl,
  maskImageUrl,
  opacity = 0.7,
  width = 400,
  height = 300,
}) => {
  const [dimensions, setDimensions] = useState({ width, height });
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [maskImage, setMaskImage] = useState<HTMLImageElement | null>(null);
  
  useEffect(() => {
    if (originalImageUrl) {
      const img = new window.Image();
      img.src = originalImageUrl;
      img.onload = () => {
        setOriginalImage(img);
        
        // Calculate aspect ratio
        const aspectRatio = img.width / img.height;
        let newWidth = width;
        let newHeight = width / aspectRatio;
        
        if (newHeight > height) {
          newHeight = height;
          newWidth = height * aspectRatio;
        }
        
        setDimensions({ width: newWidth, height: newHeight });
      };
    } else {
      setOriginalImage(null);
    }
  }, [originalImageUrl, width, height]);
  
  useEffect(() => {
    if (maskImageUrl) {
      const img = new window.Image();
      img.src = maskImageUrl;
      img.onload = () => {
        setMaskImage(img);
      };
    } else {
      setMaskImage(null);
    }
  }, [maskImageUrl]);
  
  if (!originalImage) {
    return (
      <div 
        className="flex items-center justify-center bg-slate-800 rounded-lg"
        style={{ width, height }}
      >
        <p className="text-slate-400 text-sm">Nenhuma imagem para pré-visualizar</p>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          <KonvaImage image={originalImage} width={dimensions.width} height={dimensions.height} />
          {maskImage && (
            <KonvaImage 
              image={maskImage} 
              width={dimensions.width} 
              height={dimensions.height} 
              opacity={opacity}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}; 