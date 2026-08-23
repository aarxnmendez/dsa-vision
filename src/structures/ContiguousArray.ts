/**
 * Pedagogical model of a contiguous array stored in memory.
 * Values live in a single block; index i maps to base + i.
 */
export class ContiguousArray {
  private readonly items: number[];

  constructor(values: number[]) {
    this.items = [...values];
  }

  get length(): number {
    return this.items.length;
  }

  toArray(): number[] {
    return [...this.items];
  }

  get(index: number): number {
    return this.items[index];
  }

  set(index: number, value: number): void {
    this.items[index] = value;
  }
}
