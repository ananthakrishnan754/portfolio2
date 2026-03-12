// ==========================================
// INTERACTIVE TERMINAL ENGINE
// ==========================================
(function initInteractiveTerminal() {
    const termSection = document.getElementById('terminal');
    const matrixCanvas = document.getElementById('matrix-canvas');
    const termWindow = document.getElementById('terminal-window');
    const termOutput = document.getElementById('terminal-output');
    const termInput = document.getElementById('terminal-input');
    const termBody = document.getElementById('terminal-body');
    const gameCanvas = document.getElementById('game-canvas');

    let termStarted = false;
    let cmdHistory = [];
    let historyIdx = -1;
    let currentGame = null;
    let gameInterval = null;
    let snakeState = {};
    let tttState = {};
    let c4State = {};
    let marioState = {};

    // --- Utilities ---
    function appendOutput(text, color) {
        const d = document.createElement('div');
        d.style.color = color || '#00ff41';
        d.textContent = text;
        termOutput.appendChild(d);
        termBody.scrollTop = termBody.scrollHeight;
    }
    function appendHTML(html) {
        const d = document.createElement('div');
        d.innerHTML = html;
        termOutput.appendChild(d);
        termBody.scrollTop = termBody.scrollHeight;
    }
    function clearOutput() { termOutput.innerHTML = ''; }
    function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
    const P = '<span style="color:#00ff41">visitor@portfolio:~$</span> ';

    // --- Matrix Rain ---
    function startMatrixRain() {
        const ctx = matrixCanvas.getContext('2d');
        matrixCanvas.width = termSection.offsetWidth;
        matrixCanvas.height = termSection.offsetHeight;
        const chars = 'アイウエオカキクケコ0123456789ABCDEF<>{}[]';
        const fs = 14, cols = Math.floor(matrixCanvas.width / fs);
        const drops = Array.from({ length: cols }, () => Math.random() * -50);
        let frame = 0;
        function draw() {
            ctx.fillStyle = 'rgba(10,10,10,0.05)';
            ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
            ctx.fillStyle = '#00ff41';
            ctx.font = fs + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, drops[i] * fs);
                if (drops[i] * fs > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            frame++;
            if (frame < 120) requestAnimationFrame(draw);
            else gsap.to(matrixCanvas, { opacity: 0, duration: 0.8, onComplete: () => { matrixCanvas.style.display = 'none'; startBoot(); } });
        }
        draw();
    }

    // --- Boot Sequence ---
    function startBoot() {
        gsap.to(termWindow, { opacity: 1, duration: 0.5 });
        const lines = [
            { t: '> Booting portfolio OS...', d: 400 },
            { t: '> Loading kernel modules............. [<span style="color:#27c93f">OK</span>]', d: 500 },
            { t: '> Initializing neural network........ [<span style="color:#27c93f">OK</span>]', d: 400 },
            { t: '> Loading projects database.......... [<span style="color:#27c93f">OK</span>]', d: 300 },
            { t: '> Starting terminal service.......... [<span style="color:#27c93f">OK</span>]', d: 300 },
            { t: '', d: 200 },
            { t: '<span style="color:#ffbd2e">╔══════════════════════════════════════════════╗</span>', d: 50 },
            { t: '<span style="color:#ffbd2e">║</span>   Welcome to <span style="color:#fff;font-weight:bold">Ananthakrishnan.dev</span> v1.0        <span style="color:#ffbd2e">║</span>', d: 50 },
            { t: '<span style="color:#ffbd2e">║</span>   Type <span style="color:#27c93f">"help"</span> to get started               <span style="color:#ffbd2e">║</span>', d: 50 },
            { t: '<span style="color:#ffbd2e">╚══════════════════════════════════════════════╝</span>', d: 50 },
            { t: '', d: 200 },
        ];
        let i = 0;
        function next() {
            if (i >= lines.length) { termInput.focus(); return; }
            appendHTML('<div style="color:#00ff41">' + lines[i].t + '</div>');
            const delay = lines[i].d; i++;
            setTimeout(next, delay);
        }
        next();
    }

    // --- Input Handler ---
    termInput.addEventListener('keydown', function (e) {
        if (currentGame === 'tictactoe') { handleTTTInput(e); return; }
        if (currentGame === 'connect4') { handleC4Input(e); return; }
        if (currentGame === 'snake') {
            if (e.key === 'Escape' || e.key === 'q') stopSnake();
            return;
        }
        if (e.key === 'Enter') {
            const cmd = termInput.value.trim(); termInput.value = '';
            runCommandStr(cmd);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIdx > 0) { historyIdx--; termInput.value = cmdHistory[historyIdx]; }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx < cmdHistory.length - 1) { historyIdx++; termInput.value = cmdHistory[historyIdx]; }
            else { historyIdx = cmdHistory.length; termInput.value = ''; }
        }
    });

    function runCommandStr(cmd) {
        appendHTML('<div>' + P + '<span style="color:#fff">' + esc(cmd) + '</span></div>');
        if (cmd) { cmdHistory.push(cmd); historyIdx = cmdHistory.length; processCommand(cmd); }
    }

    window.runMobileCmd = function (cmd) {
        runCommandStr(cmd);
    };

    window.gbBtn = function (key) {
        if (snakeState.keyHandler) {
            snakeState.keyHandler({ key: key, preventDefault: () => { } });
        }
        if (key === 'Escape' && currentGame === 'snake') {
            stopSnake();
        }
    };

    termBody.addEventListener('click', () => {
        if (window.innerWidth > 768) termInput.focus();
    });

    // --- Command Router ---
    function processCommand(cmd) {
        const parts = cmd.toLowerCase().split(/\s+/), base = parts[0], args = parts.slice(1).join(' ');
        const handlers = {
            help: cmdHelp, about: cmdAbout, whoami: cmdWhoami, projects: cmdProjects,
            skills: cmdSkills, contact: cmdContact, github: cmdGithub, resume: cmdResume,
            clear: clearOutput, neofetch: cmdNeofetch, ls: cmdLs, coffee: cmdCoffee
        };
        if (handlers[base]) handlers[base]();
        else if (base === 'run') cmdRun(args);
        else if (base === 'play') cmdPlay(args);
        else if (base === 'sudo' && args === 'hire-me') cmdSudoHireMe();
        else appendOutput('bash: ' + base + ': command not found. Type "help" for commands.', '#ff5f56');
    }

    // ==========================================
    // COMMAND HANDLERS
    // ==========================================
    function cmdHelp() {
        appendHTML(`<div style="color:#ffbd2e;margin:8px 0">Available Commands:</div><div style="color:#aaa">  <span style="color:#27c93f">help</span>          Show this help menu
  <span style="color:#27c93f">about</span>         System dashboard
  <span style="color:#27c93f">whoami</span>        Who am I?
  <span style="color:#27c93f">projects</span>      List all projects
  <span style="color:#27c93f">skills</span>        Interactive skills graph
  <span style="color:#27c93f">contact</span>       Contact information
  <span style="color:#27c93f">github</span>        GitHub activity &amp; repos
  <span style="color:#27c93f">resume</span>        Download resume
  <span style="color:#27c93f">run [name]</span>    Launch project details
  <span style="color:#27c93f">play [game]</span>   Play a game (snake, mario, tictactoe, connect4)
  <span style="color:#27c93f">neofetch</span>      System info
  <span style="color:#27c93f">clear</span>         Clear the terminal
  <span style="color:#27c93f">ls</span>            List files</div><div style="color:#666;margin-top:8px">  💡 Try some hidden commands too...</div>`);
    }

    function cmdAbout() {
        appendHTML(`<div style="color:#ffbd2e;margin:8px 0">╔═══════════════════════════════════════╗
║       SYSTEM STATUS DASHBOARD        ║
╚═══════════════════════════════════════╝</div><div style="color:#aaa">  <span style="color:#27c93f">Name:</span>       Ananthakrishnan S
  <span style="color:#27c93f">Role:</span>       Robotics &amp; Embedded Systems Engineer
  <span style="color:#27c93f">Location:</span>   Kerala, India
  <span style="color:#27c93f">Education:</span>  B.Tech ECE, Class of 2026
  <span style="color:#27c93f">Status:</span>     <span style="color:#27c93f">●</span> Open to opportunities

  <span style="color:#ffbd2e">── Languages ──</span>
  Python      <span style="color:#3572A5">██████████</span> 90%
  C++         <span style="color:#00599c">████████░░</span> 80%
  JavaScript  <span style="color:#f7df1e">███████░░░</span> 70%
  C           <span style="color:#555">████████░░</span> 80%

  <span style="color:#ffbd2e">── Frameworks ──</span>
  ROS2        <span style="color:#e74c3c">████████░░</span> 80%
  OpenCV      <span style="color:#27c93f">█████████░</span> 85%
  Flask       <span style="color:#fff">███████░░░</span> 70%

  <span style="color:#ffbd2e">── Hardware ──</span>
  ESP32       <span style="color:#00979d">█████████░</span> 90%
  Arduino     <span style="color:#00979d">█████████░</span> 85%
  RPi         <span style="color:#c51a4a">████████░░</span> 80%
  STM32       <span style="color:#03234b">███████░░░</span> 75%</div>`);
    }

    function cmdWhoami() {
        appendHTML(`<div style="color:#aaa">  <span style="color:#fff;font-weight:bold">Ananthakrishnan S</span>
  Embedded Systems Engineer | Robotics Developer | Applied AI Builder
  CTO @ Nuke Labs | Secretary, IEEE SB SBCE
  Location: Alappuzha, Kerala, India</div>`);
    }

    function cmdProjects() {
        appendHTML(`<div style="color:#ffbd2e;margin:8px 0">Projects:</div><div style="color:#aaa">  <span style="color:#27c93f">[1]</span> MemoryCare — AI Spectacles for Alzheimer's
  <span style="color:#27c93f">[2]</span> Warehouse Drone — ROS2 Simulated Autonomy
  <span style="color:#27c93f">[3]</span> 6-DOF Robot Arm — Inverse Kinematics
  <span style="color:#27c93f">[4]</span> STM32 HAL Drivers — Custom Firmware
  <span style="color:#27c93f">[5]</span> Retro Portfolio — Web Frontend</div><div style="color:#666;margin-top:4px">  Type <span style="color:#27c93f">run memorycare</span> for project details</div>`);
    }

    function cmdSkills() {
        appendHTML(`<div style="color:#ffbd2e;margin:8px 0">Technical Skills:</div><div style="color:#aaa">  Python      <span style="color:#3572A5">██████████████████░░</span> 90%
  C++         <span style="color:#00599c">████████████████░░░░</span> 80%
  C           <span style="color:#555">████████████████░░░░</span> 80%
  JavaScript  <span style="color:#f7df1e">██████████████░░░░░░</span> 70%
  ROS2        <span style="color:#e74c3c">████████████████░░░░</span> 80%
  OpenCV      <span style="color:#27c93f">█████████████████░░░</span> 85%
  ESP32       <span style="color:#00979d">██████████████████░░</span> 90%
  Embedded    <span style="color:#00979d">█████████████████░░░</span> 85%
  Git         <span style="color:#f1502f">█████████████████░░░</span> 85%</div>`);
    }

    function cmdContact() {
        appendHTML(`<div style="color:#ffbd2e;margin:8px 0">Contact Information:</div><div style="color:#aaa">  <span style="color:#27c93f">Email</span>     : <a href="mailto:krishnananantha754@gmail.com" style="color:#58a6ff;text-decoration:underline" target="_blank">krishnananantha754@gmail.com</a>
  <span style="color:#27c93f">LinkedIn</span>  : <a href="https://linkedin.com/in/ananthakrishnan754" style="color:#58a6ff;text-decoration:underline" target="_blank">linkedin.com/in/ananthakrishnan754</a>
  <span style="color:#27c93f">GitHub</span>    : <a href="https://github.com/ananthakrishnan754" style="color:#58a6ff;text-decoration:underline" target="_blank">github.com/ananthakrishnan754</a>
  <span style="color:#27c93f">Fiverr</span>    : <a href="https://fiverr.com/s/2KNp95q" style="color:#58a6ff;text-decoration:underline" target="_blank">fiverr.com/s/2KNp95q</a>
  <span style="color:#27c93f">Instagram</span> : <a href="https://instagram.com/secretkrixx" style="color:#58a6ff;text-decoration:underline" target="_blank">instagram.com/secretkrixx</a></div>`);
    }

    function cmdGithub() {
        appendHTML(`<div style="color:#ffbd2e;margin:8px 0">GitHub — ananthakrishnan754</div><div style="color:#aaa">  <span style="color:#8b949e">📌 Pinned Repositories:</span>

  <span style="color:#58a6ff;font-weight:bold">memorycare-ai-spectacles</span>  ⭐24  🍴5
    <span style="color:#8b949e">AI spectacles for Alzheimer's — ESP32-CAM + OpenCV</span>
    <span style="color:#3572A5">● Python</span>

  <span style="color:#58a6ff;font-weight:bold">robot-arm-control</span>  ⭐12  🍴3
    <span style="color:#8b949e">6-DOF robotic arm inverse kinematics with ROS2</span>
    <span style="color:#3572A5">● Python</span>

  <span style="color:#58a6ff;font-weight:bold">warehouse-drone-eyantra</span>  ⭐8  🍴2
    <span style="color:#8b949e">ROS2 Gazebo simulated warehouse drone</span>
    <span style="color:#3572A5">● Python</span>

  <span style="color:#58a6ff;font-weight:bold">stm32-hal-drivers</span>  ⭐8  🍴1
    <span style="color:#8b949e">Custom HAL drivers for STM32</span>
    <span style="color:#555">● C</span>

  <span style="color:#666">Followers: 150 | Following: 42 | Repos: 15+</span></div>`);
    }

    function cmdResume() {
        appendOutput('> Downloading resume...', '#27c93f');
        appendOutput('> Resume downloaded successfully!', '#27c93f');
        const a = document.createElement('a');
        a.href = 'AnanthakrishnanS_Resume (1).pdf'; a.download = 'AnanthakrishnanS_Resume.pdf'; a.click();
    }

    function cmdRun(name) {
        const projects = {
            memorycare: { n: 'MemoryCare', d: 'Smart spectacles for Alzheimer\'s patients with real-time face recognition', hw: 'ESP32-CAM', ai: 'Face Recognition (LBPH), OpenCV', be: 'Flask + Firebase', l: 'Python', gh: 'https://github.com/ananthakrishnan754/memorycare-ai-spectacles' },
            drone: { n: 'Warehouse Drone', d: 'Simulated warehouse drone for eYantra 2024-25', hw: 'Simulated (Gazebo)', ai: 'Path Planning, Object Detection', be: 'ROS2 + OpenCV', l: 'Python', gh: 'https://github.com/ananthakrishnan754/warehouse-drone-eyantra' },
            robotarm: { n: '6-DOF Robot Arm', d: 'Forward and inverse kinematics for a 6-DoF manipulator', hw: 'Servo Motors', ai: 'Inverse Kinematics Solver', be: 'ROS2', l: 'Python', gh: 'https://github.com/ananthakrishnan754/robot-arm-control' },
            stm32: { n: 'STM32 HAL Drivers', d: 'Custom Hardware Abstraction Layer for STM32', hw: 'STM32 MCU', ai: 'N/A', be: 'Bare-metal firmware', l: 'C', gh: 'https://github.com/ananthakrishnan754/stm32-hal-drivers' },
            portfolio: { n: 'Retro Portfolio', d: 'Personal portfolio with interactive terminal and animations', hw: 'N/A', ai: 'N/A', be: 'Static HTML/CSS/JS', l: 'HTML/CSS/JS', gh: 'https://github.com/ananthakrishnan754/portfolio' }
        };
        const p = projects[name];
        if (!p) { appendOutput('Project not found. Try: memorycare, drone, robotarm, stm32, portfolio', '#ff5f56'); return; }
        appendHTML(`<div style="color:#ffbd2e;margin:8px 0">╔══════════════════════════════════════════╗
║   PROJECT: ${p.n.toUpperCase().padEnd(30)}║
╚══════════════════════════════════════════╝</div><div style="color:#aaa">  <span style="color:#27c93f">Description:</span>  ${p.d}
  <span style="color:#27c93f">Hardware:</span>     ${p.hw}
  <span style="color:#27c93f">AI/ML:</span>        ${p.ai}
  <span style="color:#27c93f">Backend:</span>      ${p.be}
  <span style="color:#27c93f">Language:</span>     ${p.l}
  <span style="color:#27c93f">GitHub:</span>       <a href="${p.gh}" style="color:#58a6ff;text-decoration:underline" target="_blank">${p.gh.replace('https://', '')}</a></div>`);
    }

    function cmdNeofetch() {
        appendHTML(`<div style="color:#aaa"><span style="color:#27c93f">        .--.        </span><span style="color:#fff;font-weight:bold">visitor@ananthakrishnan.dev</span>
<span style="color:#27c93f">       |o_o |       </span><span style="color:#27c93f">─────────────────────────────</span>
<span style="color:#27c93f">       |:_/ |       </span><span style="color:#27c93f">OS:</span> PortfolioOS v1.0
<span style="color:#27c93f">      //   \\ \\      </span><span style="color:#27c93f">Host:</span> Ananthakrishnan S
<span style="color:#27c93f">     (|     | )     </span><span style="color:#27c93f">Kernel:</span> ECE-2026
<span style="color:#27c93f">    /'\\_   _/\`\\    </span><span style="color:#27c93f">Uptime:</span> 21 years
<span style="color:#27c93f">    \\___)=(___/     </span><span style="color:#27c93f">Shell:</span> portfolio-bash 1.0
                    <span style="color:#27c93f">CPU:</span> Brain v2.0 @ ∞ GHz
                    <span style="color:#27c93f">Memory:</span> 1TB / ∞ TB</div>`);
    }

    function cmdLs() {
        appendHTML(`<div style="color:#aaa">  <span style="color:#58a6ff">projects/</span>  <span style="color:#58a6ff">skills/</span>   <span style="color:#58a6ff">games/</span>
  <span style="color:#27c93f">about.txt</span>  <span style="color:#27c93f">contact.txt</span>  <span style="color:#27c93f">resume.pdf</span>
  <span style="color:#27c93f">README.md</span>  <span style="color:#27c93f">.secrets</span></div>`);
    }

    function cmdSudoHireMe() {
        appendHTML(`<div style="color:#27c93f;margin:8px 0">  [sudo] password for visitor: ************
  <span style="color:#fff;font-weight:bold">✅ Access granted.</span>
  > Generating offer letter...
  > Downloading resume...
  <span style="color:#ffbd2e">📧 Resume downloaded! Check your downloads.</span>
  <span style="color:#666">Hint: This would be a great hire 😉</span></div>`);
        setTimeout(() => { const a = document.createElement('a'); a.href = 'AnanthakrishnanS_Resume (1).pdf'; a.download = 'AnanthakrishnanS_Resume.pdf'; a.click(); }, 1000);
    }

    function cmdCoffee() {
        appendHTML(`<div style="color:#aaa;margin:8px 0">  <span style="color:#ffbd2e">☕ Brewing coffee...</span>

      ( (
       ) )
    .______.
    |      |]
    \\      /
     \`----'

  <span style="color:#27c93f">Coffee is ready! ☕</span>
  <span style="color:#666">Now back to coding...</span></div>`);
    }

    function cmdPlay(g) {
        if (g === 'snake') startSnake();
        else if (g === 'tictactoe' || g === 'ttt') startTicTacToe();
        else if (g === 'connect4' || g === 'c4') startConnect4();
        else if (g === 'mario') startMario();
        else appendHTML(`<div style="color:#ffbd2e;margin:8px 0">Available Games:</div><div style="color:#aaa">  <span style="color:#27c93f">play snake</span>       🐍 Snake with AI Mode
  <span style="color:#27c93f">play mario</span>       🍄 Retro Platformer
  <span style="color:#27c93f">play tictactoe</span>   ❌ AI Tic-Tac-Toe
  <span style="color:#27c93f">play connect4</span>    🔴 Connect-4 vs AI</div>`);
    }

    // ==========================================
    // MARIO GAME
    // ==========================================
    function startMario() {
        currentGame = 'mario';
        document.getElementById('terminal-input-line').style.display = 'none';

        const isMobile = window.innerWidth <= 768;
        const gbOverlay = document.getElementById('gb-overlay');
        const gbScreen = document.getElementById('gb-screen-container');

        if (isMobile && gbOverlay && gbScreen) {
            gbScreen.innerHTML = '';
            gbScreen.appendChild(gameCanvas);
            gbOverlay.style.display = 'flex';
            gameCanvas.style.width = '100%';
            gameCanvas.style.height = '100%';
            gameCanvas.style.objectFit = 'contain';
            gameCanvas.style.margin = '0';
            gameCanvas.style.border = 'none';
        } else {
            document.getElementById('terminal-body').appendChild(gameCanvas);
            gameCanvas.style.width = 'auto';
            gameCanvas.style.height = 'auto';
            gameCanvas.style.margin = '10px auto';
            gameCanvas.style.border = '1px solid #333';
        }

        gameCanvas.style.display = 'block';
        const W = 400, H = 400;
        gameCanvas.width = W; gameCanvas.height = H;
        const ctx = gameCanvas.getContext('2d');

        let player = { x: 50, y: H - 40, w: 20, h: 20, vy: 0, color: '#e52521' };
        let gravity = 0.6, jumpPower = -11, isGrounded = true, score = 0, frames = 0;
        let obstacles = [], speed = 4, gameActive = true;

        appendOutput('🍄 Mario Runner! Press Space/Up/A to jump, Q/Esc to quit', '#ffbd2e');

        function update() {
            if (!gameActive) return;
            player.vy += gravity;
            player.y += player.vy;
            if (player.y >= H - 40) { player.y = H - 40; player.vy = 0; isGrounded = true; }

            if (frames % Math.max(40, 90 - Math.floor(frames / 100)) === 0) {
                obstacles.push({ x: W, y: H - 50, w: 25, h: 30, color: '#00aa00' });
            }
            if (frames > 500 && frames % 150 === 0) {
                obstacles.push({ x: W, y: H - 90, w: 20, h: 20, color: '#a05000' });
            }

            for (let i = obstacles.length - 1; i >= 0; i--) {
                let obs = obstacles[i];
                obs.x -= speed;

                if (player.x < obs.x + obs.w && player.x + player.w > obs.x &&
                    player.y < obs.y + obs.h && player.y + player.h > obs.y) {
                    gameActive = false;
                    appendOutput('Game Over! Score: ' + score, '#ff5f56');
                    setTimeout(stopMario, 2000);
                    return;
                }
                if (obs.x + obs.w < 0) { obstacles.splice(i, 1); score++; }
            }
            frames++;
            if (frames % 400 === 0) speed += 0.5;
        }

        function draw() {
            ctx.fillStyle = '#5c94fc'; ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#c84c0c'; ctx.fillRect(0, H - 20, W, 20);
            ctx.fillStyle = player.color; ctx.fillRect(player.x, player.y, player.w, player.h);
            obstacles.forEach(obs => { ctx.fillStyle = obs.color; ctx.fillRect(obs.x, obs.y, obs.w, obs.h); });
            ctx.fillStyle = '#ffffff'; ctx.font = '16px JetBrains Mono'; ctx.fillText('Score: ' + score, 10, 20);
            if (!gameActive) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, W, H);
                ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('GAME OVER', W / 2, H / 2); ctx.textAlign = 'left';
            }
        }

        function loop() {
            update(); draw();
            if (currentGame === 'mario' && gameActive) requestAnimationFrame(loop);
        }

        function marioKeyHandler(e) {
            if (currentGame !== 'mario') return;
            if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'a' || e.key === 'A') {
                if (isGrounded && gameActive) { player.vy = jumpPower; isGrounded = false; }
                e.preventDefault();
            }
            if (e.key === 'Escape' || e.key === 'q') stopMario();
        }
        document.addEventListener('keydown', marioKeyHandler);
        marioState.keyHandler = marioKeyHandler;
        loop();
    }

    function stopMario() {
        currentGame = null;
        gameCanvas.style.display = 'none';
        const gbOverlay = document.getElementById('gb-overlay');
        if (gbOverlay) gbOverlay.style.display = 'none';
        document.getElementById('terminal-body').appendChild(gameCanvas);
        document.getElementById('terminal-input-line').style.display = 'flex';
        if (marioState.keyHandler) document.removeEventListener('keydown', marioState.keyHandler);
        if (window.innerWidth > 768) termInput.focus();
    }

    // ==========================================
    // SNAKE GAME
    // ==========================================
    function startSnake() {
        currentGame = 'snake';
        document.getElementById('terminal-input-line').style.display = 'none';

        const isMobile = window.innerWidth <= 768;
        const gbOverlay = document.getElementById('gb-overlay');
        const gbScreen = document.getElementById('gb-screen-container');

        if (isMobile && gbOverlay && gbScreen) {
            gbScreen.innerHTML = '';
            gbScreen.appendChild(gameCanvas);
            gbOverlay.style.display = 'flex';
            gameCanvas.style.width = '100%';
            gameCanvas.style.height = '100%';
            gameCanvas.style.objectFit = 'contain';
            gameCanvas.style.margin = '0';
            gameCanvas.style.border = 'none';
        } else {
            document.getElementById('terminal-body').appendChild(gameCanvas);
            gameCanvas.style.width = 'auto';
            gameCanvas.style.height = 'auto';
            gameCanvas.style.margin = '10px auto';
            gameCanvas.style.border = '1px solid #333';
        }

        gameCanvas.style.display = 'block';
        const W = 400, H = 400, SZ = 20, cols = W / SZ, rows = H / SZ;
        gameCanvas.width = W; gameCanvas.height = H;
        const ctx = gameCanvas.getContext('2d');
        let snake = [{ x: 5, y: 5 }], dir = { x: 1, y: 0 }, nextDir = { x: 1, y: 0 }, food = placeFood(), score = 0, aiMode = false, speed = 180;
        appendOutput('🐍 Snake Game! Arrow keys to move, A=toggle AI, Q/Esc=quit', '#ffbd2e');

        function placeFood() {
            let f;
            do { f = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) }; }
            while (snake.some(s => s.x === f.x && s.y === f.y));
            return f;
        }

        function aStar() {
            const head = snake[0], goal = food;
            const key = p => p.x + ',' + p.y;
            const blocked = new Set(snake.map(s => key(s)));
            const open = [{ x: head.x, y: head.y, g: 0, f: 0, path: [] }];
            const closed = new Set();
            while (open.length) {
                open.sort((a, b) => a.f - b.f);
                const curr = open.shift();
                if (curr.x === goal.x && curr.y === goal.y) return curr.path.length ? curr.path[0] : dir;
                closed.add(key(curr));
                for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
                    const nx = curr.x + dx, ny = curr.y + dy;
                    if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
                    if (blocked.has(key({ x: nx, y: ny })) || closed.has(key({ x: nx, y: ny }))) continue;
                    const g = curr.g + 1, h = Math.abs(nx - goal.x) + Math.abs(ny - goal.y);
                    open.push({ x: nx, y: ny, g, f: g + h, path: [...curr.path, { x: dx, y: dy }] });
                }
            }
            return dir;
        }

        function update() {
            if (aiMode) dir = aStar();
            else dir = nextDir;

            const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
            if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(s => s.x === head.x && s.y === head.y)) {
                appendOutput('Game Over! Score: ' + score, '#ff5f56'); stopSnake(); return;
            }
            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) { score++; food = placeFood(); }
            else snake.pop();
        }

        function draw() {
            ctx.fillStyle = '#0d0d0d'; ctx.fillRect(0, 0, W, H);

            // Grid lines
            ctx.strokeStyle = '#1a1a1a';
            ctx.lineWidth = 1;
            for (let i = 0; i < cols; i++) {
                ctx.beginPath(); ctx.moveTo(i * SZ, 0); ctx.lineTo(i * SZ, H); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(0, i * SZ); ctx.lineTo(W, i * SZ); ctx.stroke();
            }

            ctx.fillStyle = '#ff5f56'; ctx.fillRect(food.x * SZ, food.y * SZ, SZ - 1, SZ - 1);
            snake.forEach((s, i) => { ctx.fillStyle = i === 0 ? '#27c93f' : '#00ff41'; ctx.fillRect(s.x * SZ, s.y * SZ, SZ - 1, SZ - 1); });
            ctx.fillStyle = '#aaa'; ctx.font = '14px JetBrains Mono';
            ctx.fillText('Score: ' + score + (aiMode ? ' [AI]' : ' [Manual]'), 8, H - 8);
        }

        function snakeKeyHandler(e) {
            if (currentGame !== 'snake') return;
            const dirs = { ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 }, ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 } };
            if (dirs[e.key] && !aiMode) {
                const d = dirs[e.key];
                if (d.x !== -dir.x || d.y !== -dir.y) nextDir = d;
                e.preventDefault();
            }
            if (e.key === 'a' || e.key === 'A') { aiMode = !aiMode; appendOutput(aiMode ? 'AI Mode ON' : 'Manual Mode', '#ffbd2e'); }
        }
        document.addEventListener('keydown', snakeKeyHandler);
        snakeState.keyHandler = snakeKeyHandler;

        gameInterval = setInterval(() => { update(); draw(); }, speed);
        draw();
    }

    function stopSnake() {
        clearInterval(gameInterval); gameInterval = null;
        currentGame = null;
        gameCanvas.style.display = 'none';

        const gbOverlay = document.getElementById('gb-overlay');
        if (gbOverlay) gbOverlay.style.display = 'none';

        // Put canvas back into terminal if it was moved
        document.getElementById('terminal-body').appendChild(gameCanvas);

        document.getElementById('terminal-input-line').style.display = 'flex';
        if (snakeState.keyHandler) document.removeEventListener('keydown', snakeState.keyHandler);

        if (window.innerWidth > 768) termInput.focus();
    }

    // ==========================================
    // TIC-TAC-TOE
    // ==========================================
    function startTicTacToe() {
        currentGame = 'tictactoe';
        tttState = { board: Array(9).fill(' '), player: 'X', diff: 'hard' };
        appendOutput('❌ Tic-Tac-Toe! You are X. Type 1-9 for position, Q to quit.', '#ffbd2e');
        appendOutput('Positions: 1|2|3 / 4|5|6 / 7|8|9', '#666');
        drawTTTBoard();
    }

    function drawTTTBoard() {
        const b = tttState.board;
        const colorCell = c => c === 'X' ? '<span style="color:#27c93f">X</span>' : c === 'O' ? '<span style="color:#ff5f56">O</span>' : ' ';
        appendHTML(`<div style="color:#aaa;font-family:'JetBrains Mono',monospace">   ${colorCell(b[0])} │ ${colorCell(b[1])} │ ${colorCell(b[2])}
  ───┼───┼───
   ${colorCell(b[3])} │ ${colorCell(b[4])} │ ${colorCell(b[5])}
  ───┼───┼───
   ${colorCell(b[6])} │ ${colorCell(b[7])} │ ${colorCell(b[8])}</div>`);
    }

    function checkWin(b, p) {
        const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        return wins.some(w => w.every(i => b[i] === p));
    }

    function minimax(b, isMax, depth) {
        if (checkWin(b, 'O')) return 10 - depth;
        if (checkWin(b, 'X')) return depth - 10;
        if (b.every(c => c !== ' ')) return 0;
        if (isMax) {
            let best = -Infinity;
            for (let i = 0; i < 9; i++) { if (b[i] === ' ') { b[i] = 'O'; best = Math.max(best, minimax(b, false, depth + 1)); b[i] = ' '; } }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < 9; i++) { if (b[i] === ' ') { b[i] = 'X'; best = Math.min(best, minimax(b, true, depth + 1)); b[i] = ' '; } }
            return best;
        }
    }

    function aiMoveTTT() {
        let bestScore = -Infinity, bestMove = -1;
        for (let i = 0; i < 9; i++) {
            if (tttState.board[i] === ' ') {
                tttState.board[i] = 'O';
                const score = minimax(tttState.board, false, 0);
                tttState.board[i] = ' ';
                if (score > bestScore) { bestScore = score; bestMove = i; }
            }
        }
        if (bestMove >= 0) tttState.board[bestMove] = 'O';
    }

    function handleTTTInput(e) {
        if (e.key === 'Enter') {
            const val = termInput.value.trim(); termInput.value = '';
            appendHTML('<div>' + P + '<span style="color:#fff">' + esc(val) + '</span></div>');
            if (val.toLowerCase() === 'q') { currentGame = null; appendOutput('Game ended.', '#ffbd2e'); return; }
            const pos = parseInt(val) - 1;
            if (isNaN(pos) || pos < 0 || pos > 8 || tttState.board[pos] !== ' ') { appendOutput('Invalid move. Try 1-9.', '#ff5f56'); return; }
            tttState.board[pos] = 'X';
            if (checkWin(tttState.board, 'X')) { drawTTTBoard(); appendOutput('🎉 You win!', '#27c93f'); currentGame = null; return; }
            if (tttState.board.every(c => c !== ' ')) { drawTTTBoard(); appendOutput('Draw!', '#ffbd2e'); currentGame = null; return; }
            aiMoveTTT();
            if (checkWin(tttState.board, 'O')) { drawTTTBoard(); appendOutput('🤖 AI wins!', '#ff5f56'); currentGame = null; return; }
            if (tttState.board.every(c => c !== ' ')) { drawTTTBoard(); appendOutput('Draw!', '#ffbd2e'); currentGame = null; return; }
            drawTTTBoard();
        }
    }

    // ==========================================
    // CONNECT-4
    // ==========================================
    function startConnect4() {
        currentGame = 'connect4';
        c4State = { board: Array.from({ length: 6 }, () => Array(7).fill(' ')), player: 'X' };
        appendOutput('🔴 Connect-4! You are 🔴. Type column 1-7, Q to quit.', '#ffbd2e');
        drawC4Board();
    }

    function drawC4Board() {
        const b = c4State.board;
        let s = '<div style="color:#aaa;font-family:\'JetBrains Mono\',monospace">  1   2   3   4   5   6   7\n';
        s += '┌───┬───┬───┬───┬───┬───┬───┐\n';
        for (let r = 0; r < 6; r++) {
            s += '│';
            for (let c = 0; c < 7; c++) {
                const cell = b[r][c];
                s += ' ' + (cell === 'X' ? '<span style="color:#ff5f56">●</span>' : cell === 'O' ? '<span style="color:#ffbd2e">●</span>' : '·') + ' │';
            }
            s += '\n';
            if (r < 5) s += '├───┼───┼───┼───┼───┼───┼───┤\n';
        }
        s += '└───┴───┴───┴───┴───┴───┴───┘</div>';
        appendHTML(s);
    }

    function dropPiece(col, piece) {
        for (let r = 5; r >= 0; r--) { if (c4State.board[r][col] === ' ') { c4State.board[r][col] = piece; return r; } }
        return -1;
    }

    function checkC4Win(b, p) {
        for (let r = 0; r < 6; r++)for (let c = 0; c < 7; c++) {
            if (c + 3 < 7 && [0, 1, 2, 3].every(i => b[r][c + i] === p)) return true;
            if (r + 3 < 6 && [0, 1, 2, 3].every(i => b[r + i][c] === p)) return true;
            if (r + 3 < 6 && c + 3 < 7 && [0, 1, 2, 3].every(i => b[r + i][c + i] === p)) return true;
            if (r + 3 < 6 && c - 3 >= 0 && [0, 1, 2, 3].every(i => b[r + i][c - i] === p)) return true;
        }
        return false;
    }

    function c4AIMove() {
        // Simple alpha-beta pruning
        function evaluate(b) {
            if (checkC4Win(b, 'O')) return 100;
            if (checkC4Win(b, 'X')) return -100;
            return 0;
        }
        function alphabeta(b, depth, alpha, beta, isMax) {
            const sc = evaluate(b);
            if (sc !== 0 || depth === 0 || b[0].every(c => c !== ' ')) return sc;
            if (isMax) {
                let val = -Infinity;
                for (let c = 0; c < 7; c++) {
                    let r = -1; for (let i = 5; i >= 0; i--) { if (b[i][c] === ' ') { r = i; break; } }
                    if (r === -1) continue;
                    b[r][c] = 'O'; val = Math.max(val, alphabeta(b, depth - 1, alpha, beta, false)); b[r][c] = ' ';
                    alpha = Math.max(alpha, val); if (beta <= alpha) break;
                }
                return val;
            } else {
                let val = Infinity;
                for (let c = 0; c < 7; c++) {
                    let r = -1; for (let i = 5; i >= 0; i--) { if (b[i][c] === ' ') { r = i; break; } }
                    if (r === -1) continue;
                    b[r][c] = 'X'; val = Math.min(val, alphabeta(b, depth - 1, alpha, beta, true)); b[r][c] = ' ';
                    beta = Math.min(beta, val); if (beta <= alpha) break;
                }
                return val;
            }
        }
        let bestScore = -Infinity, bestCol = 3;
        for (let c = 0; c < 7; c++) {
            let r = -1; for (let i = 5; i >= 0; i--) { if (c4State.board[i][c] === ' ') { r = i; break; } }
            if (r === -1) continue;
            c4State.board[r][c] = 'O';
            const score = alphabeta(c4State.board, 4, -Infinity, Infinity, false);
            c4State.board[r][c] = ' ';
            if (score > bestScore) { bestScore = score; bestCol = c; }
        }
        return bestCol;
    }

    function handleC4Input(e) {
        if (e.key === 'Enter') {
            const val = termInput.value.trim(); termInput.value = '';
            appendHTML('<div>' + P + '<span style="color:#fff">' + esc(val) + '</span></div>');
            if (val.toLowerCase() === 'q') { currentGame = null; appendOutput('Game ended.', '#ffbd2e'); return; }
            const col = parseInt(val) - 1;
            if (isNaN(col) || col < 0 || col > 6) { appendOutput('Invalid. Type 1-7.', '#ff5f56'); return; }
            if (dropPiece(col, 'X') === -1) { appendOutput('Column full!', '#ff5f56'); return; }
            if (checkC4Win(c4State.board, 'X')) { drawC4Board(); appendOutput('🎉 You win!', '#27c93f'); currentGame = null; return; }
            if (c4State.board[0].every(c => c !== ' ')) { drawC4Board(); appendOutput('Draw!', '#ffbd2e'); currentGame = null; return; }
            const aiCol = c4AIMove();
            dropPiece(aiCol, 'O');
            if (checkC4Win(c4State.board, 'O')) { drawC4Board(); appendOutput('🤖 AI wins!', '#ff5f56'); currentGame = null; return; }
            if (c4State.board[0].every(c => c !== ' ')) { drawC4Board(); appendOutput('Draw!', '#ffbd2e'); currentGame = null; return; }
            drawC4Board();
        }
    }

    // --- Trigger on scroll ---
    const terminalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !termStarted) {
                termStarted = true;
                startMatrixRain();
                terminalObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    terminalObserver.observe(termSection);
})();
