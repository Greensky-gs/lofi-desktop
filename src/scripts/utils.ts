const importFile = (filePath: string, fileType: 'css' | 'js') => {
	const dict: Record<
		typeof fileType,
		{
			pathPrefix: string;
			baliseWebview: keyof HTMLElementTagNameMap;
			baliseSrc: string;
			baliseSpecs: [string, string];
			container: string;
		}
	> = {
		css: {
			pathPrefix: '../styles/',
			baliseWebview: 'link',
			baliseSrc: 'href',
			baliseSpecs: ['rel', 'stylesheet'],
			container: 'head',
		},
		js: {
			pathPrefix: '../scripts/',
			baliseWebview: 'script',
			baliseSrc: 'src',
			baliseSpecs: ['type', 'text/javascript'],
			container: 'html',
		},
	};
	const val = dict[fileType];
	const node = document.createElement(val.baliseWebview);
	const path = val.pathPrefix + filePath;
	node[val.baliseSrc as 'ariaHidden'] = path;
	node[val.baliseSpecs[0] as 'ariaHidden'] = val.baliseSpecs[1];

	const container = document.getElementsByTagName(val.container)[0];
	if (!container) return;

	const included = Array.from(container.childNodes).some(
		(x) => x[val.baliseSrc as keyof typeof x] === path,
	);
	if (included) return;

	container.append(node);
};
