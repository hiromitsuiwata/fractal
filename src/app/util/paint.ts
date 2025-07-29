import { Color } from "./color";
import { Complex } from "./complex";

export class Paint {

  ctx: CanvasRenderingContext2D | null = null;
  imageData: ImageData | null = null;

  constructor (
    public pixelWidth: number,
    public pixelHeight: number,
    public complexWidth: number,
    public complexHeight: number,
    public canvas: HTMLCanvasElement,
  ) {
    this.canvas.width = this.pixelWidth;
    this.canvas.height = this.pixelHeight;
    this.ctx = this.canvas.getContext('2d');
    
    if (!this.ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    this.imageData = this.ctx.createImageData(this.pixelWidth, this.pixelHeight);
  }


  /**
   * Convert pixel coordinates to complex plane coordinates.
   * @param x 
   * @param y 
   * @returns 
   */
  pixelToComplex(x: number, y: number): Complex {
    const re = (x - this.pixelWidth / 2) / (this.pixelWidth) * this.complexWidth;
    const im = (this.pixelHeight / 2 - y) / (this.pixelHeight) * this.complexHeight;
    return new Complex(re, im);
  }

  /**
   * Draw a pixel at (x, y) with the specified color.
   * @param x - The x-coordinate of the pixel.
   * @param y - The y-coordinate of the pixel.
   * @param color - The color to draw the pixel with.
   */
  dot(x: number, y: number, color: Color) {
    const base = (y * this.pixelWidth + x) * 4;
    this.imageData!.data[base] = color.red;
    this.imageData!.data[base + 1] = color.green;
    this.imageData!.data[base + 2] = color.blue;
    this.imageData!.data[base + 3] = color.alpha;
  }

  updateCanvas() {
    if (!this.ctx || !this.imageData) {
      console.error('Canvas context or image data is not available');
      return;
    }
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}