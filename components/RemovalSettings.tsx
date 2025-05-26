import React from 'react';
import { BackgroundRemovalOptions } from '../types';

interface RemovalSettingsProps {
  options: BackgroundRemovalOptions;
  onChange: (options: BackgroundRemovalOptions) => void;
  disabled?: boolean;
}

export const RemovalSettings: React.FC<RemovalSettingsProps> = ({ 
  options, 
  onChange, 
  disabled = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let newValue: any = value;
    if (name === 'threshold' || name === 'feathering') {
      newValue = parseFloat(value);
    }
    
    onChange({
      ...options,
      [name]: newValue
    });
  };

  return (
    <div className="bg-slate-700 p-4 rounded-lg">
      <h3 className="text-lg font-medium text-slate-200 mb-4">Configurações Avançadas</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Modelo de IA
          </label>
          <select
            name="model"
            value={options.model}
            onChange={handleChange}
            disabled={disabled}
            className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <option value="isnet_fp16">iSNet FP16 (Rápido)</option>
            <option value="isnet">iSNet (Padrão)</option>
            <option value="isnet_quint8">iSNet Quint8 (Baixa Memória)</option>
          </select>
          <p className="mt-1 text-xs text-slate-400">
            Modelos diferentes funcionam melhor para tipos diferentes de imagens
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Qualidade: {options.quality === 'high' ? 'Alta (Mais Lento)' : 'Rápida'}
          </label>
          <select
            name="quality"
            value={options.quality}
            onChange={handleChange}
            disabled={disabled}
            className="w-full bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          >
            <option value="fast">Rápida</option>
            <option value="high">Alta (Mais Lento)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Limiar (Threshold): {options.threshold.toFixed(2)}
          </label>
          <input
            type="range"
            name="threshold"
            min="0"
            max="1"
            step="0.01"
            value={options.threshold}
            onChange={handleChange}
            disabled={disabled}
            className="w-full accent-purple-500"
          />
          <p className="mt-1 text-xs text-slate-400">
            Valores mais altos mantêm mais pixels (remoção menos agressiva)
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Suavização de Borda: {options.feathering.toFixed(1)}
          </label>
          <input
            type="range"
            name="feathering"
            min="0"
            max="10"
            step="0.1"
            value={options.feathering}
            onChange={handleChange}
            disabled={disabled}
            className="w-full accent-purple-500"
          />
          <p className="mt-1 text-xs text-slate-400">
            Valores mais altos criam bordas mais suaves
          </p>
        </div>
      </div>
    </div>
  );
}; 