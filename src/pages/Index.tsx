import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { CompressionStats } from '@/components/CompressionStats';
import { CompressionControls } from '@/components/CompressionControls';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { compressFile, CompressionResult } from '@/lib/huffman';
import { Zap, TreePine, Target, Code } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFileSelect = (content: string, fileName: string) => {
    setFileContent(content);
    setFilename(fileName);
    setCompressionResult(null);
    toast({
      title: "File loaded successfully",
      description: `${fileName} is ready for compression`,
    });
  };

  const handleCompress = async () => {
    if (!fileContent) return;

    setIsCompressing(true);
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = compressFile(fileContent);
      setCompressionResult(result);
      
      toast({
        title: "Compression complete!",
        description: `Achieved ${result.savings.toFixed(1)}% compression ratio`,
      });
    } catch (error) {
      toast({
        title: "Compression failed",
        description: "An error occurred during compression",
        variant: "destructive",
      });
    } finally {
      setIsCompressing(false);
    }
  };

  const handleReset = () => {
    setFileContent(null);
    setFilename(null);
    setCompressionResult(null);
    setIsCompressing(false);
    toast({
      title: "Reset complete",
      description: "Ready for a new file",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-primary to-accent rounded-full mr-4">
              <TreePine className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Huffman Compression Tool
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Advanced file compression using Huffman Tree and greedy algorithm for optimized encoding.
            Reduce file size significantly while maintaining complete data integrity.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="secondary" className="px-3 py-1">
              <Zap className="h-3 w-3 mr-1" />
              Greedy Algorithm
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <TreePine className="h-3 w-3 mr-1" />
              Huffman Tree
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Target className="h-3 w-3 mr-1" />
              Optimized Encoding
            </Badge>
            <Badge variant="secondary" className="px-3 py-1">
              <Code className="h-3 w-3 mr-1" />
              Modular Design
            </Badge>
          </div>
        </div>

        {/* Algorithm Info */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-card/50 to-secondary/30 backdrop-blur-sm border-primary/20">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <TreePine className="h-6 w-6 mr-2 text-primary" />
            How Huffman Coding Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-semibold text-primary">1. Frequency Analysis</h3>
              <p className="text-muted-foreground">
                Calculate the frequency of each character in the input file to determine optimal encoding priorities.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-accent">2. Tree Construction</h3>
              <p className="text-muted-foreground">
                Build a binary tree using a greedy approach, always combining the two nodes with lowest frequencies.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-success">3. Optimal Encoding</h3>
              <p className="text-muted-foreground">
                Generate variable-length codes where frequent characters get shorter codes, maximizing compression.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Zap className="h-6 w-6 mr-2 text-primary" />
                Upload & Compress
              </h2>
              <FileUpload onFileSelect={handleFileSelect} disabled={isCompressing} />
            </div>
            
            <CompressionControls
              content={fileContent}
              filename={filename}
              result={compressionResult}
              onCompress={handleCompress}
              onReset={handleReset}
              isCompressing={isCompressing}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Target className="h-6 w-6 mr-2 text-success" />
                Compression Results
              </h2>
              <CompressionStats result={compressionResult} isCompressing={isCompressing} />
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Footer */}
        <Card className="p-6 bg-card/30 backdrop-blur-sm border-accent/20">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2 flex items-center justify-center">
              <Code className="h-5 w-5 mr-2 text-accent" />
              Technical Features
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="space-y-1">
                <div className="font-medium text-primary">Data Integrity</div>
                <div className="text-muted-foreground">Lossless compression preserves original data perfectly</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-accent">Modular Code</div>
                <div className="text-muted-foreground">Reusable components for easy integration</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-success">Optimal Performance</div>
                <div className="text-muted-foreground">O(n log n) time complexity for tree construction</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium text-warning">File Support</div>
                <div className="text-muted-foreground">Text files, JSON, CSV, logs, and more</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;