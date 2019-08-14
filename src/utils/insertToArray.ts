export default function insertToArray<T>(arr: Array<T>, el: T, index: number): Array<T> {
  if (arr.length < index || index < 0) {
    throw new Error('out of range');
  }

  let current: any = el;

  for (let i = index; i < arr.length; i++) {
    const tmp = arr[i];
    arr[i] = current;
    current = tmp;
  }

  arr.push(current);
  return arr;
}
