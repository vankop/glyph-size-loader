export default function decimalToFixed(num: number, numbersAfterPoint: number): number {
	const precision: number = 1 + `e+${numbersAfterPoint}` as any - 0;
	return Math.round(num * precision) / precision;
}
