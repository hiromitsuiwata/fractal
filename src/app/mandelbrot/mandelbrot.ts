import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Paint } from '../util/paint';
import { Complex } from '../util/complex';
import { Color } from '../util/color';

@Component({
  selector: 'app-mandelbrot',
  imports: [],
  templateUrl: './mandelbrot.html',
  styleUrl: './mandelbrot.css'
})
export class Mandelbrot implements OnInit, AfterViewInit {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  paint: Paint | null = null;

  readonly pixelWidth = 1500;
  readonly pixelHeight = 900;
  readonly complexWidth = 5;
  readonly complexHeight = 3;
  readonly maxIterations = 100;
  readonly maxZ = 5;

  constructor() {
    // Initialization logic can go here if needed
  }
  ngOnInit() {
    console.log('App initialized');
  }

  ngAfterViewInit(): void {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;    
    this.paint = new Paint(this.pixelWidth, this.pixelHeight, this.complexWidth, this.complexHeight, canvas);
  }

  draw() {
    if (!this.paint) {
      console.error('Paint object is not initialized');
      return;
    }

    for (let y = 0; y < this.pixelHeight; y++) {
      for (let x = 0; x < this.pixelWidth; x++) {
        const c = this.paint.pixelToComplex(x, y);
        let z = new Complex(0, 0);
        let color: Color = new Color(0, 0, 0); // 閾値を超えなかった場合の色は黒
        for (let i = 0; i < this.maxIterations; i++) {
          z = this.f(z, c);
          // 閾値を超えた場合、何回目で超えたかで色を上書き
          if (z.abs() > this.maxZ) {
            color = new Color(
              0,
              0,
              Math.floor((i / this.maxIterations) * 155) + 100,
              255
            );
            break;
          }
        }
        // ピクセルに色を設定
        this.paint.dot(x, y, color);
      }
    }

    // canvasを更新
    this.paint.updateCanvas();
  }

  /**
   * z^2 + c
   * @param z 
   * @param c 
   * @returns 
   */
  f(z: Complex, c: Complex): Complex {
    return z.multiply(z).add(c);
  }
}
