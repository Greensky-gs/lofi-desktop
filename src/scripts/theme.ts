const defaultColor = 'color_light_theme';

const theme = localStorage.getItem('lofi_theme') ?? defaultColor;
if (!localStorage.getItem('lofi_theme'))
	localStorage.setItem('lofi_theme', defaultColor);

const body = document.getElementsByTagName('body')[0];

body?.classList?.add(theme);
