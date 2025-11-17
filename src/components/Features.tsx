import { Shield, Zap, RefreshCw, FileCheck } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: '100% Accurate',
      description: 'Lossless conversion with complete data integrity'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant conversion for files of any size'
    },
    {
      icon: RefreshCw,
      title: 'Bidirectional',
      description: 'Convert JSON to TOON and TOON to JSON'
    },
    {
      icon: FileCheck,
      title: 'Format Validation',
      description: 'Automatic validation and error detection'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <feature.icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
