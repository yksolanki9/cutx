#! /usr/bin/env node

import * as fs from "node:fs";

interface Config {
  bytePosition?: string;
  charPosition?: string;
  delimiter?: string;
  field?: string;
  file?: string;
}

const parseCommand = (argv: string[]) => {
  let args = process.argv.slice(2);

  let config: Config = {};

  while (args.length > 0) {
    if (args[0] === "-f") {
      config.field = args[1];
    } else if (args[0] === "-c") {
      config.charPosition = args[1];
    } else if (args[0] === "-b") {
      config.bytePosition = args[1];
    } else {
      config.file = args[0];
      args = args.slice(1);
      continue;
    }

    args = args.slice(2);
  }

  return config;
};

const readFile = (path: string) => {
  try {
    return fs.readFileSync(path, { encoding: "utf-8" });
  } catch (err) {
    throw new Error("Error reading input file");
  }
};

const main = () => {
  const config = parseCommand(process.argv);
  let result = "";
  if (config.file) {
    const file = readFile(config.file);
    const lineArray = file.split("\n");

    if (config.field) {
      const fieldArray = lineArray.map((line) => line.split("\t"));

      result = fieldArray
        .map((line) =>
          line.filter((_, index) => index === parseInt(config.field!) - 1)
        )
        .reduce((acc, curr) => acc + (acc !== "" ? "\n" : "") + curr, "");
    }
  }
  console.log(result);
  process.exit(0);
};

main();
