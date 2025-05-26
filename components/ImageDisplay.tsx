import React from 'react';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isEmpty?: boolean; // To show "waiting" state specifically for processed image
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isEmpty }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-slate-700/50 rounded-xl shadow-lg h-full min-h-[200px] sm:min-h-[300px] md:min-h-[350px]">
      <h3 className="text-lg font-semibold text-slate-300 mb-3">{title}</h3>
      <div className="flex-grow flex items-center justify-center w-full aspect-square max-h-[calc(100%-2rem)] rounded-md overflow-hidden bg-slate-800/50 border border-slate-600">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <div className="text-center text-slate-500 p-4">
            {isEmpty ? (
              <>
                <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-2 text-sm">A imagem processada aparecerá aqui.</p>
              </>
            ) : (
              <p className="text-sm">
                {title.toLowerCase().includes('original') ? 'Envie uma imagem para vê-la aqui.' : 'Nenhuma imagem processada ainda.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
