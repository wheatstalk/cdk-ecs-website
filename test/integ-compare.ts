import * as fs from 'fs-extra';
import * as jdiff from 'json-diff';
import * as yargs from 'yargs';

async function main(): Promise<void> {
  const argv = yargs.usage('Usage: integ-compare <output.json> <expected.json>')
    .argv;

  const [outputPath, expectedPath] = argv._;

  const outputJson = await fs.readJSON(outputPath.toString());
  const expectedJson = await fs.readJSON(expectedPath.toString());

  // Clean out unimportant things.
  delete outputJson.Resources.CDKMetadata;
  delete expectedJson.Resources.CDKMetadata;

  const diff = jdiff.diffString(outputJson, expectedJson);
  if (diff) {
    console.error(diff);
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});