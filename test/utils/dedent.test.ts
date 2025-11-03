import { describe, it, expect } from "vitest";
import { dedent } from "@/utils/dedent";

describe("dedent", () => {
  it("should remove leading whitespace from template strings", () => {
    const result = dedent`
      Hello
      World
    `;
    expect(result).toBe("Hello\nWorld");
  });

  it("should handle template strings with interpolated values", () => {
    const name = "TypeScript";
    const result = dedent`
      Hello
      ${name}
      World
    `;
    expect(result).toBe("Hello\nTypeScript\nWorld");
  });

  it("should handle single line strings", () => {
    const result = dedent`Hello World`;
    expect(result).toBe("Hello World");
  });

  it("should handle undefined values", () => {
    const value = undefined;
    const result = dedent`
      Hello
      ${value}
      World
    `;
    expect(result).toBe("Hello\n\nWorld");
  });
});
