import { FileJson, ArrowLeftRight } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3">
          <FileJson className="w-10 h-10" />
          <ArrowLeftRight className="w-8 h-8" />
          <div className="text-3xl font-bold">TOON</div>
        </div>
        <h1 className="text-4xl font-bold text-center mb-2">
          JSON ⇄ TOON Converter
        </h1>
        <p className="text-center text-blue-100 text-lg">
          Convert between JSON and TOON formats with 100% accuracy
        </p>
      </div>
    </header>
  );
}
