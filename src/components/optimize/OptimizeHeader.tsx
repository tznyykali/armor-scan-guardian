import { Smartphone } from 'lucide-react';

const OptimizeHeader = () => {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <Smartphone className="w-8 h-8 text-safe-DEFAULT" />
      <h2 className="text-2xl font-semibold">Android Optimizer</h2>
    </div>
  );
};

export default OptimizeHeader;