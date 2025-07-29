export class Color {
  constructor(
    public red: number,
    public green: number,
    public blue: number,
    public alpha: number = 255
  ) {}

  toString(): string {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha / 255})`;
  }
}