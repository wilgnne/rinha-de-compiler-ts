import fs from "fs/promises";
import { run } from "./run";
import { type IFile } from "./types";

async function main(): Promise<void> {
  const filePath = process.argv.at(2);

  if (filePath === undefined) process.exit(1);
  const fileHandle = await fs.open(filePath);
  const content = await fileHandle.readFile({ encoding: "utf-8" });
  await fileHandle.close();

  const file = JSON.parse(content) as IFile;

  run(file, console.log);
}

main().catch((e) => {
  throw e;
});
