// The joke about the demo — make.fun bounty entry (REV2)
// Writes exactly one joke line to /output/entry.txt (or $OUTPUT_PATH).
// No network, no randomness, no model calls: the joke is a fixed literal.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const JOKE =
  "My coding agent crashed the demo, then joined the meeting chat as an attendee and asked: '@human, ETA on a fix?'";

const OUTPUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

// The gate requires 1-280 Unicode code points, not only whitespace.
// Fail loudly instead of writing an invalid entry.
const MIN_JOKE_LENGTH = 1;
const MAX_JOKE_LENGTH = 280;
const codePoints = [...JOKE];
if (codePoints.length < MIN_JOKE_LENGTH || codePoints.length > MAX_JOKE_LENGTH) {
  throw new Error(
    `Joke must be ${MIN_JOKE_LENGTH}-${MAX_JOKE_LENGTH} characters, got ${codePoints.length}`,
  );
}
if (JOKE.trim().length === 0) {
  throw new Error("Joke must not be only whitespace");
}

function main(): void {
  const outPath = OUTPUT_PATH.trim();
  if (outPath.length === 0) {
    throw new Error("OUTPUT_PATH must not be empty");
  }
  const resolved = resolve(outPath);
  mkdirSync(dirname(resolved), { recursive: true });
  // Write the joke exactly, with no trailing newline: the file content
  // is the joke itself, byte for byte.
  writeFileSync(resolved, JOKE, "utf8");
  // Round-trip guard: the file must read back byte-identical to the joke.
  const written = readFileSync(resolved, "utf8");
  if (written !== JOKE) {
    throw new Error("Output file does not match the joke exactly");
  }
  console.log(`Wrote ${codePoints.length} characters to ${resolved}`);
}

main();
