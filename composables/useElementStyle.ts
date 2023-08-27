export default function (styles: { [key: string]: string }) {
	let style = "";
	for (const property in styles) {
		style += `${property}:${styles[property]};`;
	}

	return style;
}
