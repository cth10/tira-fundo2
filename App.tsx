import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ImageInput } from './components/ImageInput';
import { ImageDisplay } from './components/ImageDisplay';
import { Button } from './components/Button';
import { Spinner } from './components/Spinner';
import { RemovalSettings } from './components/RemovalSettings';
import { MaskPreview } from './components/MaskPreview';
import { SparklesIcon, DownloadIcon, AlertIcon, EyeIcon } from './icons';
import { removeBackground } from '@imgly/background-removal';
import { BackgroundRemovalOptions } from './types';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [maskImageUrl, setMaskImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [isLibraryReady] = useState<boolean>(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [showMaskPreview, setShowMaskPreview] = useState<boolean>(false);
  const [maskOpacity, setMaskOpacity] = useState<number>(0.5);
  
  const [removalOptions, setRemovalOptions] = useState<BackgroundRemovalOptions>({
    threshold: 0.5,
    model: "isnet",
    quality: "high",
    feathering: 0
  });

  // Refs to clean up object URLs
  const originalImageUrlRef = useRef<string | null>(null);
  const processedImageUrlRef = useRef<string | null>(null);
  const maskImageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Cleanup object URLs on unmount or when they change
    return () => {
      if (originalImageUrlRef.current) URL.revokeObjectURL(originalImageUrlRef.current);
      if (processedImageUrlRef.current) URL.revokeObjectURL(processedImageUrlRef.current);
      if (maskImageUrlRef.current) URL.revokeObjectURL(maskImageUrlRef.current);
    };
  }, []);

  const handleImageUpload = (file: File) => {
    if (originalImageUrlRef.current) {
      URL.revokeObjectURL(originalImageUrlRef.current);
    }
    if (processedImageUrlRef.current) {
      URL.revokeObjectURL(processedImageUrlRef.current);
      processedImageUrlRef.current = null;
    }
    if (maskImageUrlRef.current) {
      URL.revokeObjectURL(maskImageUrlRef.current);
      maskImageUrlRef.current = null;
    }

    setOriginalImageFile(file);
    const newOriginalUrl = URL.createObjectURL(file);
    setOriginalImageUrl(newOriginalUrl);
    originalImageUrlRef.current = newOriginalUrl;
    
    setProcessedImageUrl(null);
    setMaskImageUrl(null);
    setError(null);
    setProgressMessage('');
  };

  // Generate a mask preview to help visualize what will be removed
  const generateMaskPreview = useCallback(async () => {
    if (!originalImageFile) {
      setError("Nenhuma imagem selecionada.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgressMessage('Gerando máscara de pré-visualização...');

    if (maskImageUrlRef.current) {
      URL.revokeObjectURL(maskImageUrlRef.current);
      maskImageUrlRef.current = null;
      setMaskImageUrl(null);
    }

    try {
      const config = {
        publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.6.0/dist/',
        model: removalOptions.model,
        output: { 
          format: "image/png" as const, 
          quality: removalOptions.quality === "high" ? 1.0 : 0.8,
          type: "mask" as const 
        },
        progress: (key: string, current: number, total: number) => {
          const percentage = total > 0 ? ((current / total) * 100).toFixed(0) : 0;
          let userFriendlyKey = key;
          if (key === 'resolve-static-dependencies') userFriendlyKey = 'Carregando modelo';
          if (key === 'segment') userFriendlyKey = 'Analisando imagem';
          if (key === 'postprocess') userFriendlyKey = 'Finalizando';
          setProgressMessage(`${userFriendlyKey}: ${percentage}%`);
        },
        threshold: removalOptions.threshold,
        blur: removalOptions.feathering
      };

      const maskBlob = await removeBackground(originalImageFile, config);
      const maskUrl = URL.createObjectURL(maskBlob);
      setMaskImageUrl(maskUrl);
      maskImageUrlRef.current = maskUrl;
      setShowMaskPreview(true);
      
      setProgressMessage('Pré-visualização gerada!');
    } catch (err) {
      console.error("Falha na geração da máscara:", err);
      let errorMessage = "Falha ao gerar máscara de pré-visualização.";
      if (err instanceof Error) {
        errorMessage += ` ${err.message}`;
      }
      setError(errorMessage);
      setProgressMessage('');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, removalOptions]);

  const processImage = useCallback(async () => {
    if (!originalImageFile) {
      setError("Nenhuma imagem selecionada.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgressMessage('Inicializando...');

    if (processedImageUrlRef.current) {
        URL.revokeObjectURL(processedImageUrlRef.current);
        processedImageUrlRef.current = null;
        setProcessedImageUrl(null); 
    }

    try {
      const config = {
        publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.6.0/dist/',
        model: removalOptions.model,
        output: { 
          format: "image/png" as const,
          quality: removalOptions.quality === "high" ? 1.0 : 0.8
        },
        progress: (key: string, current: number, total: number) => {
          const percentage = total > 0 ? ((current / total) * 100).toFixed(0) : 0;
          let userFriendlyKey = key;
          if (key === 'resolve-static-dependencies') userFriendlyKey = 'Carregando modelo';
          if (key === 'segment') userFriendlyKey = 'Analisando imagem';
          if (key === 'postprocess') userFriendlyKey = 'Finalizando';
          setProgressMessage(`${userFriendlyKey}: ${percentage}%`);
        },
        threshold: removalOptions.threshold,
        blur: removalOptions.feathering
      };

      const resultBlob = await removeBackground(originalImageFile, config);
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImageUrl(resultUrl);
      processedImageUrlRef.current = resultUrl;
      setProgressMessage('Fundo removido com sucesso!');
    } catch (err) {
      console.error("Falha na remoção do fundo:", err);
      let errorMessage = "Falha ao remover o fundo.";
      if (err instanceof Error) {
        errorMessage += ` ${err.message}. Isso pode ser devido à complexidade ou tamanho da imagem.`;
      }
      setError(errorMessage);
      setProgressMessage('');
    } finally {
      setIsLoading(false);
    }
  }, [originalImageFile, removalOptions]);

  const handleDownload = () => {
    if (!processedImageUrl || !originalImageFile) return;
    const link = document.createElement('a');
    link.href = processedImageUrl;
    const nameWithoutExtension = originalImageFile.name.substring(0, originalImageFile.name.lastIndexOf('.')) || originalImageFile.name;
    link.download = `${nameWithoutExtension}_no_bg.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl text-center mb-8 mt-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Removedor de Fundo com IA
        </h1>
        <p className="mt-3 text-lg text-slate-300 max-w-3xl mx-auto whitespace-pre-line">
          Estava cansada de ter que tirar o background das minhas fotos e aparecer sites pagos, que usam as fotos que enviam para treinar IA ou que cobram para baixar na resolução original. Então, como uma mera cidadã brasileira, tentei criar meu própio aplicativo para remover fundos / backgrounds. Não tem a mesma qualidade das big techs que faturam milhares com isso, mas pelo menos é de graça, as fotos que enviam são totalmente privadas e não sesão usadas para treino de IA (ou qualquer outra coisa), e, se por acaso ficar bom, você pode economizar tempo e dinheiro!
          <br /> <br />
          <span className="font-bold text-yellow-400">ATENÇÃO:</span> O processamento é feito localmente e é necessário ter um PC que aguente o tranco. Se o seu pc for muito ruim pode travar seu navegador, recomendo salvar arquivos importantes antes de continuar.
          <br /> <br />
          Chave pix para me ajudar a melhorar e manter esse e outros projetos: <span className="font-semibold text-pink-400">i@cth.jp</span>
        </p>
      </header>

      <main className="w-full max-w-5xl bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8">
        {!isLibraryReady && (
          <div className="flex items-center justify-center p-6 bg-yellow-500/10 text-yellow-300 rounded-lg mb-6 border border-yellow-500">
            <AlertIcon className="w-6 h-6 mr-3 shrink-0" />
            <span>A biblioteca de remoção de fundo está carregando. Por favor, aguarde...</span>
            <Spinner className="ml-3 w-5 h-5 text-yellow-300" />
          </div>
        )}

        <ImageInput onImageUpload={handleImageUpload} disabled={isLoading || !isLibraryReady} />

        {error && (
          <div className="mt-6 p-4 bg-red-500/20 text-red-300 rounded-lg flex items-center border border-red-500/50">
            <AlertIcon className="w-5 h-5 mr-3 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {(isLoading || progressMessage) && !error && (
          <div className="mt-6 p-4 bg-blue-500/10 text-blue-300 rounded-lg flex items-center justify-center border border-blue-500/30">
            {isLoading && <Spinner className="w-5 h-5 mr-3 text-blue-400" />}
            <span className="text-sm">{progressMessage}</span>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            variant="tertiary"
            className="text-sm"
          >
            {showAdvancedSettings ? 'Ocultar Configurações Avançadas' : 'Mostrar Configurações Avançadas'}
          </Button>
        </div>
        
        {showAdvancedSettings && (
          <div className="mt-4">
            <RemovalSettings 
              options={removalOptions} 
              onChange={setRemovalOptions} 
              disabled={isLoading}
            />
            <label htmlFor="maskOpacity" className="block text-sm font-medium text-slate-300 mt-4 mb-1">Opacidade da Máscara:</label>
            <input 
              type="range" 
              id="maskOpacity"
              min="0" max="1" 
              step="0.01" 
              value={maskOpacity}
              onChange={(e) => setMaskOpacity(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
              disabled={isLoading}
            />
          </div>
        )}
        
        {showMaskPreview && maskImageUrl && originalImageUrl && (
          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-200">Mask Preview</h3>
              <Button
                onClick={() => setShowMaskPreview(false)}
                variant="tertiary"
                className="text-sm"
              >
                Close Preview
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <MaskPreview 
                originalImageUrl={originalImageUrl}
                maskImageUrl={maskImageUrl}
                opacity={maskOpacity}
                width={400}
                height={300}
              />
              <div className="mt-4 w-full max-w-md">
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Mask Opacity: {(maskOpacity * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={maskOpacity}
                  onChange={(e) => setMaskOpacity(parseFloat(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <ImageDisplay title="Imagem Original" imageUrl={originalImageUrl} />
          <ImageDisplay title="Imagem Processada" imageUrl={processedImageUrl} isEmpty={!processedImageUrl && !!originalImageUrl && !isLoading && !error} />
        </div>

        <div className="mt-8 flex flex-wrap justify-center items-center gap-4">
          <Button
            onClick={generateMaskPreview}
            disabled={!originalImageFile || isLoading || !isLibraryReady}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            <EyeIcon className="w-5 h-5 mr-2" />
            Pré-visualizar Máscara
          </Button>
          
          <Button
            onClick={processImage}
            disabled={!originalImageFile || isLoading || !isLibraryReady}
            className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            <SparklesIcon className="w-5 h-5 mr-2" />
            Remover Fundo
          </Button>
          
          <Button
            onClick={handleDownload}
            disabled={!processedImageUrl || isLoading}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            <DownloadIcon className="w-5 h-5 mr-2" />
            Baixar Imagem Sem Fundo
          </Button>
        </div>
      </main>
      
      <footer className="w-full max-w-5xl text-center mt-12 pb-4">
        <p className="text-xs text-slate-500 mt-1">
          
        </p>
      </footer>
    </div>
  );
};

export default App;
