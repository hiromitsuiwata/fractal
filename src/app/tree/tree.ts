import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Paint } from '../util/paint';

@Component({
  selector: 'app-tree',
  imports: [],
  templateUrl: './tree.html',
  styleUrl: './tree.css'
})
export class Tree implements OnInit, AfterViewInit {

    paint: Paint | null = null;
    
    readonly pixelWidth = 800;
    readonly pixelHeight = 800;
  
  constructor() {
    // Initialization logic can go here if needed
  }

  ngOnInit() {
    console.log('App initialized');
  }

  ngAfterViewInit(): void {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;    
    this.paint = new Paint(canvas, this.pixelWidth, this.pixelHeight);
  }

  draw(startX: number, startY: number, angle: number, length: number, depth: number) {
    if (!this.paint) {
      console.error('Paint object is not initialized');
      return;
    }

    const ctx = this.paint.getContext();
    if (!ctx) {
      console.error('Canvas context is not available');
      return;
    }

    ctx.beginPath();
    ctx.save();

    // 線の太さを深さに応じて変える
    ctx.lineWidth = 12 - depth;

    // 線の色を深さに応じて変える
    const colorValue = Math.floor((depth / 12) * 100);
    ctx.strokeStyle = `rgb(${colorValue}, ${100 + colorValue}, ${150 + colorValue})`;

    // 原点を移動
    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);

    // 線を引く
    ctx.lineTo(0, -length);
    ctx.stroke();

    // 再帰の終了条件
    if(depth > 12) {
      ctx.restore();
      return;
    }

    // 再帰的に枝を描く
    this.draw(0, -length, -15, length*0.8, depth + 1);
    this.draw(0, -length, +15, length*0.8, depth + 1);

    ctx.restore();
  }
}
