import {
  FargateSpecsTable,
  findSmallestFargateSpec,
  findSmallestPublishedFargateSpec,
  megsFromGigs,
  range,
} from '../../src/ecs-workloads/fargate-spec-finder';

it('generates a correct range value', () => {
  const gigsRange = range(1, 4).map(megsFromGigs);
  expect(gigsRange).toEqual([1024, 2048, 3072, 4096]);
});

const testSpecTable: FargateSpecsTable = [
  { cpu: 1024, memory: range(2, 8).map(megsFromGigs) },
  { cpu: 2048, memory: range(4, 16).map(megsFromGigs) },
];

describe('it selects the right specs', () => {
  it.each([
    [1, 1, { cpu: 1024, memory: 2048 }], // Finds the lowest spec
    [1, 3000, { cpu: 1024, memory: 3072 }], // Finds the next memory size up
    [1, 10000, { cpu: 2048, memory: 10240 }], // Goes up to the next cpu class
    [2048, 4096, { cpu: 2048, memory: 4096 }], // Finds exact match
    //
  ])('cpu %d memory %d => %s', (cpu, memory, expected) => {
    expect(findSmallestFargateSpec(testSpecTable, cpu, memory)).toEqual(expected);
  });
});

it('errors if too big', () => {
  expect(() => findSmallestFargateSpec(testSpecTable, 999999, 999999)).toThrow(/fit/);
});

it('finds the lowest published spec', () => {
  expect(findSmallestPublishedFargateSpec(1, 1)).toEqual({ cpu: 256, memory: 512 });
});
