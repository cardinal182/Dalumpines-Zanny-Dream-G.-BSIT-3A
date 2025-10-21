const btn = document.getElementById('toggleBtn');
const label = document.getElementById('greeting');
const STORAGE_KEY = 'greetingState'; 

function initGreetingToggle() {
	if (!btn || !label) return;
	const saved = localStorage.getItem(STORAGE_KEY);
	window.__greetingState = saved === null ? false : saved === '1';
	updateUI();

	btn.addEventListener('click', toggleState);
	btn.addEventListener('keydown', (e) => {
		if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
			e.preventDefault();
			toggleState();
		}
	});
}

function updateUI() {
	const isHello = !!window.__greetingState;
	label.textContent = isHello ? 'HELLO!' : 'HI!';
	btn.classList.toggle('active', isHello);
	btn.setAttribute('aria-pressed', String(isHello));
}

function toggleState() {
	window.__greetingState = !window.__greetingState;
	localStorage.setItem(STORAGE_KEY, window.__greetingState ? '1' : '0');
	updateUI();
}
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initGreetingToggle);
} else {
	initGreetingToggle();
}