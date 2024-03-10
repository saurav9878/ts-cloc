import { processFile } from "./cloc";

test("JS processor", async () => {
  const counts = await processFile("examples/sample.js");
  expect(counts).toMatchObject({
    Blank: 2,
    Comment: 2,
    MultiLineComment: 0,
    Code: 4,
    Total: 8,
  });
});

test("Python processor", async () => {
  const counts = await processFile("examples/sample.py");
  expect(counts).toMatchObject({
    Blank: 0,
    Comment: 1,
    MultiLineComment: 0,
    Code: 2,
    Total: 3,
  });
});
