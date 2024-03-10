import fs from "fs";
import readline from "readline";

enum LineType {
  Blank = "Blank",
  Comment = "Comment",
  MultiLineComment = "MultiLineComment",
  Code = "Code",
}

interface LanguageProcessor {
  detectLine(line: string): LineType;
}

class JsProcessor implements LanguageProcessor {
  inMultiLineComment = false;

  detectLine(line: string): LineType {
    line = line.trim();
    if (line === "") {
      return LineType.Blank;
    }

    if (this.inMultiLineComment) {
      if (line.endsWith("*/")) {
        this.inMultiLineComment = false;
        return LineType.Comment;
      }
      return LineType.Comment;
    } else {
      if (line.startsWith("//")) {
        return LineType.Comment;
      }
      if (line.startsWith("/*")) {
        this.inMultiLineComment = true;
        return line.endsWith("*/") ? LineType.Comment : LineType.Code;
      }
      return LineType.Code;
    }
  }
}

class PythonProcessor implements LanguageProcessor {
  detectLine(line: string): LineType {
    line = line.trim();
    if (line === "") {
      return LineType.Blank;
    } else if (line.startsWith("#")) {
      return LineType.Comment;
    }
    return LineType.Code;
  }
}

type CounterType = LineType | "Total";

class Counter {
  counts: { [key in CounterType]: number } = {
    Blank: 0,
    Comment: 0,
    MultiLineComment: 0,
    Code: 0,
    Total: 0,
  };

  processor: LanguageProcessor;

  constructor(processor: LanguageProcessor) {
    this.processor = processor;
  }

  processLine(line: string) {
    this.counts[this.processor.detectLine(line)]++;
    this.counts.Total++;
  }

  print() {
    for (const key in this.counts) {
      console.log(`Number of ${key}: ${this.counts[key as CounterType]}`);
    }
  }
}

export async function processFile(filename: string) {
  if (!filename) {
    console.log("Please provide the filename.");
    return;
  }

  const stream = fs.createReadStream(filename);

  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });

  const extension = filename.split(".").pop();

  let processor: LanguageProcessor;
  switch (extension) {
    case "js":
      processor = new JsProcessor();
      break;
    case "py":
      processor = new PythonProcessor();
      break;
    default:
      throw new Error("file not supported yet");
  }

  const counter = new Counter(processor);

  for await (const line of rl) {
    counter.processLine(line);
  }

  counter.print();
  return counter.counts;
}

async function main() {
  const filename = process.argv[2];
  await processFile(filename);
}

main();
