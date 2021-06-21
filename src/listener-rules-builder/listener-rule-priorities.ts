/**
 * Listener rule priorities
 */
export abstract class ListenerRulePriorities {
  static incremental(start: number, step: number = 1): ListenerRulePriorities {
    return new Incremental(start, step);
  }

  /**
   * Produce a listener rule priority
   */
  public abstract produce(): number;
}

/**
 * Produces priorities starting at a number and increasing by a step size
 */
class Incremental extends ListenerRulePriorities {
  private currentValue: number;
  private readonly step: number;

  constructor(start: number, step: number) {
    super();
    this.currentValue = start;
    this.step = step;
  }

  produce(): number {
    const val = this.currentValue;
    this.currentValue += this.step;
    return val;
  }
}