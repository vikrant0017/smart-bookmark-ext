export function dedent(
  strings: TemplateStringsArray,
  // eslint-disable-next-line
  ...values: any[]
): string {
  let str = "";
  strings.forEach((s, i) => {
    const val = values[i] == undefined ? "" : values[i];
    str += s + val;
  });

  return str
    .trim()
    .split("\n")
    .map((line) => line.trimStart())
    .join("\n");
}
