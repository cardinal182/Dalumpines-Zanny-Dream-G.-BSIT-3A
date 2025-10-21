class GameState {
    constructor() {
        this.score = 2024;
        this.level = 1;
        this.health = 100;
        this.xp = 75;
        this.maxHealth = 100;
        this.maxXp = 100;
        this.particles = [];
        this.powerUps = [];
        this.isGameActive = false;
    }

    updateScore(points) {
        this.score += points;
        this.updateUI();
        this.checkLevelUp();
    }

    updateHealth(change) {
        this.health = Math.max(0, Math.min(this.maxHealth, this.health + change));
        this.updateUI();
    }

    updateXP(points) {
        this.xp = Math.min(this.maxXp, this.xp + points);
        this.updateUI();
        this.checkLevelUp();
    }

    checkLevelUp() {
        if (this.xp >= this.maxXp) {
            this.level++;
            this.xp = 0;
            this.maxHealth += 10;
            this.health = this.maxHealth;
            this.showLevelUpEffect();
            this.updateUI();
        }
    }

    updateUI() {
        const scoreEl = document.getElementById('scoreValue');
        const levelEl = document.getElementById('levelValue');
        const healthEl = document.getElementById('healthFill');
        const xpEl = document.getElementById('xpFill');

        if (scoreEl) scoreEl.textContent = this.score;
        if (levelEl) levelEl.textContent = this.level;
        if (healthEl) healthEl.style.width = `${(this.health / this.maxHealth) * 100}%`;
        if (xpEl) xpEl.style.width = `${(this.xp / this.maxXp) * 100}%`;
    }

    showLevelUpEffect() {
        this.createParticles(50, 'levelup');
        this.playSound('explosion');
        this.showScreenTransition('LEVEL UP!');
    }

    createParticles(count, type = 'default') {
        const container = document.getElementById('particleContainer');
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const colors = {
                'default': ['#ffcc00', '#ff6600', '#00ffcc'],
                'levelup': ['#ff00ff', '#00ffff', '#ffff00'],
                'click': ['#ffcc00', '#ffffff']
            };
            
            const colorSet = colors[type] || colors.default;
            particle.style.background = colorSet[Math.floor(Math.random() * colorSet.length)];
            
            particle.style.left = Math.random() * window.innerWidth + 'px';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (Math.random() * 2 + 2) + 's';
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 4000);
        }
    }

    showScreenTransition(message) {
        const transition = document.createElement('div');
        transition.className = 'screen-transition';
        transition.textContent = message;
        document.body.appendChild(transition);
        
        setTimeout(() => {
            if (transition.parentNode) {
                transition.parentNode.removeChild(transition);
            }
        }, 1000);
    }

    playSound(soundType) {
        const sounds = {
            'btn': document.getElementById('btnSound'),
            'hover': document.getElementById('hoverSound'),
            'explosion': document.getElementById('explosionSound')
        };
        
        const sound = sounds[soundType];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    }
}

const gameState = new GameState();

const projectData = {
    portfolio: {
        title: 'Portfolio Website',
        description: 'A fully responsive portfolio website built with modern web technologies. Features an 8-bit retro game aesthetic with interactive animations and particle effects.',
        features: [
            'Responsive design for all devices',
            '8-bit retro game styling',
            'Interactive particle system',
            'Animated character sprite',
            'Game-like UI elements',
            'Sound effects and music'
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript ES6'],
        demo: '#',
        code: '#'
    },
    tasktracker: {
        title: 'Task Tracker App',
        description: 'A simple yet powerful task management application with local storage persistence and dynamic UI updates.',
        features: [
            'Add, edit, and delete tasks',
            'Local storage persistence',
            'Task completion tracking',
            'Priority levels',
            'Due date management',
            'Clean, intuitive interface'
        ],
        tech: ['HTML5', 'CSS3', 'JavaScript'],
        demo: '#',
        code: '#'
    },
    pos: {
        title: 'C# POS System',
        description: 'A complete Point of Sale system built with C# and .NET Framework. Features database integration and modern UI design.',
        features: [
            'Product inventory management',
            'Sales transaction processing',
            'Customer management',
            'Sales reporting and analytics',
            'Database integration with SQL Server',
            'Modern Windows Forms UI'
        ],
        tech: ['C#', '.NET Framework', 'SQL Server', 'Windows Forms'],
        demo: '#',
        code: '#'
    }
};

function openProjectModal(projectId) {
    const modal = document.getElementById('projectModal');
    const data = projectData[projectId];
    
    if (!modal || !data) return;
    
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDescription').textContent = data.description;
    
    const featuresEl = document.getElementById('modalFeatures');
    featuresEl.innerHTML = `
        <h4>Key Features:</h4>
        <ul>${data.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
    `;
    
    const techEl = document.getElementById('modalTech');
    techEl.innerHTML = data.tech.map(tech => `<span class="tech-chip">${tech}</span>`).join('');
    
    const demoBtn = document.getElementById('modalDemoBtn');
    const codeBtn = document.getElementById('modalCodeBtn');
    demoBtn.onclick = () => window.open(data.demo, '_blank');
    codeBtn.onclick = () => window.open(data.code, '_blank');
    
    modal.classList.add('active');
    gameState.updateScore(10);
    gameState.createParticles(20, 'click');
    gameState.playSound('btn');
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

let particleSystemIntervalId = null;
function createParticleSystem() {
    if (particleSystemIntervalId !== null) return particleSystemIntervalId;
    particleSystemIntervalId = setInterval(() => {
        if (gameState.isGameActive) {
            gameState.createParticles(1, 'default');
        }
    }, 2000);
    return particleSystemIntervalId;
}

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 600);
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'start'});
        gameState.updateScore(5);
        gameState.createParticles(10, 'click');
    }
}

function openModal() {
    document.getElementById('contactModal').classList.add('active');
}
function closeModal() {
    document.getElementById('contactModal').classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize game state UI
    gameState.updateUI();
    
    const form = document.getElementById('contactForm');
    if(form){
        form.addEventListener('submit', function(e){
            e.preventDefault();
            const name = document.getElementById('cname').value.trim();
            const email = document.getElementById('cemail').value.trim();
            const msg = document.getElementById('cmsg').value.trim();
            const feedback = document.getElementById('contactMsg');
            if(!name || !email || !msg){
                feedback.style.display='block'; feedback.textContent='Please fill all fields.'; return;
            }
            const emailPattern = /^\S+@\S+\.\S+$/;
            if(!emailPattern.test(email)){
                feedback.style.display='block'; feedback.textContent='Please provide a valid email.'; return;
            }
            feedback.style.display='block'; feedback.textContent='Thanks, message sent! (demo)';
            gameState.updateScore(25);
            gameState.updateXP(10);
            gameState.createParticles(30, 'click');
            setTimeout(()=>{
                form.reset();
                closeModal();
                feedback.style.display='none';
            },900);
        });
    }

    const btnSound = document.getElementById('btnSound');
    const hoverSound = document.getElementById('hoverSound');
    
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            createClickEffect(e.clientX, e.clientY);
            
            gameState.playSound('btn');
            
            gameState.updateScore(1);
            gameState.updateXP(1);
            
            if (btn.classList.contains('project-btn')) {
                gameState.createParticles(15, 'click');
            }
        });
        
        btn.addEventListener('mouseenter', () => {
            gameState.playSound('hover');
        });
    });

    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gameState.updateScore(2);
            gameState.createParticles(5, 'default');
        });
        
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn')) {
                const projectId = card.dataset.project;
                if (projectId) {
                    openProjectModal(projectId);
                }
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && !e.target.closest('.modal')) {
            createClickEffect(e.clientX, e.clientY);
            gameState.updateScore(1);
        }
    });

    document.addEventListener('keydown', function(e) {
        if(e.key === 'Escape') {
            closeModal();
            closeProjectModal();
        }
        
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            gameState.updateScore(100);
            gameState.updateXP(50);
            gameState.createParticles(100, 'levelup');
        }
    });

    const entranceOverlay = document.getElementById('entranceOverlay');
    const startBtn = document.getElementById('startBtn');
    const bgMusic = document.getElementById('bgMusic');
    
    if (entranceOverlay && startBtn) {
        const activate = () => {
            // animate out
            entranceOverlay.classList.add('fade-out');
            // after animation ends, remove from DOM flow
            const cleanup = () => {
                entranceOverlay.style.display = 'none';
                entranceOverlay.classList.remove('fade-out');
                entranceOverlay.removeEventListener('animationend', cleanup);
            };
            entranceOverlay.addEventListener('animationend', cleanup);

            gameState.isGameActive = true;
            gameState.updateScore(50);
            gameState.createParticles(100, 'levelup');

            if (bgMusic) {
                bgMusic.currentTime = 0;
                bgMusic.volume = 0.5;
                const playPromise = bgMusic.play();
                if (playPromise && typeof playPromise.then === 'function') {
                    playPromise.catch(() => {
                        // Autoplay might be blocked; silently ignore.
                    });
                }
            }

            createParticleSystem();
        };

        startBtn.addEventListener('click', activate);
        // support keyboard activation (Enter)
        startBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
        // global key: Enter also activates if overlay visible
        document.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && entranceOverlay.style.display !== 'none') {
                activate();
            }
        });
    }

    const characterSprite = document.getElementById('characterSprite');
    if (characterSprite) {
        characterSprite.addEventListener('click', () => {
            gameState.updateScore(20);
            gameState.updateXP(5);
            gameState.createParticles(25, 'click');
            gameState.showScreenTransition('Character Interaction!');
        });
    }

    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY) {
            gameState.updateScore(1);
        }
        lastScrollY = currentScrollY;
    });

    setInterval(() => {
        localStorage.setItem('gameState', JSON.stringify({
            score: gameState.score,
            level: gameState.level,
            health: gameState.health,
            xp: gameState.xp
        }));
    }, 5000);

    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const state = JSON.parse(savedState);
        gameState.score = state.score || 2024;
        gameState.level = state.level || 1;
        gameState.health = state.health || 100;
        gameState.xp = state.xp || 75;
        gameState.updateUI();
    }

    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            gameState.updateScore(1000);
            gameState.updateXP(100);
            gameState.updateHealth(50);
            gameState.createParticles(200, 'levelup');
            gameState.showScreenTransition('KONAMI CODE ACTIVATED!');
            konamiCode = [];
        }
    });
});

function openSkillTree() {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-card">
            <div class="modal-header">
                <h3>Skill Tree</h3>
                <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-content">
                <div class="skill-tree">
                    <div class="skill-node" data-skill="html">
                        <div class="skill-icon">🌐</div>
                        <div class="skill-name">HTML Mastery</div>
                        <div class="skill-level">Level ${Math.floor(gameState.score / 100)}</div>
                    </div>
                    <div class="skill-node" data-skill="css">
                        <div class="skill-icon">🎨</div>
                        <div class="skill-name">CSS Wizardry</div>
                        <div class="skill-level">Level ${Math.floor(gameState.score / 150)}</div>
                    </div>
                    <div class="skill-node" data-skill="js">
                        <div class="skill-icon">⚡</div>
                        <div class="skill-name">JavaScript Power</div>
                        <div class="skill-level">Level ${Math.floor(gameState.score / 200)}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

const achievements = {
    firstClick: { name: 'First Click', description: 'You clicked something!', unlocked: false },
    score1000: { name: 'High Scorer', description: 'Reached 1000 points!', unlocked: false },
    level5: { name: 'Level Master', description: 'Reached level 5!', unlocked: false },
    explorer: { name: 'Explorer', description: 'Visited all sections!', unlocked: false }
};

function checkAchievements() {
    if (gameState.score >= 1000 && !achievements.score1000.unlocked) {
        achievements.score1000.unlocked = true;
        showAchievement('High Scorer');
    }
    
    if (gameState.level >= 5 && !achievements.level5.unlocked) {
        achievements.level5.unlocked = true;
        showAchievement('Level Master');
    }
}

function showAchievement(name) {
    const achievement = document.createElement('div');
    achievement.className = 'achievement-popup';
    achievement.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <div class="achievement-name">${name}</div>
                <div class="achievement-desc">Achievement Unlocked!</div>
            </div>
        </div>
    `;
    
    achievement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent);
        color: #000;
        padding: 1em;
        border: 4px solid #000;
        border-radius: 0;
        font-family: var(--pixel-font);
        z-index: 2000;
        animation: slideIn 0.5s ease;
    `;
    
    document.body.appendChild(achievement);
    
    setTimeout(() => {
        if (achievement.parentNode) {
            achievement.parentNode.removeChild(achievement);
        }
    }, 3000);
}

const originalUpdateScore = gameState.updateScore;
gameState.updateScore = function(points) {
    originalUpdateScore.call(this, points);
    checkAchievements();
};

class SpaceShooter {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.lastTime = 0;
        this.enemySpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        
        // Game objects
        this.player = null;
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        this.stars = [];
        
        // Input handling
        this.keys = {};
        this.setupInput();
        this.setupUI();
        this.initStars();
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'Space') e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    setupUI() {
        const startBtn = document.getElementById('startGameBtn');
        const pauseBtn = document.getElementById('pauseGameBtn');
        
        startBtn.addEventListener('click', () => this.startGame());
        pauseBtn.addEventListener('click', () => this.togglePause());
    }
    
    initStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 2 + 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.bullets = [];
        this.enemies = [];
        this.powerUps = [];
        this.particles = [];
        
        this.player = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            width: 20,
            height: 20,
            speed: 5,
            shootCooldown: 0
        };
        
        document.getElementById('gameOverlay').classList.add('hidden');
        document.getElementById('startGameBtn').style.display = 'none';
        document.getElementById('pauseGameBtn').style.display = 'inline-block';
        
        this.gameLoop();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('gameOverlay').classList.remove('hidden');
            document.getElementById('gameOverlay').classList.add('game-paused');
            document.querySelector('.game-message h2').textContent = 'PAUSED';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('gameOverlay').classList.add('hidden');
        }
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState === 'playing') {
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            this.update(deltaTime);
            this.render();
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies();
        this.updatePowerUps();
        this.updateParticles();
        this.updateStars();
        this.checkCollisions();
        this.spawnEnemies();
        this.spawnPowerUps();
        this.updateUI();
    }
    
    updatePlayer() {
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }
        
        if (this.keys['Space'] && this.player.shootCooldown <= 0) {
            this.shoot();
            this.player.shootCooldown = 10;
        }
        
        if (this.player.shootCooldown > 0) {
            this.player.shootCooldown--;
        }
        
        if (this.keys['KeyP']) {
            this.togglePause();
        }
    }
    
    shoot() {
        this.bullets.push({
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 10,
            speed: 8,
            color: '#00ff00'
        });
        gameState.playSound('btn');
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
    }
    
    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            enemy.y += enemy.speed;
            return enemy.y < this.canvas.height + enemy.height;
        });
    }
    
    updatePowerUps() {
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.y += powerUp.speed;
            powerUp.rotation += 0.1;
            return powerUp.y < this.canvas.height + powerUp.size;
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }
    
    updateStars() {
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
    }
    
    spawnEnemies() {
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer > 60 - this.level * 5) {
            this.enemies.push({
                x: Math.random() * (this.canvas.width - 20),
                y: -20,
                width: 20,
                height: 20,
                speed: 1 + this.level * 0.5,
                color: '#ff0000',
                health: 1
            });
            this.enemySpawnTimer = 0;
        }
    }
    
    spawnPowerUps() {
        this.powerUpSpawnTimer++;
        if (this.powerUpSpawnTimer > 300) {
            const types = ['health', 'rapid', 'shield'];
            const type = types[Math.floor(Math.random() * types.length)];
            
            this.powerUps.push({
                x: Math.random() * (this.canvas.width - 20),
                y: -20,
                size: 15,
                speed: 2,
                type: type,
                rotation: 0,
                color: type === 'health' ? '#00ff00' : type === 'rapid' ? '#ffff00' : '#00ffff'
            });
            this.powerUpSpawnTimer = 0;
        }
    }
    
    checkCollisions() {
        this.bullets.forEach((bullet, bulletIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (this.isColliding(bullet, enemy)) {
                    this.bullets.splice(bulletIndex, 1);
                    this.enemies.splice(enemyIndex, 1);
                    this.score += 10;
                    this.createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                }
            });
        });
        
        this.enemies.forEach((enemy, enemyIndex) => {
            if (this.isColliding(this.player, enemy)) {
                this.enemies.splice(enemyIndex, 1);
                this.lives--;
                this.createExplosion(this.player.x + this.player.width/2, this.player.y + this.player.height/2);
                if (this.lives <= 0) {
                    this.gameOver();
                }
            }
        });
        
        this.powerUps.forEach((powerUp, powerUpIndex) => {
            if (this.isColliding(this.player, powerUp)) {
                this.powerUps.splice(powerUpIndex, 1);
                this.applyPowerUp(powerUp.type);
                this.createExplosion(powerUp.x + powerUp.size/2, powerUp.y + powerUp.size/2, powerUp.color);
            }
        });
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    applyPowerUp(type) {
        switch (type) {
            case 'health':
                this.lives = Math.min(5, this.lives + 1);
                break;
            case 'rapid':
                this.player.shootCooldown = Math.max(0, this.player.shootCooldown - 5);
                break;
            case 'shield':
                this.score += 50;
                break;
        }
        gameState.updateScore(25);
    }
    
    createExplosion(x, y, color = '#ff6600') {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                color: color,
                size: Math.random() * 3 + 1,
                life: 30,
                maxLife: 30,
                alpha: 1
            });
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('gameOverlay').classList.remove('hidden');
        document.getElementById('gameOverlay').classList.add('game-over');
        document.querySelector('.game-message h2').textContent = 'GAME OVER';
        document.querySelector('.game-message p').textContent = `Final Score: ${this.score}`;
        
        document.getElementById('startGameBtn').style.display = 'inline-block';
        document.getElementById('pauseGameBtn').style.display = 'none';
        

        gameState.updateScore(this.score);
        gameState.createParticles(50, 'levelup');
    }
    
    updateUI() {
        document.getElementById('gameLives').textContent = this.lives;
        document.getElementById('gameScore').textContent = this.score;
        document.getElementById('gameLevel').textContent = this.level;
    }
    
    render() {
        this.ctx.fillStyle = '#000428';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
        
        this.powerUps.forEach(powerUp => {
            this.ctx.save();
            this.ctx.translate(powerUp.x + powerUp.size/2, powerUp.y + powerUp.size/2);
            this.ctx.rotate(powerUp.rotation);
            this.ctx.fillStyle = powerUp.color;
            this.ctx.fillRect(-powerUp.size/2, -powerUp.size/2, powerUp.size, powerUp.size);
            this.ctx.restore();
        });
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            this.ctx.restore();
        });
    }
}

function switchGame(gameType) {
    const spaceGame = document.querySelector('.game-container:not(#tetrisGame)');
    const tetrisGame = document.getElementById('tetrisGame');
    const spaceTab = document.querySelector('.game-tab[onclick*="space"]');
    const tetrisTab = document.querySelector('.game-tab[onclick*="tetris"]');
    
    if (gameType === 'space') {
        spaceGame.style.display = 'flex';
        tetrisGame.style.display = 'none';
        spaceTab.classList.add('active');
        tetrisTab.classList.remove('active');
    } else if (gameType === 'tetris') {
        spaceGame.style.display = 'none';
        tetrisGame.style.display = 'flex';
        spaceTab.classList.remove('active');
        tetrisTab.classList.add('active');
    }
}

class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('tetrisCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.gameState = 'menu';
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropTime = 0;
        this.lastTime = 0;
        
        this.board = Array(20).fill().map(() => Array(10).fill(0));
        this.currentPiece = null;
        this.nextPiece = null;
        this.dropCounter = 0;
        this.dropInterval = 1000; // milliseconds
        
        this.keys = {};
        this.setupInput();
        this.setupUI();
        
        // Tetris pieces
        this.pieces = {
            I: {
                shape: [
                    [1, 1, 1, 1]
                ],
                color: '#00ffff'
            },
            O: {
                shape: [
                    [1, 1],
                    [1, 1]
                ],
                color: '#ffff00'
            },
            T: {
                shape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                color: '#800080'
            },
            S: {
                shape: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                color: '#00ff00'
            },
            Z: {
                shape: [
                    [1, 1, 0],
                    [0, 1, 1]
                ],
                color: '#ff0000'
            },
            J: {
                shape: [
                    [1, 0, 0],
                    [1, 1, 1]
                ],
                color: '#0000ff'
            },
            L: {
                shape: [
                    [0, 0, 1],
                    [1, 1, 1]
                ],
                color: '#ffa500'
            }
        };
        
        this.pieceTypes = Object.keys(this.pieces);
    }
    
    setupInput() {
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'playing') {
                this.keys[e.code] = true;
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    setupUI() {
        const startBtn = document.getElementById('startTetrisBtn');
        const pauseBtn = document.getElementById('pauseTetrisBtn');
        
        startBtn.addEventListener('click', () => this.startGame());
        pauseBtn.addEventListener('click', () => this.togglePause());
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.board = Array(20).fill().map(() => Array(10).fill(0));
        this.dropInterval = 1000;
        
        this.spawnPiece();
        this.spawnNextPiece();
        
        document.getElementById('tetrisOverlay').classList.add('hidden');
        document.getElementById('startTetrisBtn').style.display = 'none';
        document.getElementById('pauseTetrisBtn').style.display = 'inline-block';
        
        this.gameLoop();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('tetrisOverlay').classList.remove('hidden');
            document.getElementById('tetrisOverlay').classList.add('game-paused');
            document.querySelector('#tetrisOverlay .game-message h2').textContent = 'PAUSED';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('tetrisOverlay').classList.add('hidden');
        }
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState === 'playing') {
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            this.update(deltaTime);
            this.render();
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        this.handleInput();
        this.dropPiece(deltaTime);
        this.updateUI();
    }
    
    handleInput() {
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.movePiece(-1, 0);
            this.keys['KeyA'] = false;
            this.keys['ArrowLeft'] = false;
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.movePiece(1, 0);
            this.keys['KeyD'] = false;
            this.keys['ArrowRight'] = false;
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.movePiece(0, 1);
            this.keys['KeyS'] = false;
            this.keys['ArrowDown'] = false;
        }
        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.rotatePiece();
            this.keys['KeyW'] = false;
            this.keys['ArrowUp'] = false;
        }
        if (this.keys['KeyP']) {
            this.togglePause();
            this.keys['KeyP'] = false;
        }
    }
    
    dropPiece(deltaTime) {
        this.dropCounter += deltaTime;
        if (this.dropCounter > this.dropInterval) {
            this.movePiece(0, 1);
            this.dropCounter = 0;
        }
    }
    
    spawnPiece() {
        if (!this.nextPiece) {
            this.spawnNextPiece();
        }
        
        this.currentPiece = {
            type: this.nextPiece.type,
            shape: this.nextPiece.shape,
            color: this.nextPiece.color,
            x: Math.floor(this.canvas.width / 2 / 30) - Math.floor(this.nextPiece.shape[0].length / 2),
            y: 0
        };
        
        this.spawnNextPiece();
    }
    
    spawnNextPiece() {
        const type = this.pieceTypes[Math.floor(Math.random() * this.pieceTypes.length)];
        this.nextPiece = {
            type: type,
            shape: this.pieces[type].shape,
            color: this.pieces[type].color
        };
        this.drawNextPiece();
    }
    
    movePiece(dx, dy) {
        if (this.isValidMove(this.currentPiece, dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            return true;
        } else if (dy > 0) {
            // Piece has landed
            this.placePiece();
            this.clearLines();
            this.spawnPiece();
            
            if (this.isGameOver()) {
                this.gameOver();
            }
        }
        return false;
    }
    
    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        
        if (!this.isValidMove(this.currentPiece, 0, 0)) {
            this.currentPiece.shape = originalShape;
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    isValidMove(piece, dx, dy) {
        const newX = piece.x + dx;
        const newY = piece.y + dy;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;
                    
                    if (boardX < 0 || boardX >= 10 || boardY >= 20) {
                        return false;
                    }
                    
                    if (boardY >= 0 && this.board[boardY][boardX]) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    
    placePiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.board.length - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(10).fill(0));
                linesCleared++;
                y++;
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += this.calculateScore(linesCleared);
            this.updateLevel();
            gameState.updateScore(this.score);
            gameState.createParticles(20, 'click');
        }
    }
    
    calculateScore(linesCleared) {
        const baseScore = [0, 40, 100, 300, 1200];
        return baseScore[linesCleared] * this.level;
    }
    
    updateLevel() {
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
        }
    }
    
    isGameOver() {
        return this.board[0].some(cell => cell !== 0);
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('tetrisOverlay').classList.remove('hidden');
        document.getElementById('tetrisOverlay').classList.add('game-over');
        document.querySelector('#tetrisOverlay .game-message h2').textContent = 'GAME OVER';
        document.querySelector('#tetrisOverlay .game-message p').textContent = `Final Score: ${this.score}`;
        
        document.getElementById('startTetrisBtn').style.display = 'inline-block';
        document.getElementById('pauseTetrisBtn').style.display = 'none';
        
        gameState.createParticles(50, 'levelup');
    }
    
    drawNextPiece() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const blockSize = 15;
            const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * blockSize) / 2;
            const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * blockSize) / 2;
            
            this.nextCtx.fillStyle = this.nextPiece.color;
            for (let y = 0; y < this.nextPiece.shape.length; y++) {
                for (let x = 0; x < this.nextPiece.shape[y].length; x++) {
                    if (this.nextPiece.shape[y][x]) {
                        this.nextCtx.fillRect(
                            offsetX + x * blockSize,
                            offsetY + y * blockSize,
                            blockSize - 1,
                            blockSize - 1
                        );
                    }
                }
            }
        }
    }
    
    updateUI() {
        document.getElementById('tetrisScore').textContent = this.score;
        document.getElementById('tetrisLines').textContent = this.lines;
        document.getElementById('tetrisLevel').textContent = this.level;
    }
    
    render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBoard();
        
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
        }
        
        this.drawGrid();
    }
    
    drawBoard() {
        const blockSize = 30;
        
        for (let y = 0; y < this.board.length; y++) {
            for (let x = 0; x < this.board[y].length; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(
                        x * blockSize,
                        y * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                }
            }
        }
    }
    
    drawPiece(piece) {
        const blockSize = 30;
        this.ctx.fillStyle = piece.color;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    this.ctx.fillRect(
                        (piece.x + x) * blockSize,
                        (piece.y + y) * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                }
            }
        }
    }
    
    drawGrid() {
        const blockSize = 30;
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= 10; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * blockSize, 0);
            this.ctx.lineTo(x * blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= 20; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * blockSize);
            this.ctx.lineTo(this.canvas.width, y * blockSize);
            this.ctx.stroke();
        }
    }
}

let spaceShooter;
let tetrisGame;

document.addEventListener('DOMContentLoaded', function() {
    spaceShooter = new SpaceShooter();
    tetrisGame = new TetrisGame();
    backgroundCharacters = new BackgroundCharacters();
    
    // Update characters periodically
    setInterval(() => {
        if (backgroundCharacters) {
            backgroundCharacters.updateCharacters();
        }
    }, 100);
    
    const gameContainers = document.querySelectorAll('.game-container');
    gameContainers.forEach(container => {
        const observer = new MutationObserver(() => {
            if (backgroundCharacters) {
                if (container.style.display === 'none') {
                    backgroundCharacters.resumeCharacters();
                } else {
                    backgroundCharacters.pauseCharacters();
                }
            }
        });
        observer.observe(container, { attributes: true, attributeFilter: ['style'] });
    });
    setInterval(() => {
        if (backgroundCharacters && Math.random() < 0.1) { // 10% chance every 5 seconds
            backgroundCharacters.addCharacter();
        }
    }, 5000);
});
