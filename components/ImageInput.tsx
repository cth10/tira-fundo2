import React, { useRef, useState } from 'react';
import { UploadIcon } from '../icons'; // Assuming icons.tsx is in ../
import { Button } from './Button';

interface ImageInputProps {
  onImageUpload: (file: File) => void;
  disabled?: boolean;
}

export const ImageInput: React.FC<ImageInputProps> = ({ onImageUpload, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onImageUpload(file);
       if(fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset file input
      }
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="imageUpload"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center w-full h-48 sm:h-64
          border-2 border-dashed rounded-xl cursor-pointer
          transition-colors duration-200 ease-in-out
          ${dragOver ? 'border-purple-500 bg-slate-700' : 'border-slate-600 hover:border-slate-500'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          <UploadIcon className={`w-10 h-10 mb-3 ${dragOver ? 'text-purple-400' : 'text-slate-400'}`} />
          <p className={`mb-2 text-sm ${dragOver ? 'text-purple-300' : 'text-slate-400'}`}>
            <span className="font-semibold">Clique para enviar</span> ou arraste e solte
          </p>
          <p className={`text-xs ${dragOver ? 'text-purple-400' : 'text-slate-500'}`}>
            PNG, JPG, GIF, WEBP (Máx. 10MB recomendado)
          </p>
        </div>
        <input
          id="imageUpload"
          type="file"
          accept="image/png, image/jpeg, image/gif, image/webp"
          className="hidden-file-input" 
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
      <Button
        onClick={handleButtonClick}
        disabled={disabled}
        className="w-full mt-4 sm:hidden bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
      >
        <UploadIcon className="w-5 h-5 mr-2" />
        Selecionar Imagem
      </Button>
    </div>
  );
};
