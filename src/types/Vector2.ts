class Vector2 {
  constructor(public x: number, public y: number) {}

  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  add(other: Vector2): Vector2 {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  selfAdd(other: Vector2): void {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other: Vector2): Vector2 {
    return new Vector2(this.x - other.x, this.y - other.y);
  }

  selfSub(other: Vector2): void {
    this.x -= other.x;
    this.y -= other.y;
  }

  mult(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  selfMul(scalar: number): void {
    this.x *= scalar;
    this.y *= scalar;
  }

  div(scalar: number): Vector2 {
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  selfDiv(scalar: number): void {
    this.x /= scalar;
    this.y /= scalar;
  }

  /**magnitude */
  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2 {
    const mag = this.mag();
    if (mag === 0) {
      return Vector2.zero();
    }
    return new Vector2(this.x / mag, this.y / mag);
  }

  dot(other: Vector2): number {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector2): number {
    return this.x * other.y - this.y * other.x;
  }

  project(other: Vector2): Vector2 {
    const mag = other.mag();
    if (mag === 0) {
      return Vector2.zero();
    }
    const scalar = this.dot(other) / (mag * mag);
    return other.normalize().mult(scalar);
  }

  angleTo(other: Vector2): number {
    const mag1 = this.mag();
    const mag2 = other.mag();
    if (mag1 === 0 || mag2 === 0) {
      return 0;
    }
    const dot = this.dot(other) / (mag1 * mag2);
    return Math.acos(Math.min(Math.max(dot, -1), 1));
  }
}

export default Vector2;
