import { AfterViewInit, Component, OnInit, signal } from '@angular/core';
import { Complex } from './complex';
import { Color } from './color';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('newton');
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  imageData: ImageData | null = null;
  
  readonly pixelWidth = 600;
  readonly pixelHeight = 600;
  readonly complexWidth = 4;
  readonly complexHeight = 4;
  readonly maxIterations = 200;
  readonly tolerance = 1e-6;

  // 解析的な解
  readonly roots = [
    new Complex(1, 0), // z = 1
    new Complex(-0.5, Math.sqrt(3) / 2), // z = -1/2 + i√3/2
    new Complex(-0.5, -Math.sqrt(3) / 2) // z = -1/2 - i√3/2
  ];

  constructor() {
    // Initialization logic can go here if needed
  }
  ngOnInit() {
    console.log('App initialized');
  }

  ngAfterViewInit(): void {
    this.canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    this.canvas.width = this.pixelWidth;
    this.canvas.height = this.pixelHeight;
    this.ctx = this.canvas.getContext('2d');
    
    if (!this.ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    this.imageData = this.ctx.createImageData(this.pixelWidth, this.pixelHeight);
  }
  

  draw() {
    if (!this.ctx) {
      console.error('Canvas context is not available');
      return;
    }
    if (!this.imageData) {
      console.error('Image data is not available');
      return;
    }

    for (let y = 0; y < this.pixelHeight; y++) {
      for (let x = 0; x < this.pixelWidth; x++) {
        const root = this.newton(this.pixelToComplex(x, y));
        const color = this.decideColor(root);
        this.dot(x, y, color);
      }
    }

    // Update the canvas with the image data
    this.ctx!.putImageData(this.imageData!, 0, 0);
  }

  newton(z: Complex): Complex {

    let currentZ = z.clone();

    // ニュートン法の反復
    let i = 0;

    while (i < this.maxIterations) {
      const fz = this.f(currentZ);
      const dfz = this.df(currentZ);

      if (dfz.re === 0 && dfz.im === 0) {
        // Derivative is zero, cannot proceed
        break;
      }

      const nextZ = currentZ.substract(fz.divide(dfz));

      // fzの値が十分に小さい場合、収束したとみなす
      if (fz.substract(new Complex(0, 0)).abs() < this.tolerance) {
        break;
      }

      currentZ = nextZ;
      i++;
    }

    return currentZ;
  }

  /**
   * 数値的な解から色を決定する
   * @param z 
   * @returns 
   */
  decideColor(z: Complex): Color {
    
    // 数値解に最も近い解析解を見つける
    let closestRootIndex = 0;
    for (let i = 0; i < this.roots.length; i++) {
      let closestRoot = this.roots[closestRootIndex];
      const root = this.roots[i];
      if (z.distance2(root) < z.distance2(closestRoot)) {
        closestRootIndex = i;
      }
    }

    // 色を決定
    if (closestRootIndex === 0) {
      return new Color(255, 0, 0, 255); // Red for root z = 1
    } else if (closestRootIndex === 1) {
      return new Color(0, 255, 0, 255); // Green for root z = -1/2 + i√3/2
    } else {
      return new Color(0, 0, 255, 255); // Blue for root z = -1/2 - i√3/2
    }
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

  /**
   * z^3 - 1
   * @param z 
   * @returns 
   */
  f(z: Complex): Complex {
    return z.power(3).substract(new Complex(1, 0));
  }

  /**
   * 3z^2
   * @param z 
   * @returns 
   */
  df(z: Complex): Complex {
    return z.power(2).multiply(new Complex(3, 0));
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
}
