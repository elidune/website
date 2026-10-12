const NNBS = '\u202F';
const NBSP = '\u00A0';

/** French punctuation: narrow no-break spaces before double punctuation, no-break spaces in guillemets. */
export function frenchTypography(input: string): string {
  return input
    .replace(/«[ \t]+/g, `«${NBSP}`)
    .replace(/[ \t]+»/g, `${NBSP}»`)
    .replace(/(\d)[ \t](?=\d{3}\b)/g, `$1${NBSP}`)
    .replace(/(\d)[ \t]+%/g, `$1${NBSP}%`)
    .replace(/(\S)[ \t]+([;:!?])/g, `$1${NNBS}$2`);
}
