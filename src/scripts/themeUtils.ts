const getTheme = () =>
	localStorage.getItem('lofi_theme') ?? 'color_light_theme';
const loadTheme = () => {
	const theme = getTheme();

	const body = document.getElementsByTagName('body')[0];

	body.classList.remove('color_light_theme', 'color_dark_theme');
	body.classList.add(theme);
};
const switchTheme = (reload: boolean = true) => {
	const theme = getTheme();
	const themes = ['color_light_theme', 'color_dark_theme'];

	localStorage.setItem(
		'lofi_theme',
		themes[themes.indexOf(theme) + (1 % themes.length)],
	);

	if (reload) loadTheme();
};
