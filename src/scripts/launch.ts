setTimeout(() => {
    const img = document.getElementById('logo');
    if (!img) return

    img.classList.remove('logo_fading')
    img.classList.add('logo_waiting')
}, 4000)