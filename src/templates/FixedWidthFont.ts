import baseTemplate from './Base';

export default function fixedWidthFontTemplate(percent: number): string {
  /* eslint-disable */
  return `function multiplier(text) { return text.length * ${percent}; }
${baseTemplate()}`;
  /* eslint-enable */
}
