/** Parse "*highlight*" markers into words with a highlight flag. */
export type Word = { text: string; hi: boolean };

export function words(s: string): Word[] {
  const out: Word[] = [];
  let glue = false; // previous part ended mid-word, e.g. "*heaters*."
  s.split("*").forEach((part, i) => {
    const tokens = part.split(/\s+/);
    tokens.forEach((w, j) => {
      if (!w) return;
      if (j === 0 && glue && out.length) out[out.length - 1].text += w;
      else out.push({ text: w, hi: i % 2 === 1 });
    });
    glue = part.length > 0 && !/\s$/.test(part);
  });
  return out;
}
