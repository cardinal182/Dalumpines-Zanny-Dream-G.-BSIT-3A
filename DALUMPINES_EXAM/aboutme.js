document.addEventListener("DOMContentLoaded", function() {
    const btnAboutme = document.getElementById('btn-aboutme');
    const divAboutme = document.getElementById('info');
    const btnSound = document.getElementById('btnSound');
    const hoverSound = document.getElementById('hoverSound');

    btnAboutme.addEventListener('click', function() {
        btnAboutme.style.transform = 'scale(0.95)';
        setTimeout(() => btnAboutme.style.transform = '', 120);

        if (btnSound) {
            btnSound.currentTime = 0;
            btnSound.play();
        }

        if(divAboutme.classList.contains('hide')) {
            divAboutme.classList.remove('hide');
            btnAboutme.textContent = "Show Less";
        } else {
            divAboutme.classList.add('hide');
            btnAboutme.textContent = "ABOUT ME";
        }
    });

    btnAboutme.addEventListener('mouseenter', function() {
        if (hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound.play();
        }
    });
});