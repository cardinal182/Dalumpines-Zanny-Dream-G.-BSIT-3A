document.addEventListener("DOMContentLoaded", function() {
    const btnAction = document.getElementById('btn-action');
    const btnSound = document.getElementById('btnSound');
    const hoverSound = document.getElementById('hoverSound');

    btnAction.addEventListener('click', function() {
        btnAction.style.transform = 'scale(0.95)';
        setTimeout(() => btnAction.style.transform = '', 120);

        if (btnSound) {
            btnSound.currentTime = 0;
            btnSound.play();
        }
    });

    btnAction.addEventListener('mouseenter', function() {
        if (hoverSound) {
            hoverSound.currentTime = 0;
            hoverSound.play();
        }
    });
});
