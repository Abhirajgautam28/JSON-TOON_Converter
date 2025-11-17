import { useState } from 'react';
import { ArrowRight, Download, AlertCircle, CheckCircle } from 'lucide-react';
import FileUploader from './FileUploader';
import { FileHandler } from '../utils/fileHandler';
import { ConversionMode, ConversionResult } from '../types';

interface ConversionPanelProps {
  mode: ConversionMode;
}

export default function ConversionPanel({ mode }: ConversionPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const fromFormat = mode === 'json-to-toon' ? 'JSON' : 'TOON';
  const toFormat = mode === 'json-to-toon' ? 'TOON' : 'JSON';

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);

    if (!FileHandler.validateFileType(selectedFile, mode)) {
      setResult({
        success: false,
        error: `Invalid file type. Please select a ${fromFormat} file.`
      });
      return;
    }

    setIsConverting(true);

    try {
      const conversionResult = await FileHandler.convertFile(selectedFile, mode);
      setResult(conversionResult);
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (result?.success && result.data && result.fileName) {
      FileHandler.downloadFile(result.data, result.fileName);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="text-center">
          <div className="inline-block px-6 py-3 bg-blue-100 text-blue-700 rounded-lg font-semibold text-lg">
            {fromFormat}
          </div>
        </div>
        <ArrowRight className="w-8 h-8 text-gray-400" />
        <div className="text-center">
          <div className="inline-block px-6 py-3 bg-green-100 text-green-700 rounded-lg font-semibold text-lg">
            {toFormat}
          </div>
        </div>
      </div>

      <FileUploader
        mode={mode}
        onFileSelect={handleFileSelect}
        disabled={isConverting}
      />

      {isConverting && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
            <span className="font-medium">Converting...</span>
          </div>
        </div>
      )}

      {result && !isConverting && (
        <div className="mt-6">
          {result.success ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">Conversion Successful!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your file has been converted to {toFormat} format.
                  </p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download {result.fileName}
              </button>

              {result.data && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap break-words font-mono">
                      {result.data.length > 2000
                        ? result.data.substring(0, 2000) + '\n\n... (truncated)'
                        : result.data}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Conversion Failed</p>
                <p className="text-sm text-red-700 mt-1">{result.error}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
