export default function baseTemplate(): string {
  /* eslint-disable */
  return `
export function widthFor(text, fontSize) {
	if (typeof text !== "string") return 0;
	
	return Math.ceil(multiplier(text) * fontSize);
}

export function fitTo(text, width) {
	if (typeof text !== "string") return 0;
	
	return Math.floor(width / multiplier(text));
}

export function cutTo(text, fontSize, width, postfix) {
  if (typeof text !== "string" || width < 1) return postfix;
  
  var widthByLength = [];

  function widthFor(text) {
    var result = 0, i = 0;
    
    for (; i < text.length; i++) {
      result += getPercent(text.charCodeAt(i));
      widthByLength.push(Math.ceil(result * fontSize))
    }
    
    return widthByLength[widthByLength.length - 1];
  }
  
  // compute width, if width more than expected continue with binary search
  if (widthFor(text, fontSize) <= width) return text;

  // rest width don't know about ceiling in widthFor, so it subtracts 1px 
  var restWidth = width - (postfix ? widthFor(text, fontSize) : 0) - 1;
  var i = 0;
  var j = text.length - 1;

  while (j - i > 1) {
    var mid = i + (((j - i) / 2) | 0);
    var computed = widthByLength[mid];
    
    if (computed > restWidth) {
      j = mid;
    } else {
      i = mid;
    }
  }
  
  return text.slice(0, j) + postfix;
}
`;
/* eslint-enable */
}
