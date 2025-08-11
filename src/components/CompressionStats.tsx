import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Package, TrendingDown, Zap } from 'lucide-react';
import { CompressionResult } from '@/lib/huffman';

interface CompressionStatsProps {
  result: CompressionResult | null;
  isCompressing?: boolean;
}

export function CompressionStats({ result, isCompressing }: CompressionStatsProps) {
  if (!result && !isCompressing) return null;

  const formatBytes = (bits: number) => {
    const bytes = bits / 8;
    if (bytes < 1024) return `${bytes.toFixed(1)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isCompressing) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="h-5 w-5 text-primary animate-pulse" />
          <h3 className="text-lg font-semibold">Compressing...</h3>
        </div>
        <Progress value={75} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">
          Building Huffman tree and encoding data...
        </p>
      </Card>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-r from-success/10 to-accent/10 border-success/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Package className="h-5 w-5 mr-2 text-success" />
            Compression Complete
          </h3>
          <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
            {result.savings.toFixed(1)}% Saved
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <FileText className="h-4 w-4 mr-1" />
              Original Size
            </div>
            <div className="text-xl font-bold">{formatBytes(result.originalSize)}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Package className="h-4 w-4 mr-1" />
              Compressed Size
            </div>
            <div className="text-xl font-bold text-success">{formatBytes(result.compressedSize)}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 mr-1" />
              Compression Ratio
            </div>
            <div className="text-xl font-bold text-accent">{result.compressionRatio.toFixed(3)}:1</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Compression Progress</span>
            <span>{result.savings.toFixed(1)}%</span>
          </div>
          <Progress value={result.savings} className="w-full h-2" />
        </div>
      </Card>

      <Card className="p-4 bg-card/30 backdrop-blur-sm">
        <h4 className="font-semibold mb-3 flex items-center">
          <Zap className="h-4 w-4 mr-2 text-primary" />
          Huffman Codes Generated
        </h4>
        <div className="max-h-32 overflow-y-auto space-y-1">
          {result.codes.slice(0, 10).map(([char, code], index) => (
            <div key={index} className="flex justify-between text-sm font-mono bg-muted/50 px-2 py-1 rounded">
              <span className="text-foreground">
                '{char === ' ' ? '␣' : char === '\n' ? '\\n' : char === '\t' ? '\\t' : char}'
              </span>
              <span className="text-primary">{code}</span>
            </div>
          ))}
          {result.codes.length > 10 && (
            <div className="text-xs text-muted-foreground text-center py-1">
              ... and {result.codes.length - 10} more codes
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}