(() => {
    const bottomNav = document.getElementsByClassName('bottom_nav')[0]
    if (!bottomNav) return

    const iconsContainer = document.createElement('div')
    iconsContainer.classList.add('bottom_icons_container')
    const icons = [["playlists_icon", "playlists.png"], ["home_icon", "home.png"], ["glass_icon", "loupe.png"]]

    for (const [icon, path] of icons) {
        const img = document.createElement('img')
        img.style.content = `url(../assets/${path})`

        img.classList.add('bottom_icon', 'clickable', icon)

        iconsContainer.appendChild(img)
    }

    bottomNav.appendChild(iconsContainer)
})();
(() => {
    const upperNav = document.getElementsByClassName('upper_nav')[0];
    if (!upperNav) return

    const withIcon = (upperNav.getAttribute('displayIcon') ?? '1') === '1'

    const title = document.createElement('h3');
    title.innerText = 'Lofi Mobile'
    title.classList.add('dance')

    upperNav.appendChild(title)

    if (withIcon) {
        const img = document.createElement('img')
        img.id = 'theme_icon'
        img.onclick = () => switchTheme()
        img.classList.add('clickable', 'icon')

        upperNav.appendChild(img)
    }

})();