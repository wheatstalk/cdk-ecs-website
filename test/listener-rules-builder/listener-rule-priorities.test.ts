import { ListenerRulePriorities } from '../../src/listener-rules-builder/listener-rule-priorities';

describe('ListenerRulePriorities', () => {
  it('should start counting at the given value', () => {
    const sequence = ListenerRulePriorities.incremental(500);
    expect(sequence.produce()).toBe(500);
    expect(sequence.produce()).toBe(501);
  });
});
