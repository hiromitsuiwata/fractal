export class Complex {
  re: number;
  im: number;

  constructor(re: number, im: number) {
    this.re = re;
    this.im = im;
  }

  clone(): Complex {
    return new Complex(this.re, this.im);
  }

  multiply(other: Complex): Complex {
    return new Complex(
      this.re * other.re - this.im * other.im,
      this.re * other.im + this.im * other.re
    );
  }

  add(other: Complex): Complex {
    return new Complex(this.re + other.re, this.im + other.im);
  }

  substract(other: Complex): Complex {
    return new Complex(this.re - other.re, this.im - other.im);
  }

  divide(other: Complex): Complex {
    const denominator = other.re * other.re + other.im * other.im;
    return new Complex(
      (this.re * other.re + this.im * other.im) / denominator,
      (this.im * other.re - this.re * other.im) / denominator
    );
  }

  power(n: number): Complex {
    let result = new Complex(1, 0);
    for (let i = 0; i < n; i++) {
      result = result.multiply(this);
    }
    return result;
  }

  distance2(other: Complex): number {
    const dr = this.re - other.re;
    const di = this.im - other.im;
    return dr * dr + di * di;
  }

  abs(): number {
    return Math.sqrt(this.re * this.re + this.im * this.im);
  }
}