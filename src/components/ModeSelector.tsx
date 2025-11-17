import { ConversionMode } from '../types';

interface ModeSelectorProps {
  selectedMode: ConversionMode;
  onModeChange: (mode: ConversionMode) => void;
}

export default function ModeSelector({ selectedMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={() => onModeChange('json-to-toon')}
        className={`
          px-8 py-4 rounded-lg font-semibold text-lg transition-all
          ${selectedMode === 'json-to-toon'
            ? 'bg-blue-600 text-white shadow-lg scale-105'
            : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
          }
        `}
      >
        JSON → TOON
      </button>
      <button
        onClick={() => onModeChange('toon-to-json')}
        className={`
          px-8 py-4 rounded-lg font-semibold text-lg transition-all
          ${selectedMode === 'toon-to-json'
            ? 'bg-blue-600 text-white shadow-lg scale-105'
            : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
          }
        `}
      >
        TOON → JSON
      </button>
    </div>
  );
}
