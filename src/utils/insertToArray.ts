export default function insertToArray(arr: Array<any>, el: any, index: number) {
	if (arr.length < index || index < 0) {
		throw new Error("out of range");
	}

	let current: any = el;

	for (let i = index; i < arr.length; i++) {
		let tmp = arr[i];
		arr[i] = current;
		current = tmp;
	}

	arr.push(current);
	return arr;
}
