# ts-cloc

ts-cloc is a Typescript based lines of code counter.

## Overview

ts-cloc can count the lines of code in a single source file. Given
an input file, it will print:

- Number of blank lines
- Number of lines with comments
- Number of lines with code
- Total number of lines in the file

```java
import java.util.*;

public class Main {
    // This is another comment line
    public static void main(String[] args) {
        System.out.println("Hello world!"); // code, not comment 11
    }
}
```

Output:

- Blank - 3
- Comments - 3
- Code - 6
- Total - 12

## Functional requirements

- Support one programming language syntax (eg: Java, C, JavaScript, etc).
- Support reading one source file and printing results.
- Types of lines you should support: Blank, Comments, Code.
- Support single-line comments (// in C-like languages).
- A line counts as a comment only if it has no other code.
- Design for extensibility: you should be able to support new language syntaxes by extending your solution.
- One passing test

## Non-functional requirements

- Support multiple syntaxes.
- Support multiple files and giving totals for an entire source tree.
- Support multi-line comments.
- Ability to add more granular breakup (eg: classify lines as imports, variable
  declarations, etc).

## Approach

- For extensibility, we can use classes
- There can be multiple files that we may want to count, they can be run as an independently (or parallely) as they're not dependent on each other.
- We can choose not to count two files in a directory if their MD5 checksum matches to avoid duplicates.
- Files can be read in few techniques

  - loading into memory in one shot -> could cause memory overflow if the file size exceeds memory
  - streaming -> a file can be read in a continous stream line by line
  - chunking -> a file can be divided into buffers and read character by character

- Counting of lines in a file is also an independent task, so we can divide file into chunks and count separately.
  - we need to take care of CLRF (for windows) vs LF (Unix) for new lines
  - counting character by character is [comparatively slow ](https://stackoverflow.com/a/1277904)

> Therefore, we'll proceed with streaming where we can read line by line every file.

## Assumptions

- There are no syntax errors in the code while counting multiline comment
