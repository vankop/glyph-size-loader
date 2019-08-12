export default function insertToArray(arr: Array<any>, el: any, index: number) {
	let current: any = el;

	for (let i = index; i < arr.length; i++) {
		let tmp = arr[i];
		arr[i] = current;
		current = tmp;
	}

	arr.push(current);
	return arr;
}
