export function readAndReturnContentFile<T>(buffer: Buffer, headerParam: string[]): T[] {
	const file = buffer.toString('utf8');
	const lines = file
		.split('\n')
		.map((item: string) => item.replace(/\r/g, ''))
		.filter(Boolean);

	lines.shift();

	return lines.map((line) => {
		const column = line.split(',').filter((column) => column.trim() !== '');
		const fileData: Partial<T> = {};

		if (column.length === 0) return;

		column.forEach((value, index) => {
			const header: string = headerParam[index];
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(fileData as any)[header] = value;
		});

		return fileData;
	}).filter(Boolean) as T[];
}
