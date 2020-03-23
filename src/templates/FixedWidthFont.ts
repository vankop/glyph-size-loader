import baseTemplate from './Base';

export default function fixedWidthFontTemplate(percent: number): string {
  /* eslint-disable */
  return `
  function getPercent() {return ${percent};}

  function multiplier(text) { return text.length * getPercent(); }
${baseTemplate()}`;
  /* eslint-enable */
}
