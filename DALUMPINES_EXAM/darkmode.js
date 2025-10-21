document.addEventListener("DOMContentLoaded", function() {
    const themeBtn = document.getElementById('theme-btn');
    const btnSound = document.getElementById('btnSound');
    const hoverSound = document.getElementById('hoverSound');

    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            themeBtn.style.transform = 'scale(0.95)';
            setTimeout(() => themeBtn.style.transform = '', 120);

            if (btnSound) {
                btnSound.currentTime = 0;
                btnSound.play();
            }
        });

        themeBtn.addEventListener('mouseenter', function() {
            if (hoverSound) {
                hoverSound.currentTime = 0;
                hoverSound.play();
            }
        });
    }
});
