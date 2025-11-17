import { useState } from 'react';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import ConversionPanel from './components/ConversionPanel';
import Features from './components/Features';
import { ConversionMode } from './types';

function App() {
  const [mode, setMode] = useState<ConversionMode>('json-to-toon');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        <Features />

        <ModeSelector selectedMode={mode} onModeChange={setMode} />

        <ConversionPanel mode={mode} />

        <footer className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Built with precision for 100% accurate file conversion
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
