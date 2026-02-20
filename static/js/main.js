// Hollow Purple Animation Feature
const searchInput = document.getElementById('search-input');
if (searchInput) {
  searchInput.addEventListener('input', function() {
    const val = searchInput.value.trim().toLowerCase();
    if (val === 'gojo') {
      playHollowPurple();
    } else if (val === 'naruto') {
      playNarutoVsSasuke();
    } else if (val === 'stickman') {
      playStickmanFight();
    }
  });
// Stickman Fight Animation
function playStickmanFight() {
  if (document.querySelector('.stickman-fight-animation')) return;
  const overlay = document.createElement('div');
  overlay.className = 'stickman-fight-animation';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.zIndex = '9999';
  overlay.style.background = 'rgba(0,0,0,0.7)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.innerHTML = `
    <svg id="stickfight-svg" width="700" height="400" viewBox="0 0 700 400">
      <g id="stick1">
        <circle id="s1head" cx="180" cy="200" r="30" fill="#fff" stroke="#003366" stroke-width="4" />
        <line id="s1body" x1="180" y1="230" x2="180" y2="320" stroke="#003366" stroke-width="8" />
        <line id="s1armL" x1="180" y1="260" x2="140" y2="290" stroke="#003366" stroke-width="7" />
        <line id="s1armR" x1="180" y1="260" x2="220" y2="290" stroke="#003366" stroke-width="7" />
        <line id="s1legL" x1="180" y1="320" x2="150" y2="370" stroke="#003366" stroke-width="7" />
        <line id="s1legR" x1="180" y1="320" x2="210" y2="370" stroke="#003366" stroke-width="7" />
      </g>
      <g id="stick2">
        <circle id="s2head" cx="520" cy="200" r="30" fill="#fff" stroke="#003366" stroke-width="4" />
        <line id="s2body" x1="520" y1="230" x2="520" y2="320" stroke="#003366" stroke-width="8" />
        <line id="s2armL" x1="520" y1="260" x2="480" y2="290" stroke="#003366" stroke-width="7" />
        <line id="s2armR" x1="520" y1="260" x2="560" y2="290" stroke="#003366" stroke-width="7" />
        <line id="s2legL" x1="520" y1="320" x2="490" y2="370" stroke="#003366" stroke-width="7" />
        <line id="s2legR" x1="520" y1="320" x2="550" y2="370" stroke="#003366" stroke-width="7" />
      </g>
      <g id="stickEffects"></g>
    </svg>
    <div id="stickFightText" style="position:absolute;top:10%;left:50%;transform:translate(-50%,0);font-size:2em;color:#fff;font-family:monospace;opacity:0;">Stickman Fight!</div>
  `;
  document.body.appendChild(overlay);
  const svg = overlay.querySelector('#stickfight-svg');
  const stick1 = svg.querySelector('#stick1');
  const stick2 = svg.querySelector('#stick2');
  // Arms and legs
  const s1armL = svg.querySelector('#s1armL');
  const s1armR = svg.querySelector('#s1armR');
  const s1legL = svg.querySelector('#s1legL');
  const s1legR = svg.querySelector('#s1legR');
  const s2armL = svg.querySelector('#s2armL');
  const s2armR = svg.querySelector('#s2armR');
  const s2legL = svg.querySelector('#s2legL');
  const s2legR = svg.querySelector('#s2legR');
  const effects = svg.querySelector('#stickEffects');
  const text = overlay.querySelector('#stickFightText');
  let frame = 0;
  const totalFrames = 300; // 10 seconds at 30fps
  // Animation state variables
  let s1 = { x: 180, y: 0, angle: 0 };
  let s2 = { x: 520, y: 0, angle: 0 };
  let slowmo = false;
  let proj = { active: false, x: 0, y: 0, vx: 0, vy: 0 };
  let shake = 0;
  // Helper to set limbs for key poses
  function setLimbsKey(pose, isS1) {
    // pose: {armL, armR, legL, legR} in degrees
    function degToXY(baseX, baseY, len, deg) {
      let rad = deg * Math.PI / 180;
      return [baseX + len * Math.cos(rad), baseY + len * Math.sin(rad)];
    }
    let baseX = isS1 ? 180 : 520;
    let baseY = 230;
    let armLen = 60, legLen = 50;
    let [axL, ayL] = degToXY(baseX, baseY+30, armLen, pose.armL);
    let [axR, ayR] = degToXY(baseX, baseY+30, armLen, pose.armR);
    let [lxL, lyL] = degToXY(baseX, baseY+120, legLen, pose.legL);
    let [lxR, lyR] = degToXY(baseX, baseY+120, legLen, pose.legR);
    if (isS1) {
      s1armL.setAttribute('x2', axL); s1armL.setAttribute('y2', ayL);
      s1armR.setAttribute('x2', axR); s1armR.setAttribute('y2', ayR);
      s1legL.setAttribute('x2', lxL); s1legL.setAttribute('y2', lyL);
      s1legR.setAttribute('x2', lxR); s1legR.setAttribute('y2', lyR);
    } else {
      s2armL.setAttribute('x2', axL); s2armL.setAttribute('y2', ayL);
      s2armR.setAttribute('x2', axR); s2armR.setAttribute('y2', ayR);
      s2legL.setAttribute('x2', lxL); s2legL.setAttribute('y2', lyL);
      s2legR.setAttribute('x2', lxR); s2legR.setAttribute('y2', lyR);
    }
  }
  function animateStickFight() {
    let slowFrame = (slowmo && frame < 200) ? (frame/2) : frame;
    // Screen shake effect
    if (shake > 0) {
      overlay.style.transform = `translate(${(Math.random()-0.5)*shake}px, ${(Math.random()-0.5)*shake}px)`;
      shake -= 1.5;
    } else {
      overlay.style.transform = '';
    }
    // 1. Approach (Naruto run)
    if (frame < 30) {
      s1.x += 6; s2.x -= 6;
      setLimbsKey({armL: 200, armR: 340, legL: 120 + 10*Math.sin(frame/4), legR: 60 - 10*Math.sin(frame/4)}, true);
      setLimbsKey({armL: 160, armR: 20, legL: 60 + 10*Math.sin(frame/4), legR: 120 - 10*Math.sin(frame/4)}, false);
      stick1.setAttribute('transform', `translate(${s1.x-180},0)`);
      stick2.setAttribute('transform', `translate(${s2.x-520},0)`);
      text.style.opacity = Math.min(1, frame/10);
    // 2. Feint, block, and first exchange
    } else if (frame < 70) {
      let t = frame-30;
      if (t < 10) {
        // Stick1 feints a punch, Stick2 blocks
        setLimbsKey({armL: 120, armR: 30 + t*3, legL: 60, legR: 0}, true); // right arm winds up
        setLimbsKey({armL: 180, armR: 20, legL: 60, legR: 120}, false); // left arm up (block)
      } else if (t < 20) {
        // Stick1 punches, Stick2 blocks
        setLimbsKey({armL: 120, armR: 60 + (t-10)*6, legL: 60, legR: 0}, true); // right arm extends
        setLimbsKey({armL: 180, armR: 20, legL: 60, legR: 120}, false); // block
      } else if (t < 30) {
        // Stick2 counters with a low kick, Stick1 blocks
        setLimbsKey({armL: 120, armR: 120, legL: 60, legR: 0}, true); // both arms up
        setLimbsKey({armL: 180, armR: 20, legL: 60 + (t-20)*3, legR: 120 - (t-20)*3}, false); // left leg kicks
      } else {
        // Both reset
        setLimbsKey({armL: 120, armR: 60, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 60, armR: 120, legL: 0, legR: 60}, false);
      }
      stick1.setAttribute('transform', `translate(${s1.x-180},0)`);
      stick2.setAttribute('transform', `translate(${s2.x-520},0)`);
      effects.innerHTML = '';
    // 3. Combo exchange (punch, block, counter, dodge)
    } else if (frame < 120) {
      let t = frame-70;
      if (t < 10) {
        // Stick1 jabs, Stick2 blocks
        setLimbsKey({armL: 120, armR: 90 + t*3, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 180, armR: 20, legL: 60, legR: 120}, false);
      } else if (t < 20) {
        // Stick2 ducks, Stick1 misses
        setLimbsKey({armL: 120, armR: 120, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 180, armR: 20, legL: 60, legR: 120}, false);
        stick2.setAttribute('transform', `translate(${s2.x-520},10)`);
      } else if (t < 30) {
        // Stick2 counters with uppercut, Stick1 blocks
        setLimbsKey({armL: 120, armR: 120, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 60 + (t-20)*6, armR: 20, legL: 60, legR: 120}, false);
      } else if (t < 40) {
        // Stick1 dodges back
        setLimbsKey({armL: 120, armR: 120, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 120, armR: 20, legL: 60, legR: 120}, false);
        stick1.setAttribute('transform', `translate(${s1.x-180},-10)`);
      } else {
        setLimbsKey({armL: 120, armR: 60, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 60, armR: 120, legL: 0, legR: 60}, false);
      }
      if (t >= 20) stick2.setAttribute('transform', `translate(${s2.x-520},0)`);
      if (t >= 40) stick1.setAttribute('transform', `translate(${s1.x-180},0)`);
      effects.innerHTML = '';
    // 4. Grapple, throw, and recovery
    } else if (frame < 180) {
      let t = frame-120;
      if (t < 10) {
        // Stick2 grabs Stick1's arm
        setLimbsKey({armL: 120, armR: 60, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 90, armR: 60, legL: 60, legR: 120}, false);
      } else if (t < 20) {
        // Stick2 throws Stick1
        setLimbsKey({armL: 120, armR: 60, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 90, armR: 60, legL: 60, legR: 120}, false);
        stick1.setAttribute('transform', `translate(${s1.x-180},${(t-10)*-6}) rotate(${(t-10)*8},180,260)`);
      } else if (t < 30) {
        // Stick1 lands, recovers
        setLimbsKey({armL: 120, armR: 60, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 90, armR: 60, legL: 60, legR: 120}, false);
        stick1.setAttribute('transform', `translate(${s1.x-180},${(20-t)*2})`);
      } else {
        setLimbsKey({armL: 120, armR: 60, legL: 60, legR: 0}, true);
        setLimbsKey({armL: 90, armR: 60, legL: 60, legR: 120}, false);
        stick1.setAttribute('transform', `translate(${s1.x-180},0)`);
      }
      effects.innerHTML = '';
    // 5. Projectiles and slow motion
    } else if (frame < 240) {
      let t = frame-180;
      if (!proj.active && t === 2) {
        proj.active = true;
        proj.x = s1.x+20; proj.y = 260; proj.vx = 8; proj.vy = -4;
        text.textContent = 'Stickman launches energy!';
        text.style.opacity = 1;
        setLimbsKey({armL: 120, armR: 0, legL: 60, legR: 0}, true); // right arm forward
      }
      if (proj.active) {
        proj.x += proj.vx; proj.y += proj.vy; proj.vy += 0.5;
        effects.innerHTML = `<circle cx="${proj.x}" cy="${proj.y}" r="18" fill="#fff" stroke="#003366" stroke-width="4" />`;
        // Hit detection
        if (proj.x > s2.x-20 && proj.y > 230 && proj.y < 320) {
          proj.active = false;
          shake = 18;
          effects.innerHTML += `<circle cx="${s2.x}" cy="260" r="40" fill="#003366" opacity="0.5" />`;
          text.textContent = 'Direct Hit!';
          setLimbsKey({armL: 180, armR: 20, legL: 60, legR: 120}, false); // left arm block
        }
      }
      setLimbsKey({armL: 120, armR: 0, legL: 60, legR: 0}, true);
      setLimbsKey({armL: 180, armR: 20, legL: 60, legR: 120}, false);
      stick1.setAttribute('transform', `translate(${s1.x-180},0)`);
      stick2.setAttribute('transform', `translate(${s2.x-520},0)`);
    // 6. Final clash and aftermath
    } else if (frame < 280) {
      let t = frame-240;
      if (t === 0) {
        text.textContent = 'FINAL CLASH!';
        text.style.opacity = 1;
        shake = 22;
      }
      s1.x += 2; s2.x -= 2;
      setLimbsKey({armL: 90, armR: 90, legL: 60, legR: 120}, true);
      setLimbsKey({armL: 90, armR: 90, legL: 120, legR: 60}, false);
      stick1.setAttribute('transform', `translate(${s1.x-180},0)`);
      stick2.setAttribute('transform', `translate(${s2.x-520},0)`);
      effects.innerHTML = `<circle cx="350" cy="260" r="${40+t*1.2}" fill="#003366" opacity="${1-t/40}" />`;
    // 7. Winner jumps, fires, explosion, victory, dance
    } else if (frame < 320) {
      let t = frame-280;
      // Winner: stick1, Loser: stick2
      if (t < 10) {
        // stick1 crouch, prep jump
        setLimbsKey({armL: 120, armR: 60, legL: 120, legR: 60}, true);
        setLimbsKey({armL: 90, armR: 90, legL: 120, legR: 60}, false);
        stick1.setAttribute('transform', `translate(${s1.x-180},${t*2})`);
        stick2.setAttribute('transform', `translate(${s2.x-520},0)`);
      } else if (t < 30) {
        // stick1 jumps much higher
        setLimbsKey({armL: 60, armR: 120, legL: 60, legR: 120}, true);
        setLimbsKey({armL: 90, armR: 90, legL: 120, legR: 60}, false);
        // Parabolic jump: peak at t=20, height -120
        let jumpT = t-10;
        let jumpY = -0.6 * (jumpT-10)*(jumpT-10) + 0;
        stick1.setAttribute('transform', `translate(${s1.x-180},${jumpY})`);
        stick2.setAttribute('transform', `translate(${s2.x-520},0)`);
      } else if (t < 40) {
        // stick1 in air, arms forward (charge ultimate)
        setLimbsKey({armL: 60, armR: 0, legL: 60, legR: 120}, true);
        setLimbsKey({armL: 90, armR: 90, legL: 120, legR: 60}, false);
        stick1.setAttribute('transform', `translate(${s1.x-180},-60)`);
        stick2.setAttribute('transform', `translate(${s2.x-520},0)`);
        // Charge up: glowing sphere grows
        let chargeR = 18 + (t-30)*6;
        let chargeColor = t < 35 ? 'rgba(120,0,255,0.7)' : 'rgba(255,0,255,0.9)';
        effects.innerHTML = `<circle cx="${s1.x+40}" cy="200" r="${chargeR}" fill="${chargeColor}" stroke="#fff" stroke-width="6" />`;
        // Crackle effect
        if (t >= 35) {
          for (let i=0; i<8; ++i) {
            let angle = Math.PI*2*i/8 + Math.random();
            let x1 = s1.x+40 + Math.cos(angle)*chargeR;
            let y1 = 200 + Math.sin(angle)*chargeR;
            let x2 = s1.x+40 + Math.cos(angle)*(chargeR+18+Math.random()*10);
            let y2 = 200 + Math.sin(angle)*(chargeR+18+Math.random()*10);
            effects.innerHTML += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="3" />`;
          }
        }
      } else if (t < 50) {
        // stick1 fires ultimate attack (Hollow Purple style)
        setLimbsKey({armL: 60, armR: 0, legL: 60, legR: 120}, true);
        setLimbsKey({armL: 180, armR: 180, legL: 180, legR: 180}, false); // ragdoll
        stick1.setAttribute('transform', `translate(${s1.x-180},-60)`);
        // Massive beam
        let beamX = s1.x+40 + (t-40)*22;
        let beamW = 40 + (t-40)*18;
        effects.innerHTML = `<rect x="${s1.x+40}" y="180" width="${beamX-s1.x-40}" height="40" fill="url(#purpleGradient)" opacity="0.85" />`;
        // Add SVG gradient if not present
        if (!document.getElementById('purpleGradient')) {
          let svg = document.getElementById('stickfight-svg');
          if (svg) {
            let grad = document.createElementNS('http://www.w3.org/2000/svg','linearGradient');
            grad.setAttribute('id','purpleGradient');
            grad.setAttribute('x1','0%'); grad.setAttribute('x2','100%');
            grad.setAttribute('y1','0%'); grad.setAttribute('y2','0%');
            grad.innerHTML = '<stop offset="0%" stop-color="#fff"/><stop offset="50%" stop-color="#a0f"/><stop offset="100%" stop-color="#003366"/>';
            svg.appendChild(grad);
          }
        }
        // Destroy stick2 if hit
        if (beamX > s2.x-10) {
          effects.innerHTML += `<circle cx="${s2.x}" cy="230" r="120" fill="#a0f" opacity="0.8" />`;
          stick2.setAttribute('transform', `translate(${s2.x-520},${(t-40)*2}) scale(${1-Math.min(1,(t-40)/8)})`);
        } else {
          stick2.setAttribute('transform', `translate(${s2.x-520},0)`);
        }
      } else if (t < 60) {
        // stick1 falls
        setLimbsKey({armL: 60, armR: 0, legL: 60, legR: 120}, true);
        stick1.setAttribute('transform', `translate(${s1.x-180},${(t-50)*2-60})`);
        stick2.setAttribute('transform', `translate(${s2.x-520},80) scale(0)`);
        effects.innerHTML = '';
      } else if (t < 60) {
        // stick1 lands, victory text
        setLimbsKey({armL: 60, armR: 0, legL: 60, legR: 120}, true);
        stick1.setAttribute('transform', `translate(${s1.x-180},0)`);
        stick2.setAttribute('transform', `translate(${s2.x-520},80) scale(0)`);
        effects.innerHTML = '';
        text.textContent = 'VICTORY!';
        text.style.opacity = 1;
      } else {
        // stick1 dance (alternate arms/legs)
        let dance = t-60;
        let armL = 60 + 40*Math.sin(dance/4);
        let armR = 0 + 40*Math.cos(dance/4);
        let legL = 60 + 30*Math.cos(dance/4);
        let legR = 120 + 30*Math.sin(dance/4);
        setLimbsKey({armL, armR, legL, legR}, true);
        stick1.setAttribute('transform', `translate(${s1.x-180},0)`);
        stick2.setAttribute('transform', `translate(${s2.x-520},80) scale(0)`);
        effects.innerHTML = '';
        text.textContent = 'VICTORY!';
        text.style.opacity = 1;
      }
    } else if (frame < totalFrames) {
      overlay.style.opacity = 1 - ((frame-320)/20);
    }
    frame++;
    if (slowmo && frame % 2 === 1 && frame < 120) {
      // Slow motion: skip every other frame
      return setTimeout(animateStickFight, 32);
    }
    if (frame <= totalFrames) {
      requestAnimationFrame(animateStickFight);
    } else {
      setTimeout(() => {
        overlay.style.opacity = 0;
        setTimeout(() => overlay.remove(), 1000);
      }, 1000);
    }
  }
  animateStickFight();
}
}

function playNarutoVsSasuke() {
  if (document.querySelector('.naruto-sasuke-animation')) return;
  const overlay = document.createElement('div');
  overlay.className = 'naruto-sasuke-animation';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.zIndex = '9999';
  overlay.style.background = 'rgba(20,20,40,0.7)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.innerHTML = `
    <svg id="narutoSasukeSVG" width="700" height="400" viewBox="0 0 700 400">
      <g id="naruto">
        <circle cx="150" cy="300" r="40" fill="#ffe066" /> <!-- head -->
        <rect x="130" y="340" width="40" height="80" fill="#ff9900" /> <!-- body -->
        <line x1="150" y1="380" x2="150" y2="400" stroke="#222" stroke-width="6" /> <!-- leg -->
        <line x1="170" y1="360" x2="200" y2="380" stroke="#222" stroke-width="6" /> <!-- arm -->
        <line x1="130" y1="360" x2="100" y2="380" stroke="#222" stroke-width="6" /> <!-- arm -->
        <!-- Naruto hair: more spikes -->
        <polygon points="150,260 140,280 160,280" fill="#ffe066" />
        <polygon points="140,265 135,285 145,285" fill="#ffe066" />
        <polygon points="160,265 155,285 165,285" fill="#ffe066" />
        <polygon points="155,255 150,275 160,275" fill="#ffe066" />
        <polygon points="145,250 140,270 150,270" fill="#ffe066" />
        <polygon points="165,250 160,270 170,270" fill="#ffe066" />
        <!-- Naruto headband -->
        <rect x="135" y="285" width="30" height="8" fill="#b0b0b0" />
        <circle cx="150" cy="289" r="4" fill="#222" /> <!-- leaf symbol -->
        <!-- Naruto face details -->
        <ellipse cx="140" cy="310" rx="3" ry="2" fill="#222" />
        <ellipse cx="160" cy="310" rx="3" ry="2" fill="#222" />
        <rect x="145" y="320" width="10" height="3" fill="#222" /> <!-- mouth -->
        <line x1="135" y1="315" x2="145" y2="315" stroke="#222" stroke-width="2" /> <!-- whisker -->
        <line x1="155" y1="315" x2="165" y2="315" stroke="#222" stroke-width="2" /> <!-- whisker -->
      </g>
      <g id="sasuke">
        <circle cx="550" cy="300" r="40" fill="#b0b0ff" /> <!-- head -->
        <rect x="530" y="340" width="40" height="80" fill="#2222ff" /> <!-- body -->
        <line x1="550" y1="380" x2="550" y2="400" stroke="#222" stroke-width="6" /> <!-- leg -->
        <line x1="570" y1="360" x2="600" y2="380" stroke="#222" stroke-width="6" /> <!-- arm -->
        <line x1="530" y1="360" x2="500" y2="380" stroke="#222" stroke-width="6" /> <!-- arm -->
        <!-- Sasuke hair: more spikes -->
        <polygon points="550,260 540,280 560,280" fill="#222" />
        <polygon points="540,265 535,285 545,285" fill="#222" />
        <polygon points="560,265 555,285 565,285" fill="#222" />
        <polygon points="555,255 550,275 560,275" fill="#222" />
        <polygon points="545,250 540,270 550,270" fill="#222" />
        <polygon points="565,250 560,270 570,270" fill="#222" />
        <!-- Sasuke headband -->
        <rect x="535" y="285" width="30" height="8" fill="#b0b0b0" />
        <ellipse cx="550" cy="289" rx="4" ry="3" fill="#222" /> <!-- Uchiha symbol -->
        <!-- Sasuke face details -->
        <ellipse cx="540" cy="310" rx="3" ry="2" fill="#222" />
        <ellipse cx="560" cy="310" rx="3" ry="2" fill="#222" />
        <rect x="545" y="320" width="10" height="3" fill="#222" /> <!-- mouth -->
      </g>
      <g id="effects"></g>
    </svg>
    <div id="fightText" style="position:absolute;top:10%;left:50%;transform:translate(-50%,0);font-size:2em;color:#fff;font-family:monospace;opacity:0;">Naruto vs Sasuke</div>
  `;
  document.body.appendChild(overlay);
  const svg = overlay.querySelector('#narutoSasukeSVG');
  const naruto = svg.querySelector('#naruto');
  const sasuke = svg.querySelector('#sasuke');
  const effects = svg.querySelector('#effects');
  const text = overlay.querySelector('#fightText');
  let frame = 0;
  const totalFrames = 220;
  function animateFight() {
    // Naruto and Sasuke move toward each other
    if (frame < 60) {
      naruto.setAttribute('transform', `translate(${frame},0)`);
      sasuke.setAttribute('transform', `translate(${-frame},0)`);
      text.style.opacity = Math.min(1, frame/30);
    } else if (frame < 120) {
      // Arms swing, effects build up
      naruto.setAttribute('transform', `translate(60,0) rotate(${frame-60},150,340)`);
      sasuke.setAttribute('transform', `translate(-60,0) rotate(${-frame+60},550,340)`);
      // Rasengan and Chidori charge
      effects.innerHTML = `
        <circle cx="200" cy="380" r="18" fill="#aaf" opacity="${(frame-60)/60}" />
        <circle cx="600" cy="380" r="18" fill="#fff" opacity="${(frame-60)/60}" />
        <polyline points="600,380 620,370 610,390 630,380" stroke="#00f" stroke-width="4" fill="none" opacity="${(frame-60)/60}" />
      `;
    } else if (frame < 180) {
      // Clash: Naruto and Sasuke hit each other with Rasengan and Chidori
      naruto.setAttribute('transform', `translate(120,0)`);
      sasuke.setAttribute('transform', `translate(-120,0)`);
      effects.innerHTML = `
        <circle cx="400" cy="340" r="40" fill="#aaf" opacity="0.7" />
        <circle cx="400" cy="340" r="40" fill="#fff" opacity="0.5" />
        <polyline points="400,340 420,330 410,350 430,340" stroke="#00f" stroke-width="6" fill="none" opacity="0.8" />
        <circle cx="320" cy="380" r="18" fill="#aaf" opacity="1" /> <!-- Naruto's Rasengan -->
        <circle cx="480" cy="380" r="18" fill="#fff" opacity="1" /> <!-- Sasuke's Chidori -->
        <polyline points="480,380 500,370 490,390 510,380" stroke="#00f" stroke-width="4" fill="none" opacity="1" /> <!-- Chidori lightning -->
      `;
      text.textContent = 'Naruto vs Sasuke!';
      text.style.opacity = 1;
    } else if (frame < totalFrames) {
      // Aftermath: fade out
      overlay.style.opacity = 1 - ((frame-180)/40);
    }
    frame++;
    if (frame <= totalFrames) {
      requestAnimationFrame(animateFight);
    } else {
      setTimeout(() => {
        overlay.style.opacity = 0;
        setTimeout(() => overlay.remove(), 1200);
      }, 1200);
    }
  }
  animateFight();
}

function playHollowPurple() {
  if (document.querySelector('.hollow-purple-animation')) return;
  // Play Hollow Purple voice line
  const audio = document.createElement('audio');
  audio.src = '/static/audio/hollow-purple.mp3';
  audio.volume = 0.8;
  audio.play();
  const overlay = document.createElement('div');
  overlay.className = 'hollow-purple-animation';
  overlay.innerHTML = `
    <div style="position:absolute;top:0;left:0;width:100vw;height:100vh;z-index:0;display:flex;align-items:center;justify-content:center;">
      <svg width="520" height="420" viewBox="0 0 520 420" style="opacity:0.22;">
        <!-- Gojo drawing: stylized hair, cloak, hand, purple energy -->
        <ellipse cx="260" cy="110" rx="80" ry="50" fill="#bfcfff" stroke="#222" stroke-width="2" /> <!-- hair -->
        <rect x="180" y="160" width="160" height="80" rx="30" fill="#222" opacity="0.7" /> <!-- cloak -->
        <ellipse cx="260" cy="220" rx="30" ry="18" fill="#fff" opacity="0.7" /> <!-- face -->
        <rect x="240" y="210" width="40" height="10" fill="#bfcfff" opacity="0.7" /> <!-- band -->
        <ellipse cx="260" cy="250" rx="18" ry="8" fill="#fff" opacity="0.7" /> <!-- hand -->
        <circle cx="260" cy="250" r="22" fill="#a259ff" opacity="0.5" /> <!-- hollow purple energy -->
        <circle cx="260" cy="250" r="12" fill="#fff" opacity="0.7" />
        <ellipse cx="260" cy="250" rx="8" ry="4" fill="#a259ff" opacity="0.7" />
        <ellipse cx="260" cy="250" rx="16" ry="8" fill="#a259ff" opacity="0.3" />
      </svg>
    </div>
    <svg id="hollowPurpleSVG" width="500" height="400" viewBox="0 0 500 400" style="position:relative;z-index:1;">
      <circle id="blueHollow" cx="120" cy="200" r="60" fill="url(#blueGlow)" />
      <circle id="redHollow" cx="380" cy="200" r="60" fill="url(#redGlow)" />
      <defs>
        <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" />
          <stop offset="60%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#011627" />
        </radialGradient>
        <radialGradient id="redGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" />
          <stop offset="60%" stop-color="#ef4444" />
          <stop offset="100%" stop-color="#011627" />
        </radialGradient>
        <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" />
          <stop offset="60%" stop-color="#a259ff" />
          <stop offset="100%" stop-color="#011627" />
        </radialGradient>
      </defs>
    </svg>
    <div id="hollowPurpleText" style="position:absolute;top:60%;left:50%;transform:translate(-50%,-50%);font-size:2em;color:#fff;font-family:monospace;opacity:0;">Hollow Purple</div>
  `;
  document.body.appendChild(overlay);

  // Animate blue and red hollows moving together
  const svg = overlay.querySelector('#hollowPurpleSVG');
  const blue = svg.querySelector('#blueHollow');
  const red = svg.querySelector('#redHollow');
  const text = overlay.querySelector('#hollowPurpleText');

  let frame = 0;
  const totalFrames = 180; // even slower, more cinematic
  const smashFrames = 90;  // much slower approach
  const explodeFrames = 90; // longer explosion
  let exploded = false;

  let spinAngle = 0;
  let particles = [];
  let shockwaveFrame = 0;
  function createParticles(cx, cy, color) {
    for (let i = 0; i < 24; i++) {
      particles.push({
        x: cx,
        y: cy,
        angle: (Math.PI * 2 * i) / 24,
        speed: 2 + Math.random() * 2,
        color: color,
        life: 30,
        r: 4 + Math.random() * 3
      });
    }
  }
  function drawParticles() {
    const particleLayer = svg.querySelector('#particleLayer');
    if (particleLayer) particleLayer.innerHTML = '';
    else {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('id', 'particleLayer');
      svg.appendChild(g);
    }
    particles.forEach(p => {
      if (p.life > 0) {
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed;
        p.life--;
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', p.x);
        circle.setAttribute('cy', p.y);
        circle.setAttribute('r', p.r);
        circle.setAttribute('fill', p.color);
        circle.setAttribute('opacity', p.life / 30);
        svg.querySelector('#particleLayer').appendChild(circle);
      }
    });
    particles = particles.filter(p => p.life > 0);
  }
  function drawShockwave() {
    let sw = svg.querySelector('#shockwave');
    if (!sw) {
      sw = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      sw.setAttribute('id', 'shockwave');
      svg.appendChild(sw);
    }
    sw.setAttribute('cx', 250);
    sw.setAttribute('cy', 200);
    sw.setAttribute('r', 0 + 2 * shockwaveFrame);
    sw.setAttribute('stroke', '#a259ff');
    sw.setAttribute('stroke-width', 8);
    sw.setAttribute('fill', 'none');
    sw.setAttribute('opacity', 1 - shockwaveFrame / 20);
  }
  function animate() {
    if (frame < smashFrames) {
      // Move blue and red hollows toward center
      const blueX = 120 + (200 - 120) * (frame / smashFrames);
      const redX = 380 - (380 - 300) * (frame / smashFrames);
      blue.setAttribute('cx', blueX);
      red.setAttribute('cx', redX);
      // Glow build-up
      blue.setAttribute('r', 60 + 10 * Math.sin(frame / smashFrames * Math.PI));
      red.setAttribute('r', 60 + 10 * Math.sin(frame / smashFrames * Math.PI));
      if (frame % 4 === 0) {
        createParticles(blueX, 200, '#3b82f6');
        createParticles(redX, 200, '#ef4444');
      }
      drawParticles();
    } else if (frame === smashFrames && !exploded) {
      // Replace with purple explosion
      blue.setAttribute('r', 0);
      red.setAttribute('r', 0);
      const purple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      purple.setAttribute('cx', 250);
      purple.setAttribute('cy', 200);
      purple.setAttribute('r', 60);
      purple.setAttribute('fill', 'url(#purpleGlow)');
      purple.setAttribute('id', 'purpleExplosion');
      svg.appendChild(purple);
      exploded = true;
      // Shockwave
      shockwaveFrame = 0;
      overlay.style.animation = 'shake 0.4s';
    } else if (frame > smashFrames && frame <= totalFrames) {
      // Animate purple explosion growing and spinning
      const purple = svg.querySelector('#purpleExplosion');
      if (purple) {
        const grow = 60 + 120 * ((frame-smashFrames)/explodeFrames);
        purple.setAttribute('r', grow);
        purple.setAttribute('opacity', 1 - ((frame-smashFrames)/explodeFrames));
        spinAngle += 12;
        svg.style.transform = `rotate(${spinAngle}deg)`;
      }
      if (shockwaveFrame < 20) {
        drawShockwave();
        shockwaveFrame++;
      }
      if (frame === totalFrames) {
        text.style.opacity = 1;
        svg.style.transform = 'rotate(0deg)';
      }
    }
    frame++;
    if (frame <= totalFrames) {
      requestAnimationFrame(animate);
    } else {
      setTimeout(() => {
        overlay.style.opacity = 0;
        setTimeout(() => overlay.remove(), 1200);
      }, 1200);
    }
  }
  animate();
}
// simple fade-in on scroll
 document.addEventListener('DOMContentLoaded', () => {
   const faders = document.querySelectorAll('.fade-in');
   // Fallback: reveal all fade-in elements immediately
   faders.forEach(fader => fader.classList.add('appear'));
   // IntersectionObserver for incremental reveal
   const options = { threshold: 0.1 };
   const appearOnScroll = new IntersectionObserver((entries, observer) => {
     entries.forEach(entry => {
       if (!entry.isIntersecting) return;
       entry.target.classList.add('appear');
       observer.unobserve(entry.target);
     });
   }, options);
   faders.forEach(fader => {
     appearOnScroll.observe(fader);
   });
   // dropdown menu toggle
   const menuToggle = document.getElementById('menu-toggle');
   const nav = document.getElementById('main-nav');
   if(menuToggle && nav){
     menuToggle.addEventListener('click', ()=>{
       nav.classList.toggle('hidden');
     });
   }
   // incremental reveal of blog posts on scroll
   const posts = document.querySelectorAll('.post-card');
   let shown = 3;
   posts.forEach((p,i)=>{ if(i>=shown) p.style.display='none'; });
   window.addEventListener('scroll', () => {
     if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 50){
       if(shown < posts.length){
         posts[shown].style.display='block';
         shown++;
       }
     }
   });

   const photoPostForms = document.querySelectorAll('form[data-photo-post-form="true"]');
   photoPostForms.forEach((form) => {
     const fileInput = form.querySelector('input[type="file"]');
     const postButton = form.querySelector('button.reveal-on-file');
     if (!(fileInput instanceof HTMLInputElement) || !(postButton instanceof HTMLButtonElement)) {
       return;
     }

     const updatePostButtonState = () => {
       if (fileInput.files && fileInput.files.length > 0) {
         postButton.classList.add('is-ready');
         postButton.disabled = false;
       } else {
         postButton.classList.remove('is-ready');
         postButton.disabled = true;
       }
     };

     updatePostButtonState();
     fileInput.addEventListener('change', updatePostButtonState);
   });
 });

  function showThemedConfirm(message) {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';

      const modal = document.createElement('div');
      modal.className = 'confirm-modal';

      const text = document.createElement('p');
      text.textContent = message;

      const actions = document.createElement('div');
      actions.className = 'confirm-actions';

      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'upload-btn';
      cancelButton.textContent = 'Cancel';

      const confirmButton = document.createElement('button');
      confirmButton.type = 'button';
      confirmButton.className = 'upload-btn';
      confirmButton.textContent = 'Confirm';

      actions.appendChild(cancelButton);
      actions.appendChild(confirmButton);
      modal.appendChild(text);
      modal.appendChild(actions);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      const cleanup = (result) => {
        overlay.remove();
        resolve(result);
      };

      cancelButton.addEventListener('click', () => cleanup(false));
      confirmButton.addEventListener('click', () => cleanup(true));
      overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
          cleanup(false);
        }
      });
    });
  }

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || form.dataset.doubleConfirm !== 'true') {
      return;
    }

    if (form.dataset.confirmedSubmit === 'true') {
      form.dataset.confirmedSubmit = 'false';
      return;
    }

    event.preventDefault();
    (async () => {
      const firstConfirm = await showThemedConfirm('Delete this photo?');
      if (!firstConfirm) {
        return;
      }
      const secondConfirm = await showThemedConfirm('Are you sure? This cannot be undone.');
      if (!secondConfirm) {
        return;
      }
      form.dataset.confirmedSubmit = 'true';
      form.submit();
    })();
  });