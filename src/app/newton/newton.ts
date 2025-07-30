import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Complex } from '../util/complex';
import { Color } from '../util/color';
import { Paint } from '../util/paint';

@Component({
  selector: 'app-newton',
  imports: [],
  templateUrl: './newton.html',
  styleUrl: './newton.css'
})
export class Newton implements OnInit, AfterViewInit{

  paint: Paint | null = null;
  
  readonly pixelWidth = 1500;
  readonly pixelHeight = 1500;
  readonly complexWidth = 4;
  readonly complexHeight = 4;
  readonly maxIterations = 300;
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
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;    
    this.paint = new Paint(canvas, this.pixelWidth, this.pixelHeight, this.complexWidth, this.complexHeight);
  }
  

  draw() {
    if (!this.paint) {
      console.error('Paint object is not initialized');
      return;
    }

    for (let y = 0; y < this.pixelHeight; y++) {
      for (let x = 0; x < this.pixelWidth; x++) {
        const complexPoint = this.paint.pixelToComplex(x, y);
        const root = this.newton(complexPoint);
        const color = this.decideColor(root);
        this.paint.dot(x, y, color);
      }
    }

    // Update the canvas with the image data
    this.paint.updateCanvas();
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
}
