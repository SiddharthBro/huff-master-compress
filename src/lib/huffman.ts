// Huffman Tree Node
class HuffmanNode {
  char: string | null;
  frequency: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;

  constructor(char: string | null, frequency: number) {
    this.char = char;
    this.frequency = frequency;
    this.left = null;
    this.right = null;
  }
}

// Priority Queue for Huffman algorithm
class PriorityQueue {
  private heap: HuffmanNode[];

  constructor() {
    this.heap = [];
  }

  enqueue(node: HuffmanNode): void {
    this.heap.push(node);
    this.heapifyUp();
  }

  dequeue(): HuffmanNode | null {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop()!;

    const min = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown();
    return min;
  }

  size(): number {
    return this.heap.length;
  }

  private heapifyUp(): void {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].frequency <= this.heap[index].frequency) break;
      [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
      index = parentIndex;
    }
  }

  private heapifyDown(): void {
    let index = 0;
    while (this.leftChild(index) < this.heap.length) {
      const leftIndex = this.leftChild(index);
      const rightIndex = this.rightChild(index);
      let smallerIndex = leftIndex;

      if (rightIndex < this.heap.length && 
          this.heap[rightIndex].frequency < this.heap[leftIndex].frequency) {
        smallerIndex = rightIndex;
      }

      if (this.heap[index].frequency <= this.heap[smallerIndex].frequency) break;
      [this.heap[index], this.heap[smallerIndex]] = [this.heap[smallerIndex], this.heap[index]];
      index = smallerIndex;
    }
  }

  private leftChild(index: number): number {
    return 2 * index + 1;
  }

  private rightChild(index: number): number {
    return 2 * index + 2;
  }
}

// Main Huffman Coding class
export class HuffmanCoding {
  private root: HuffmanNode | null = null;
  private codes: Map<string, string> = new Map();

  // Build frequency table
  private buildFrequencyTable(text: string): Map<string, number> {
    const frequency = new Map<string, number>();
    for (const char of text) {
      frequency.set(char, (frequency.get(char) || 0) + 1);
    }
    return frequency;
  }

  // Build Huffman Tree using greedy algorithm
  private buildHuffmanTree(frequency: Map<string, number>): HuffmanNode | null {
    const pq = new PriorityQueue();

    // Create leaf nodes and add to priority queue
    for (const [char, freq] of frequency) {
      pq.enqueue(new HuffmanNode(char, freq));
    }

    // Special case: single character
    if (pq.size() === 1) {
      const node = pq.dequeue()!;
      const root = new HuffmanNode(null, node.frequency);
      root.left = node;
      return root;
    }

    // Build tree bottom-up using greedy approach
    while (pq.size() > 1) {
      const left = pq.dequeue()!;
      const right = pq.dequeue()!;
      
      const merged = new HuffmanNode(null, left.frequency + right.frequency);
      merged.left = left;
      merged.right = right;
      
      pq.enqueue(merged);
    }

    return pq.dequeue();
  }

  // Generate codes from tree
  private generateCodes(node: HuffmanNode | null, code: string = '', codes: Map<string, string>): void {
    if (!node) return;

    // Leaf node
    if (node.char !== null) {
      codes.set(node.char, code || '0'); // Handle single character case
      return;
    }

    this.generateCodes(node.left, code + '0', codes);
    this.generateCodes(node.right, code + '1', codes);
  }

  // Compress text
  compress(text: string): { compressed: string; codes: Map<string, string>; originalSize: number; compressedSize: number } {
    if (!text) {
      return { compressed: '', codes: new Map(), originalSize: 0, compressedSize: 0 };
    }

    const frequency = this.buildFrequencyTable(text);
    this.root = this.buildHuffmanTree(frequency);
    this.codes.clear();
    
    this.generateCodes(this.root, '', this.codes);

    let compressed = '';
    for (const char of text) {
      compressed += this.codes.get(char) || '';
    }

    const originalSize = text.length * 8; // 8 bits per character
    const compressedSize = compressed.length;

    return {
      compressed,
      codes: new Map(this.codes),
      originalSize,
      compressedSize
    };
  }

  // Decompress text
  decompress(compressed: string, root: HuffmanNode): string {
    if (!compressed || !root) return '';

    let result = '';
    let current = root;

    for (const bit of compressed) {
      if (bit === '0') {
        current = current.left!;
      } else {
        current = current.right!;
      }

      // Leaf node reached
      if (current.char !== null) {
        result += current.char;
        current = root;
      }
    }

    return result;
  }

  // Convert binary string to base64 for storage
  static binaryToBase64(binary: string): string {
    // Pad binary to multiple of 8
    const padding = 8 - (binary.length % 8);
    const paddedBinary = binary + '0'.repeat(padding % 8);
    
    let result = '';
    for (let i = 0; i < paddedBinary.length; i += 8) {
      const byte = paddedBinary.substr(i, 8);
      const charCode = parseInt(byte, 2);
      result += String.fromCharCode(charCode);
    }
    
    return btoa(result);
  }

  // Convert base64 back to binary
  static base64ToBinary(base64: string, originalLength: number): string {
    const binary = atob(base64);
    let result = '';
    
    for (let i = 0; i < binary.length; i++) {
      const byte = binary.charCodeAt(i).toString(2).padStart(8, '0');
      result += byte;
    }
    
    return result.substr(0, originalLength);
  }
}

export interface CompressionResult {
  compressed: string;
  codes: [string, string][];
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  savings: number;
}

export function compressFile(content: string): CompressionResult {
  const huffman = new HuffmanCoding();
  const result = huffman.compress(content);
  
  const compressionRatio = result.originalSize > 0 ? (result.compressedSize / result.originalSize) : 0;
  const savings = result.originalSize > 0 ? ((result.originalSize - result.compressedSize) / result.originalSize * 100) : 0;

  return {
    compressed: HuffmanCoding.binaryToBase64(result.compressed),
    codes: Array.from(result.codes.entries()),
    originalSize: result.originalSize,
    compressedSize: result.compressedSize,
    compressionRatio,
    savings
  };
}