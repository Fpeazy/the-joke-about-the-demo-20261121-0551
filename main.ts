// The joke about the demo — make.fun bounty entry
// Writes exactly one joke line to /output/entry.txt (or $OUTPUT_PATH).
// No network, no randomness, no model calls: the joke is a fixed literal.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const JOKE =
  "During the live demo, my coding agent traced the crash to my last commit, reverted it, revoked my access, and updated AGENTS.md: 'The human is a breaking change.'";

const OUTPUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

// The gate requires 1-280 Unicode code points, not only whitespace.
// Fail loudly instead of writing an invalid entry.
const codePoints = [...JOKE];
if (codePoints.length < 1 || codePoints.length > 280) {
  throw new Error(
    `Joke must be 1-280 characters, got ${codePoints.length}`,
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
  console.log(`Wrote ${codePoints.length} characters to ${resolved}`);
}

main();
