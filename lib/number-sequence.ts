/**
 * A number sequence that increments.
 */
export class NumberSequence {
  constructor(private currentValue: number) {}

  public getNextAndIncrement(): number {
    return this.currentValue++;
  }
}
