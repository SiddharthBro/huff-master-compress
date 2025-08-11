import { useCallback, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (content: string, filename: string) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileRead = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelect(content, file.name);
      setSelectedFile(file.name);
    };
    reader.readAsText(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileRead(files[0]);
    }
  }, [handleFileRead, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileRead(files[0]);
    }
  }, [handleFileRead, disabled]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return (
    <Card 
      className={cn(
        "relative p-8 border-2 border-dashed transition-all duration-300",
        isDragOver && !disabled ? "border-primary bg-primary/5 scale-105" : "border-border",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50",
        "bg-card/50 backdrop-blur-sm"
      )}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
    >
      <input
        type="file"
        accept=".txt,.md,.json,.csv,.log"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        {selectedFile ? (
          <>
            <div className="flex items-center space-x-2 text-success">
              <File className="h-8 w-8" />
              <span className="font-medium">{selectedFile}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="h-6 w-6 p-0 hover:bg-destructive/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              File loaded successfully. Ready for compression.
            </p>
          </>
        ) : (
          <>
            <div className={cn(
              "p-4 rounded-full transition-colors",
              isDragOver && !disabled ? "bg-primary/20" : "bg-muted"
            )}>
              <Upload className={cn(
                "h-8 w-8 transition-colors",
                isDragOver && !disabled ? "text-primary" : "text-muted-foreground"
              )} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload File to Compress</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: .txt, .md, .json, .csv, .log (text files only)
              </p>
            </div>
            <Button variant="outline" disabled={disabled}>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}