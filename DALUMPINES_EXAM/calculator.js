class Calculator {
    constructor() {
        this.soundEnabled = true;
        this.initializeElements();
        this.attachEventListeners();
        this.createAudioContext();
    }

    initializeElements() {
        this.num1Input = document.getElementById('num1');
        this.num2Input = document.getElementById('num2');
        this.operationSelect = document.getElementById('operation');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resultElement = document.getElementById('result');
        this.soundToggle = document.getElementById('soundToggle');
        this.soundIcon = document.querySelector('.sound-icon');
        this.btnSound = document.getElementById('btnSound');
        this.hoverSfx = document.getElementById('hoverSound');
    }

    attachEventListeners() {
        this.calculateBtn.addEventListener('click', () => this.compute());
        this.soundToggle.addEventListener('click', () => this.toggleSound());
        
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.compute();
            }
        });

        [this.num1Input, this.num2Input].forEach(input => {
            input.addEventListener('input', () => this.playKeySound());
        });

        this.operationSelect.addEventListener('change', () => this.playKeySound());
    }

    createAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.audioContext = null;
        }
    }

    playSound(frequency, duration = 100, type = 'sine') {
        if (!this.soundEnabled || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration / 1000);

            this.soundToggle.classList.add('playing');
            setTimeout(() => {
                this.soundToggle.classList.remove('playing');
            }, duration);
        } catch (e) {
            console.log('Error playing sound:', e);
        }
    }

    playKeySound() {
        this.playSound(800, 50);
    }

    playSuccessSound() {
        this.playSound(523.25, 150); // C5
        setTimeout(() => this.playSound(659.25, 150), 75); // E5
        setTimeout(() => this.playSound(783.99, 200), 150); // G5
    }

    playErrorSound() {
        this.playSound(200, 100);
        setTimeout(() => this.playSound(150, 100), 100);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        
        if (this.soundEnabled) {
            this.soundIcon.textContent = '🔊';
            this.soundToggle.classList.remove('muted');
            this.playSound(600, 100);
        } else {
            this.soundIcon.textContent = '🔇';
            this.soundToggle.classList.add('muted');
        }

        localStorage.setItem('calculatorSoundEnabled', this.soundEnabled);
    }

    loadSoundPreference() {
        const saved = localStorage.getItem('calculatorSoundEnabled');
        if (saved !== null) {
            this.soundEnabled = JSON.parse(saved);
            if (!this.soundEnabled) {
                this.soundIcon.textContent = '🔇';
                this.soundToggle.classList.add('muted');
            }
        }
    }

    setResult(text, state) {
        if (!this.resultElement) return;
        this.resultElement.textContent = text;
        this.resultElement.classList.remove('success', 'error');
        if (state) this.resultElement.classList.add(state);
    }

    playSfx(el) {
        if (!el) return;
        try { el.currentTime = 0; el.play(); } catch (e) { }
    }

    compute() {
        const a = parseFloat(this.num1Input.value);
        const b = parseFloat(this.num2Input.value);
        if (Number.isNaN(a) || Number.isNaN(b)) {
            this.setResult('Invalid input', 'error');
            this.playSfx(this.hoverSfx);
            return;
        }
        let r;
        switch (this.operationSelect.value) {
            case 'add': r = a + b; break;
            case 'subtract': r = a - b; break;
            case 'multiply': r = a * b; break;
            case 'divide':
                if (b === 0) {
                    this.setResult('Cannot divide by 0', 'error');
                    this.playSfx(this.hoverSfx);
                    return;
                }
                r = a / b;
                break;
            default:
                this.setResult('Unknown op', 'error');
                this.playSfx(this.hoverSfx);
                return;
        }
        const out = Math.round((r + Number.EPSILON) * 100000) / 100000;
        this.setResult(String(out), 'success');
        this.playSfx(this.btnSound);

        try { window._retro && window._retro.flashScore && window._retro.flashScore(3); } catch (e) { }
    }

    showSuccess(message) {
        this.resultElement.textContent = message;
        this.resultElement.classList.add('success');
        this.playSuccessSound();
        
        this.calculateBtn.style.animation = 'buttonClick 0.2s ease';
        setTimeout(() => {
            this.calculateBtn.style.animation = '';
        }, 200);
    }

    showError(message) {
        this.resultElement.textContent = message;
        this.resultElement.classList.add('error');
        this.playErrorSound();
        
        this.resultElement.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            this.resultElement.style.animation = '';
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    calculator.loadSoundPreference();
});

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
