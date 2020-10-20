export const megsFromGigs = (gigs: number): number => gigs * 1024;
export const range = (start: number, stopInclusive: number): number[] =>
  Array.from(Array(stopInclusive - start + 1).keys()).map((s) => s + start);

// https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html#fargate-tasks-size
export type FargateSpecsTable = Array<{ cpu: number; memory: number[] }>;
const publishedFargateSpecs: FargateSpecsTable = [
  { cpu: 256, memory: [512, megsFromGigs(1), megsFromGigs(2)] },
  { cpu: 512, memory: range(1, 4).map(megsFromGigs) },
  { cpu: 1024, memory: range(2, 8).map(megsFromGigs) },
  { cpu: 2048, memory: range(4, 16).map(megsFromGigs) },
  { cpu: 4092, memory: range(8, 32).map(megsFromGigs) },
];

export interface FargateSpec {
  cpu: number;
  memory: number;
}

export function findSmallestFargateSpec(specsTable: FargateSpecsTable, cpu: number, memory: number): FargateSpec {
  for (const spec of specsTable) {
    if (cpu > spec.cpu) continue;

    for (const specMemory of spec.memory) {
      if (memory > specMemory) continue;

      return {
        cpu: spec.cpu,
        memory: specMemory,
      };
    }
  }

  throw new Error('No Fargate specs fit the request');
}

export function findSmallestPublishedFargateSpec(cpu: number, memory: number): FargateSpec {
  return findSmallestFargateSpec(publishedFargateSpecs, cpu, memory);
}
