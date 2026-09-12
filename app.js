/* ==========================================
   GTA VICE CITY PORTFOLIO INTERACTIVE ENGINE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // App Global State
  let soundEnabled = true;
  let crtEnabled = true;
  let currentCash = 425000;
  let wantedLevel = 3;
  let radioPlaying = false;
  let radioInterval = null;

  // Auto-play Video Background Handler
  const heroVideo = document.getElementById('hero-ascii-video') || document.getElementById('hero-video');
  if (heroVideo) {
    heroVideo.play().catch(err => {
      console.log('Autoplay restriction handled:', err);
    });
    document.addEventListener('click', () => {
      if (heroVideo.paused) heroVideo.play().catch(() => {});
    }, { once: true });
  }

  // 21st.dev Ultramarine ASCII Art Effect Canvas Engine
  function initUltramarineAsciiCanvas() {
    const canvas = document.getElementById('ultramarine-ascii-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    let height = canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;

    const chars = ['+', '×', '#', '@', '*', '░', '▒', '▓', ':', '.', '%', '✦', '▪'];
    const colors = [
      '#0033FF', // Ultramarine Blue
      '#00FFFF', // Ocean Cyan
      '#FF3399', // Sunset Pink
      '#9900FF', // Deep Purple
      '#0066FF'  // Electric Blue
    ];

    const fontSize = 14;

    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    window.addEventListener('resize', () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    });

    let time = 0;

    function render() {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);
      ctx.font = `700 ${fontSize}px "Press Start 2P", monospace, Courier`;

      const currentCols = Math.ceil(width / fontSize);
      const currentRows = Math.ceil(height / fontSize);

      for (let r = 0; r < currentRows; r++) {
        for (let c = 0; c < currentCols; c++) {
          const x = c * fontSize;
          const y = r * fontSize;

          // Wave equation for dynamic character grid
          const distToMouse = Math.hypot(x - mouseX, y - mouseY);
          const mouseFactor = Math.max(0, 1 - distToMouse / 220);

          const wave = Math.sin(c * 0.15 + time) * Math.cos(r * 0.15 + time * 0.8) + mouseFactor * 2;
          const charIdx = Math.floor(Math.abs(wave * 3)) % chars.length;
          const char = chars[charIdx];

          const colorIdx = Math.floor(Math.abs((wave + c * 0.05) * 2)) % colors.length;
          const alpha = Math.min(1, Math.max(0.12, 0.25 + wave * 0.3 + mouseFactor * 0.6));

          ctx.fillStyle = colors[colorIdx];
          ctx.globalAlpha = alpha;
          ctx.fillText(char, x, y);
        }
      }
      ctx.globalAlpha = 1.0;
      requestAnimationFrame(render);
    }

    render();
  }

  initUltramarineAsciiCanvas();

  // Web Audio Context Setup
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Real GTA Vice City Sound Effects Engine (Web Audio API Synthesizer)
  function playClickSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      const now = audioCtx.currentTime;
      
      // High GTA Menu Cursor Tick
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(1450, now);
      osc.frequency.exponentialRampToValueAtTime(2600, now + 0.04);
      
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  function playMissionPassedSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      const now = audioCtx.currentTime;
      // Authentic Vice City 4-Note Brass Mission Passed Fanfare
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sawtooth';
        osc2.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.11);
        osc2.frequency.setValueAtTime(freq * 1.005, now + index * 0.11); // Detune harmonic
        
        gain.gain.setValueAtTime(0.22, now + index * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.11 + 0.5);
        
        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now + index * 0.11);
        osc2.start(now + index * 0.11);
        osc.stop(now + index * 0.11 + 0.5);
        osc2.stop(now + index * 0.11 + 0.5);
      });
    } catch (e) {}
  }

  function playWantedSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      const now = audioCtx.currentTime;
      // Dual-tone Police Radio Squelch & Wanted Siren
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.linearRampToValueAtTime(440, now + 0.25);
      
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  function playCashSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      const now = audioCtx.currentTime;
      // Authentic GTA Cash / Money Pickup Coin Bell Chime
      const notes = [987.77, 1318.51, 1760.00]; // B5, E6, A6
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.2, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.25);
      });
    } catch (e) {}
  }

  function playDocOpenSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      const now = audioCtx.currentTime;
      // Authentic GTA Weapon Pickup / Inventory Select Sound
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.09);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  function playRadioStaticSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      const now = audioCtx.currentTime;
      // White noise radio station switch squelch
      const bufferSize = audioCtx.sampleRate * 0.08;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      whiteNoise.connect(gain);
      gain.connect(audioCtx.destination);
      whiteNoise.start(now);
    } catch (e) {}
  }

  // GTA Vice City Cinematic Game Launch Sound Fanfare
  function playGameStartSequenceSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      const now = audioCtx.currentTime;
      
      // 1. Heavy Sub-Bass Engine Ignition Sweep
      const subOsc = audioCtx.createOscillator();
      const subGain = audioCtx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(180, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.65);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      subOsc.connect(subGain);
      subGain.connect(audioCtx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.65);

      // 2. High Arcade Synth Arpeggio Flare
      const notes = [329.63, 440.00, 554.37, 659.25, 880.00]; // E4, A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + 0.1 + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + 0.1 + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1 + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + 0.1 + idx * 0.08);
        osc.stop(now + 0.1 + idx * 0.08 + 0.35);
      });
      
      // 3. Final Mission Passed Style Victory Chime at +0.55s
      setTimeout(() => {
        if (soundEnabled) playMissionPassedSound();
      }, 550);
    } catch (e) {}
  }

  // Synthwave Radio Loop Generator
  function toggleRadio() {
    initAudio();
    radioPlaying = !radioPlaying;
    const radioBtn = document.getElementById('radio-btn');

    if (radioPlaying) {
      if (radioBtn) radioBtn.classList.add('active');
      const ArpScale = [220, 261.63, 329.63, 392.00, 440, 523.25];
      let arpIdx = 0;

      radioInterval = setInterval(() => {
        if (!soundEnabled || !radioPlaying) return;
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const filter = audioCtx.createBiquadFilter();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(ArpScale[arpIdx % ArpScale.length], audioCtx.currentTime);
          arpIdx++;

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1100, audioCtx.currentTime);

          gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(audioCtx.destination);

          osc.start();
          osc.stop(audioCtx.currentTime + 0.22);
        } catch(e) {}
      }, 210);
    } else {
      if (radioBtn) radioBtn.classList.remove('active');
      if (radioInterval) clearInterval(radioInterval);
    }
  }

  // VICE CITY LOADING SCREEN CHARACTER INTRO SLIDE-IN OBSERVER
  const animateOnScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.slide-in-left, .slide-in-right').forEach(el => {
    animateOnScrollObserver.observe(el);
    // Immediate check
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      el.classList.add('in-view');
    }
  });

  // HUD Clock Timer
  function updateClock() {
    const clockEl = document.getElementById('hud-clock');
    if (!clockEl) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Wanted Stars Controller
  const starsContainer = document.getElementById('wanted-stars');
  if (starsContainer) {
    starsContainer.addEventListener('click', () => {
      wantedLevel = (wantedLevel % 5) + 1;
      updateWantedStars();
      playWantedSound();
    });
  }

  // HUD Cash Pickup Sound & Reward Click Controller
  const hudCashEl = document.getElementById('hud-cash');
  if (hudCashEl) {
    hudCashEl.addEventListener('click', () => {
      currentCash += 1000;
      hudCashEl.textContent = '$' + currentCash.toLocaleString();
      playCashSound();
    });
  }

  function updateWantedStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, idx) => {
      if (idx < wantedLevel) {
        star.classList.add('active');
        star.textContent = '★';
      } else {
        star.classList.remove('active');
        star.textContent = '☆';
      }
    });
  }

  // SFX Toggle
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        soundBtn.classList.add('active');
        soundBtn.innerHTML = '🔊 SFX: ON';
        playClickSound();
        if (currentRadioIdx !== 0 && radioAudio.src) {
          radioAudio.play().catch(() => {});
        }
      } else {
        soundBtn.classList.remove('active');
        soundBtn.innerHTML = '🔇 SFX: OFF';
        if (radioAudio) radioAudio.pause();
      }
    });
  }

  // GTA Vice City Radio Engine (Soundsurfer City & Zephiramusic Lofi at 50% Volume)
  const radioBtn = document.getElementById('radio-btn');
  const radioTracks = [
    { name: 'RADIO: OFF', tag: 'OFF', src: null, volume: 0.5 },
    { 
      name: 'SOUNDSURFER CITY', 
      tag: 'CITY VIBE', 
      src: 'assets/soundsurfer-city-287458.mp3',
      volume: 0.5
    },
    { 
      name: 'ZEPHIRAMUSIC LOFI', 
      tag: 'LOFI SYNTH', 
      src: 'assets/zephiramusic-lofi-synthwave-588188.mp3',
      volume: 0.5
    }
  ];

  let currentRadioIdx = 0;
  let radioAudio = new Audio();
  radioAudio.loop = true;
  radioAudio.volume = 0.5;

  function setRadioTrack(idx) {
    currentRadioIdx = idx;
    const station = radioTracks[currentRadioIdx];
    
    // Authentic radio station static tuning squelch
    playRadioStaticSound();

    if (!station.src) {
      radioAudio.pause();
      radioAudio.currentTime = 0;
      if (radioBtn) {
        radioBtn.classList.remove('active');
        radioBtn.innerHTML = `<i class="fa-solid fa-radio"></i> RADIO: OFF`;
      }
    } else {
      radioAudio.src = station.src;
      radioAudio.volume = station.volume || 0.5;
      radioAudio.currentTime = 0;
      
      if (soundEnabled) {
        radioAudio.play().catch(err => {
          console.log('Radio Playback Autoplay restriction:', err);
        });
      }

      if (radioBtn) {
        radioBtn.classList.add('active');
        radioBtn.innerHTML = `<i class="fa-solid fa-radio"></i> 📻 ${station.tag}`;
      }
    }
  }

  if (radioBtn) {
    radioBtn.addEventListener('click', () => {
      const nextIdx = (currentRadioIdx + 1) % radioTracks.length;
      setRadioTrack(nextIdx);
    });
  }

  // Strict Scroll & Keyboard Navigation Lock on Landing Page
  function blockLockedScroll(e) {
    if (document.body.classList.contains('game-locked')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  window.addEventListener('wheel', blockLockedScroll, { passive: false });
  window.addEventListener('touchmove', blockLockedScroll, { passive: false });
  window.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('game-locked')) {
      const lockKeys = ['ArrowDown', 'PageDown', 'Space', 'End', 'Tab', 'ArrowUp', 'PageUp', 'Home'];
      if (lockKeys.includes(e.code) || lockKeys.includes(e.key)) {
        e.preventDefault();
      }
    }
  });

  // Cinematic "PRESS START TO PLAY" Game Launch & Permanently Unlock Engine
  const pressStartBtn = document.querySelector('.press-start-btn');
  const gameOverlay = document.getElementById('game-start-overlay');
  const heroSection = document.getElementById('hero');
  const characterCard = document.querySelector('.character-card');

  if (pressStartBtn) {
    pressStartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 1. Play Vice City Game Start Fanfare Sound
      playGameStartSequenceSound();

      // 2. Activate Cinematic Overlay & Camera Zoom
      if (gameOverlay) {
        gameOverlay.classList.add('active', 'flashing');
      }
      if (heroSection) {
        heroSection.classList.add('cinematic-zoom');
      }

      // 3. Stamp "GAME INITIALIZED" Title & Unlock Portfolio Content at +350ms
      setTimeout(() => {
        document.body.classList.remove('game-locked');
        if (gameOverlay) {
          gameOverlay.classList.add('stamped');
        }
      }, 350);

      // 4. Smooth Camera Warp Scroll to Character Select (#about) at +750ms
      setTimeout(() => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 750);

      // 5. Highlight Character Card with Spawn Glow & Audio Blip at +1100ms
      setTimeout(() => {
        if (characterCard) {
          characterCard.classList.add('game-selected');
          playClickSound();
          setTimeout(() => {
            characterCard.classList.remove('game-selected');
          }, 1400);
        }
      }, 1100);

      // 6. Withdraw Cinematic Bars & Permanently Hide Hero Section (Only Refresh Returns to Landing Page) at +1700ms
      setTimeout(() => {
        if (gameOverlay) {
          gameOverlay.classList.remove('stamped', 'flashing', 'active');
        }
        if (heroSection) {
          heroSection.classList.remove('cinematic-zoom');
          heroSection.style.display = 'none'; // Permanently remove hero landing page from scroll flow!
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); // Lock scroll top at Character Selection!
        }
      }, 1700);
    });
  }

  // LeetCode Counter Uptick Animation
  let counterAnimated = false;
  function animateLeetCodeCounter() {
    const counterEl = document.getElementById('leetcode-counter');
    if (!counterEl || counterAnimated) return;

    let current = 0;
    const target = 425;
    const duration = 1800;
    const increment = Math.ceil(target / (duration / 20));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counterEl.textContent = current;
    }, 20);
    counterAnimated = true;
  }

  // Scroll Observer for Stats Section & Skill Bars
  const statsSection = document.getElementById('about');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateLeetCodeCounter();
          document.querySelectorAll('.stat-bar-inner').forEach(bar => {
            const val = bar.getAttribute('data-val');
            bar.style.width = val + '%';
          });
        }
      });
    }, { threshold: 0.2 });
    observer.observe(statsSection);
  }

  // Mission Modal Data
  const missionData = {
    'inditwin': {
      title: 'The IndiTwin Simulation',
      subtitle: 'MISSION LOG #01 // MATLAB DATA ANALYTICS',
      desc: 'Applied pre-studied MATLAB computational frameworks and simulation algorithms to model, process, and analyze complex unstructured datasets.',
      objectives: [
        'Model multi-dimensional unstructured data parameters',
        'Implement simulation algorithms for predictive modeling',
        'Optimize MATLAB computational throughput & chart output'
      ],
      tech: ['MATLAB', 'Data Modeling', 'Algorithms', 'Simulation'],
      reward: '$50,000'
    },
    'shefi': {
      title: 'SheFi Season 12 Web3 Cohort',
      subtitle: 'MISSION LOG #02 // DECENTRALIZED FINANCE & PROTOCOLS',
      desc: 'Active operative in SheFi Season 12 Web3 cohort. Explored smart contract architecture, decentralized liquidity protocols, and Web3 dApp integrations.',
      objectives: [
        'Master Ethereum & EVM smart contract logic',
        'Analyze DeFi liquidity pools & tokenomics',
        'Build Web3 dApp frontend interfaces'
      ],
      tech: ['Web3', 'Ethereum', 'DeFi', 'Solidity', 'dApps'],
      reward: '$75,000'
    },
    'shecodes': {
      title: 'SheCodes Frontend Mastery',
      subtitle: 'MISSION LOG #03 // CREATIVE FRONTEND ARCHITECTURE',
      desc: 'Spearheaded modern responsive web application development with SheCodes. Engineered pixel-perfect layouts, REST API integrations, and aesthetic design systems.',
      objectives: [
        'Engineered responsive web application layouts',
        'Integrated dynamic RESTful API endpoints & asynchronous JS',
        'Created custom animation suites & UI design tokens'
      ],
      tech: ['HTML5', 'CSS3', 'JavaScript ES6', 'UI/UX Design'],
      reward: '$100,000'
    },
    'ti-wise': {
      title: 'Texas Instruments WiSE Hackathon',
      subtitle: 'COMPETITIVE ARENA // TOP 5 NATIONAL FINALIST',
      desc: 'Advanced through Round 1 (13k+ participants) and Round 2 (Top 60) to compete at the On-Site Grand Finale at Texas Instruments Bangalore HQ (Top 36 National Finalists). Achieved Top 5 Finalist distinction.',
      objectives: [
        'Selected among Top 36 teams from 13,000+ national entrants',
        'Demonstrated on-site hardware & software architecture at Bangalore HQ',
        'Awarded Top 5 National Finalist Honor'
      ],
      tech: ['Hardware & Software', 'Embedded Systems', 'Data Simulation', 'System Architecture'],
      reward: '$150,000'
    },
    'sih-2025': {
      title: 'Smart India Hackathon 2025',
      subtitle: 'NATIONAL GRAND FINALS // MSRUAS BANGALORE',
      desc: 'Developed Project IndiTwin to model unstructured Indian driving behaviors. Cleared Round 1 & 2 Internal Qualifiers and Semi-Finals to reach the Top 5 Teams in the National Grand Finals at MSRUAS Bangalore.',
      objectives: [
        'Developed Project IndiTwin for unstructured Indian traffic analysis',
        'Cleared Internal Qualifiers & Semi-Finals sprint',
        'Competed in Top 5 Teams at National Grand Finals (MSRUAS Bangalore)'
      ],
      tech: ['IndiTwin Engine', 'Python', 'Time-Series Modeling', 'Unstructured Data'],
      reward: '$200,000'
    }
  };

  // Mission Modal Triggering
  const modalOverlay = document.getElementById('mission-modal');
  const modalClose = document.getElementById('modal-close');
  const stampEl = document.getElementById('mission-passed-stamp');

  document.querySelectorAll('.start-mission-btn, .mission-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const missionId = btn.getAttribute('data-mission') || (btn.closest('.mission-card') && btn.closest('.mission-card').getAttribute('data-mission'));
      if (missionId && missionData[missionId]) {
        openMissionModal(missionData[missionId]);
        playClickSound();
      }
    });
  });

  const tiVhs = document.getElementById('ti-vhs-trigger');
  if (tiVhs) {
    tiVhs.addEventListener('click', () => {
      openMissionModal(missionData['ti-wise']);
      playClickSound();
    });
  }

  document.querySelectorAll('.surveillance-polaroid').forEach(pol => {
    pol.addEventListener('click', () => {
      openMissionModal(missionData['sih-2025']);
      playClickSound();
    });
  });

  function openMissionModal(data) {
    if (!modalOverlay) return;
    document.getElementById('modal-subtitle').textContent = data.subtitle;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;
    
    const techBox = document.getElementById('modal-tech');
    techBox.innerHTML = '';
    data.tech.forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'tech-tag';
      tag.textContent = t;
      techBox.appendChild(tag);
    });

    const objList = document.getElementById('modal-objectives-list');
    objList.innerHTML = '';
    data.objectives.forEach(obj => {
      const li = document.createElement('li');
      li.textContent = obj;
      objList.appendChild(li);
    });

    modalOverlay.classList.add('active');

    stampEl.classList.remove('stamped');
    setTimeout(() => {
      stampEl.classList.add('stamped');
      playMissionPassedSound();

      currentCash += 50000;
      const cashEl = document.getElementById('hud-cash');
      if (cashEl) {
        cashEl.textContent = '$' + currentCash.toLocaleString();
      }
    }, 380);
  }

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      playClickSound();
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        playClickSound();
      }
    });
  }

  // Interactive Safehouse Pager
  const pagerForm = document.getElementById('pager-form');
  const pagerName = document.getElementById('pager-name');
  const pagerEmail = document.getElementById('pager-email');
  const pagerMessage = document.getElementById('pager-message');
  const pagerScreen = document.getElementById('pager-screen');

  // Optional: Place your Google Form Action URL & Entry IDs here to automatically log to Google Sheet
  const GOOGLE_FORM_ACTION_URL = ''; // e.g., 'https://docs.google.com/forms/d/e/1FAIpQLSc.../formResponse'
  const GOOGLE_ENTRY_NAME = '';       // e.g., 'entry.123456789'
  const GOOGLE_ENTRY_EMAIL = '';      // e.g., 'entry.987654321'
  const GOOGLE_ENTRY_MSG = '';        // e.g., 'entry.456789123'

  function updatePagerPreview() {
    if (!pagerScreen) return;
    const nameVal = pagerName ? pagerName.value.trim() : '';
    const emailVal = pagerEmail ? pagerEmail.value.trim() : '';
    const msgVal = pagerMessage ? pagerMessage.value.trim() : '';

    if (!nameVal && !emailVal && !msgVal) {
      pagerScreen.innerHTML = 'PAGER RECEIVER 80s:<br>> READY FOR INCOMING MESSAGES...';
    } else {
      pagerScreen.innerHTML = `PAGER MEMO:<br>> FROM: ${nameVal || 'OPERATIVE'}<br>> EMAIL: ${emailVal || 'PENDING'}<br>> INTEL: "${msgVal || 'TYPING...'}"`;
    }
  }

  [pagerName, pagerEmail, pagerMessage].forEach(input => {
    if (input) input.addEventListener('input', updatePagerPreview);
  });

  if (pagerForm) {
    pagerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = pagerName ? pagerName.value.trim() : 'Anonymous';
      const emailVal = pagerEmail ? pagerEmail.value.trim() : 'N/A';
      const msgVal = pagerMessage ? pagerMessage.value.trim() : '';

      if (msgVal) {
        playClickSound();

        // Screen Transmission Output
        pagerScreen.innerHTML = `TRANSMITTING INTEL...<br>> FROM: ${nameVal}<br>> CONTACT: ${emailVal}<br>> INTEL: "${msgVal}"<br><br><span style="color:#00FFFF;">✔ TRANSMITTED TO AANA PANDEY!</span>`;

        // Background Google Form submission if URL & Entries are configured
        if (GOOGLE_FORM_ACTION_URL && GOOGLE_ENTRY_NAME && GOOGLE_ENTRY_EMAIL && GOOGLE_ENTRY_MSG) {
          const formData = new FormData();
          formData.append(GOOGLE_ENTRY_NAME, nameVal);
          formData.append(GOOGLE_ENTRY_EMAIL, emailVal);
          formData.append(GOOGLE_ENTRY_MSG, msgVal);

          fetch(GOOGLE_FORM_ACTION_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
          }).catch(err => console.log('Google Form Submission:', err));
        }

        // Reset form inputs
        if (pagerName) pagerName.value = '';
        if (pagerEmail) pagerEmail.value = '';
        if (pagerMessage) pagerMessage.value = '';

        setTimeout(() => {
          playMissionPassedSound();
        }, 300);
      }
    });
  }

  // Save Game Resume Download Button Click Handler
  const saveBtn = document.getElementById('save-resume-btn');
  const saveMsg = document.getElementById('save-status-msg');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      playMissionPassedSound();
      setTimeout(playCashSound, 450);
      if (saveMsg) {
        saveMsg.innerHTML = '<i class="fa-solid fa-circle-check"></i> GAME SAVED! DOSSIER DOWNLOADED';
        saveMsg.style.color = '#00FFFF';
        saveMsg.style.textShadow = '0 0 10px #00FFFF';
      }
      currentCash += 10000;
      const cashEl = document.getElementById('hud-cash');
      if (cashEl) {
        cashEl.textContent = '$' + currentCash.toLocaleString();
      }
    });
  }

  // ==========================================
  // IN-APP CLASSIFIED INTEL DOCUMENT VIEWER ENGINE (WITH SEQUENTIAL LEFT/RIGHT NAVIGATION)
  // ==========================================
  const docViewerModal = document.getElementById('doc-viewer-modal');
  const docViewerClose = document.getElementById('doc-viewer-close');
  const docViewerDismiss = document.getElementById('doc-viewer-dismiss-btn');
  const docViewerContainer = document.getElementById('doc-viewer-container');
  const docViewerTitle = document.getElementById('doc-viewer-title');
  const docViewerFilename = document.getElementById('doc-viewer-filename');
  const docViewerCounter = document.getElementById('doc-viewer-counter-badge');
  const docPrevBtn = document.getElementById('doc-prev-btn');
  const docNextBtn = document.getElementById('doc-next-btn');

  let currentDocList = [];
  let currentDocIndex = 0;

  function loadActiveDocument() {
    if (!docViewerContainer || !currentDocList.length) return;

    const item = currentDocList[currentDocIndex];
    const filePath = item.doc;
    const title = item.title;
    const filename = filePath.split('/').pop();

    if (docViewerTitle) docViewerTitle.textContent = title || filename;
    if (docViewerFilename) docViewerFilename.textContent = `FILE: ${filename}`;

    if (docViewerCounter) {
      docViewerCounter.textContent = `${currentDocIndex + 1} / ${currentDocList.length}`;
      docViewerCounter.style.display = currentDocList.length > 1 ? 'inline-block' : 'none';
    }

    if (docPrevBtn) docPrevBtn.classList.toggle('hidden', currentDocList.length <= 1);
    if (docNextBtn) docNextBtn.classList.toggle('hidden', currentDocList.length <= 1);

    docViewerContainer.innerHTML = '';

    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      const iframe = document.createElement('iframe');
      iframe.className = 'doc-viewer-iframe';
      iframe.src = `${filePath}#toolbar=0`;
      docViewerContainer.appendChild(iframe);
    } else if (ext === 'mp4' || ext === 'webm') {
      const video = document.createElement('video');
      video.className = 'doc-viewer-video';
      video.src = filePath;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.controls = true;
      docViewerContainer.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.className = 'doc-viewer-img';
      img.src = filePath;
      img.alt = title || filename;
      docViewerContainer.appendChild(img);
    }
  }

  function openDocumentViewerGroup(docList, startIndex) {
    if (!docViewerModal || !docList || !docList.length) return;
    currentDocList = docList;
    currentDocIndex = startIndex >= 0 && startIndex < docList.length ? startIndex : 0;

    loadActiveDocument();
    docViewerModal.classList.add('active');
    playDocOpenSound();
  }

  function navigateDoc(direction) {
    if (!currentDocList.length || currentDocList.length <= 1) return;
    if (direction === 'prev') {
      currentDocIndex = (currentDocIndex - 1 + currentDocList.length) % currentDocList.length;
    } else {
      currentDocIndex = (currentDocIndex + 1) % currentDocList.length;
    }
    loadActiveDocument();
    playClickSound();
  }

  if (docPrevBtn) docPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateDoc('prev'); });
  if (docNextBtn) docNextBtn.addEventListener('click', (e) => { e.stopPropagation(); navigateDoc('next'); });

  // Keyboard Left / Right Navigation Shortcut
  document.addEventListener('keydown', (e) => {
    if (!docViewerModal || !docViewerModal.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') {
      navigateDoc('prev');
    } else if (e.key === 'ArrowRight') {
      navigateDoc('next');
    } else if (e.key === 'Escape') {
      closeDocumentViewer();
    }
  });

  function closeDocumentViewer() {
    if (!docViewerModal) return;
    docViewerModal.classList.remove('active');
    if (docViewerContainer) docViewerContainer.innerHTML = '';
    currentDocList = [];
    currentDocIndex = 0;
    playClickSound();
  }

  if (docViewerClose) docViewerClose.addEventListener('click', closeDocumentViewer);
  if (docViewerDismiss) docViewerDismiss.addEventListener('click', closeDocumentViewer);
  if (docViewerModal) {
    docViewerModal.addEventListener('click', (e) => {
      if (e.target === docViewerModal) closeDocumentViewer();
    });
  }

  // Global Event Delegation for all .view-doc-btn clicks across the app
  document.addEventListener('click', (e) => {
    const viewBtn = e.target.closest('.view-doc-btn');
    if (viewBtn) {
      e.stopPropagation();
      const parentContainer = viewBtn.closest('.evidence-modal-content') || viewBtn.closest('.modal-box') || viewBtn.parentElement;
      const siblingBtns = Array.from(parentContainer.querySelectorAll('.view-doc-btn'));

      const docList = siblingBtns.map(btn => ({
        doc: btn.getAttribute('data-doc'),
        title: btn.getAttribute('data-title') || btn.innerText.trim()
      })).filter(item => item.doc);

      const startIndex = siblingBtns.indexOf(viewBtn);
      if (docList.length > 0) {
        openDocumentViewerGroup(docList, startIndex >= 0 ? startIndex : 0);
      }
    }
  });

  // ==========================================
  // EVIDENCE CACHE MODALS & AWS DRAWER ENGINE
  // ==========================================
  const evidenceData = {
    'icpc-algoqueen': {
      title: 'ICPC AlgoQueen 2026',
      subtitle: 'SECRET EVIDENCE CACHE',
      content: `
        <div style="background:linear-gradient(135deg, rgba(0,255,255,0.1), rgba(255,51,153,0.1)); border:2px solid var(--ocean-cyan); padding:1.5rem; border-radius:8px; box-shadow:0 0 25px rgba(0,255,255,0.3)">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:1rem; margin-bottom:1rem">
            <div>
              <span style="font-family:var(--font-arcade); font-size:0.75rem; color:var(--vice-gold)">COMPETITIVE PROGRAMMING DOSSIER</span>
              <h4 style="font-family:var(--font-hud); font-size:1.4rem; color:#fff; margin-top:4px">INTERNATIONAL RANK #455</h4>
            </div>
            <i class="fa-solid fa-trophy" style="font-size:2.5rem; color:var(--vice-gold)"></i>
          </div>
          <p style="font-size:0.95rem; line-height:1.6; color:#ddd; margin-bottom:1.2rem">
            Conquered 5 out of 6 complex algorithmic problems in the premier ICPC AlgoQueen 2026 global competition, securing International Rank 455 among top global competitive programmers.
          </p>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem">
            <div style="background:rgba(0,0,0,0.6); padding:10px; border-radius:4px; text-align:center; border:1px solid var(--panel-border)">
              <div style="font-family:var(--font-hud); color:var(--ocean-cyan); font-size:1.2rem; font-weight:bold">5 / 6</div>
              <div style="font-family:var(--font-arcade); font-size:0.6rem; color:#aaa">PROBLEMS SOLVED</div>
            </div>
            <div style="background:rgba(0,0,0,0.6); padding:10px; border-radius:4px; text-align:center; border:1px solid var(--panel-border)">
              <div style="font-family:var(--font-hud); color:var(--sunset-pink); font-size:1.2rem; font-weight:bold">455</div>
              <div style="font-family:var(--font-arcade); font-size:0.6rem; color:#aaa">GLOBAL RANK</div>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--ocean-cyan); margin-bottom:2px">
              <i class="fa-solid fa-folder-open"></i> SEQUENTIAL OFFICIAL PDF DOSSIERS:
            </div>
            <button type="button" class="view-doc-btn" data-doc="assets/ICPC 1.pdf" data-title="ICPC AlgoQueen 2026 #1" style="background:linear-gradient(90deg, var(--sunset-pink), #cc0066); color:#fff">
              <i class="fa-solid fa-file-pdf"></i> VIEW ICPC 1.pdf
            </button>
            <button type="button" class="view-doc-btn" data-doc="assets/ICPC 2.pdf" data-title="ICPC AlgoQueen 2026 #2" style="background:linear-gradient(90deg, #9900ff, var(--sunset-pink)); color:#fff">
              <i class="fa-solid fa-file-pdf"></i> VIEW ICPC 2.pdf
            </button>
          </div>
        </div>
      `
    },
    'ti-wise': {
      title: 'Texas Instruments WiSE Hackathon',
      subtitle: 'EVIDENCE CACHE ',
      content: `
        <div style="background:rgba(18,18,18,0.95); border:2px solid var(--sunset-pink); padding:1.5rem; border-radius:8px; box-shadow:0 0 25px rgba(255,51,153,0.3)">
          <div style="background:#000; border:2px solid #333; padding:12px; border-radius:6px; margin-bottom:1.2rem; text-align:center">
            <div style="font-family:var(--font-arcade); font-size:0.75rem; color:#00ff66; margin-bottom:6px">
              <i class="fa-solid fa-circle" style="color:#ff3333"></i> TEXAS INSTRUMENTS BANGALORE HQ
            </div>
            <div style="font-family:var(--font-hud); font-size:1.2rem; color:#fff; font-weight:bold">TOP 5 NATIONAL FINALIST</div>
            <div style="font-size:0.85rem; color:var(--vice-gold); margin-top:4px">INTERNSHIP BOUNTY AWARDED</div>
          </div>
          <p style="font-size:0.92rem; line-height:1.6; color:#ddd; margin-bottom:1.2rem">
            Advanced through 13,000+ national participants (Round 1) and Top 60 (Round 2) to demonstrate live hardware & software architecture at TI Bangalore HQ, securing a Top 5 National Finalist ranking and internship bounty.
          </p>

          <div style="background:rgba(0,0,0,0.5); border-left:3px solid var(--ocean-cyan); padding:12px; border-radius:4px; margin-bottom:1.2rem">
            <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--ocean-cyan); margin-bottom:8px">
              <i class="fa-solid fa-file-pdf"></i>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px">
              <button type="button" class="view-doc-btn" data-doc="assets/Aana WiSE Top 5.pdf" data-title="TI WiSE - Top 5 National Finalist Certificate" style="background:linear-gradient(90deg, var(--ocean-cyan), #0099ff); color:#121212">
                <i class="fa-solid fa-file-pdf"></i> VIEW WiSE Top 5.pdf
              </button>
              <button type="button" class="view-doc-btn" data-doc="assets/Aana WiSE Finalist 2.pdf" data-title="TI WiSE - National Finalist Certificate #2" style="background:linear-gradient(90deg, #00c8ff, #0055ff); color:#fff">
                <i class="fa-solid fa-file-pdf"></i> VIEW WiSE Finalist.pdf
              </button>
            </div>
          </div>

        </div>
      `
    },
    'sih-2025': {
      title: 'Smart India Hackathon 2025',
      subtitle: 'SURVEILLANCE',
      content: `
        <div style="background:rgba(18,18,18,0.95); border:2px solid var(--ocean-cyan); padding:1.5rem; border-radius:8px; box-shadow:0 0 25px rgba(0,255,255,0.3)">
          <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:1rem; margin-bottom:1rem">
            <i class="fa-solid fa-fingerprint" style="font-size:2.2rem; color:var(--ocean-cyan)"></i>
            <div>
              <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--ocean-cyan)">NATIONAL GRAND FINALIST</div>
              <h4 style="font-family:var(--font-hud); font-size:1.3rem; color:#fff">PROJECT INDITWIN DEPLOYMENT</h4>
            </div>
          </div>
          
          <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:1.2rem">
            <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--vice-gold)">
              <i class="fa-solid fa-file-pdf"></i> OFFICIAL NATIONAL FINALIST:
            </div>
            <button type="button" class="view-doc-btn" data-doc="assets/SIH FINALIST 2025.pdf" data-title="Smart India Hackathon 2025 - National Finalist Certificate" style="background:linear-gradient(90deg, var(--vice-gold), #ff9900); color:#121212">
              <i class="fa-solid fa-file-pdf"></i> VIEW SIH FINALIST 2025.pdf
            </button>
          </div>

        </div>
      `
    },
    'ghc-scholar': {
      title: 'Grace Hopper Celebration India Scholar',
      subtitle: 'VIP PASS // ANITAB.ORG SCHOLARSHIP',
      content: `
        <div style="background:linear-gradient(135deg, #1a0033, #330066); border:2px solid var(--vice-gold); padding:1.5rem; border-radius:8px; box-shadow:0 0 30px rgba(255,204,0,0.4)">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,204,0,0.3); padding-bottom:1rem; margin-bottom:1rem">
            <div>
              <span style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--vice-gold)">ANITAB.ORG PROGRAM</span>
              <h4 style="font-family:var(--font-hud); font-size:1.4rem; color:#fff">GHCI ELITE SCHOLAR</h4>
            </div>
            <i class="fa-solid fa-gem" style="font-size:2.2rem; color:var(--vice-gold)"></i>
          </div>
          <p style="font-size:0.92rem; line-height:1.6; color:#eee; margin-bottom:1.2rem">
            Selected as an elite scholar for both the 2024 and 2025 editions of the Grace Hopper Celebration India (GHCI) through the AnitaB.org program, representing top women in technology.
          </p>
          <div style="background:rgba(0,0,0,0.5); border:1px solid var(--vice-gold); border-radius:6px; padding:12px; margin-bottom:1.5rem; text-align:center">
            <div style="font-family:var(--font-hud); color:var(--vice-gold); font-size:1.1rem; font-weight:bold">DOUBLE SCHOLAR SELECTION</div>
            <div style="font-family:var(--font-arcade); font-size:0.75rem; color:var(--ocean-cyan); margin-top:4px">2024 EDITION • 2025 EDITION</div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px">
            <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--vice-gold)">
              <i class="fa-solid fa-image"></i> OFFICIAL SCHOLARSHIP:
            </div>
            <button type="button" class="view-doc-btn" data-doc="assets/Advancing Inclusion Program Scholarship - STEM Students.jpg" data-title="Grace Hopper Celebration India - Scholarship Certificate" style="background:linear-gradient(90deg, var(--sunset-pink), #cc0066); color:#fff">
              <i class="fa-solid fa-image"></i> VIEW SCHOLARSHIP CERTIFICATE
            </button>
          </div>
        </div>
      `
    },
    'cert-web3': {
      title: 'Web3 & Decentralized Infrastructure',
      subtitle: 'VERIFIED // ISSUED BY SHEFI COHORT',
      content: `
        <div style="background:rgba(18,18,18,0.95); border:2px solid var(--ocean-cyan); padding:1.5rem; border-radius:8px; box-shadow:0 0 25px rgba(0,255,255,0.3)">
          <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:1rem; margin-bottom:1rem">
            <i class="fa-solid fa-cubes" style="font-size:2.2rem; color:var(--ocean-cyan)"></i>
            <div>
              <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--vice-gold)">ISSUING SYNDICATE</div>
              <h4 style="font-family:var(--font-hud); font-size:1.3rem; color:#fff">SheFi Cohort</h4>
            </div>
          </div>

          <div style="margin-bottom:1.5rem">
            <div style="font-family:var(--font-hud); font-size:0.8rem; color:var(--ocean-cyan); margin-bottom:8px"><i class="fa-solid fa-gears"></i> ACQUIRED SKILLS:</div>
            <div style="display:flex; flex-wrap:wrap; gap:8px">
              <span class="tech-tag" style="border-color:var(--ocean-cyan)">Blockchain Architecture</span>
              <span class="tech-tag" style="border-color:var(--ocean-cyan)">Decentralized Finance (DeFi)</span>
              <span class="tech-tag" style="border-color:var(--ocean-cyan)">Smart Contracts</span>
              <span class="tech-tag" style="border-color:var(--ocean-cyan)">Decentralized Autonomous Organizations (DAOs)</span>
              <span class="tech-tag" style="border-color:var(--ocean-cyan)">Ethereum Mechanics</span>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px">
            <button type="button" class="view-doc-btn" data-doc="assets/SheFi_completion_certificate.jpg" data-title="SheFi Completion Certificate" style="background:linear-gradient(90deg, var(--ocean-cyan), #0099ff); color:#121212">
              <i class="fa-solid fa-image"></i> VIEW CERTIFICATE (SheFi_completion_certificate.jpg)
            </button>
          </div>
        </div>
      `
    },
    'cert-aws': {
      title: 'AWS AI/ML Foundation & Architecture',
      subtitle: 'VERIFIED // ISSUED BY UDACITY & AMAZON WEB SERVICES',
      content: `
        <div style="background:rgba(18,18,18,0.95); border:2px solid #ff9900; padding:1.5rem; border-radius:8px; box-shadow:0 0 25px rgba(255,153,0,0.3)">
          <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:1rem; margin-bottom:1rem; flex-wrap:wrap; gap:10px">
            <div style="display:flex; align-items:center; gap:12px">
              <i class="fa-brands fa-aws" style="font-size:2.4rem; color:#ff9900"></i>
              <div>
                <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--vice-gold)">ISSUING SYNDICATE</div>
                <h4 style="font-family:var(--font-hud); font-size:1.3rem; color:#fff">Udacity & AWS</h4>
              </div>
            </div>
            <div style="background:rgba(255,153,0,0.15); border:1px solid #ff9900; padding:6px 12px; border-radius:4px; font-family:var(--font-hud); font-size:0.75rem; color:#ff9900; font-weight:bold">
              TOP 4.5% GLOBAL DISTINCTION
            </div>
          </div>

          <div style="background:rgba(0,0,0,0.5); border-left:3px solid #ff9900; padding:10px 14px; margin-bottom:1.2rem">
            <div style="font-family:var(--font-hud); font-size:0.75rem; color:#ff9900; font-weight:bold"><i class="fa-solid fa-chart-line"></i> RANK & GLOBAL STANDING:</div>
            <div style="font-size:0.88rem; color:#ddd; margin-top:4px">Selected in the Top 4.5% out of 100,000+ global applicants for a fully funded Udacity AI/ML Nanodegree fellowship.</div>
          </div>

          <div style="background:rgba(0,0,0,0.5); border-left:3px solid var(--vice-gold); padding:10px 14px; margin-bottom:1.2rem">
            <div style="font-family:var(--font-hud); font-size:0.75rem; color:var(--vice-gold); font-weight:bold"><i class="fa-solid fa-bullseye"></i> MISSION OBJECTIVE & EXECUTION:</div>
            <div style="font-size:0.85rem; color:#ccc; margin-top:4px">Engineered an automated image classification pipeline using PyTorch & CNNs to categorize target entities. Benchmarked three distinct CNN architectures (ResNet, AlexNet, and VGG) for optimal statistical accuracy.</div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px">
            <button type="button" class="view-doc-btn" data-doc="assets/AWS AIML SCHOLAR 1.png" data-title="AWS AI/ML Scholar Certificate Image" style="background:linear-gradient(90deg, #ff9900, #e67e00); color:#121212">
              <i class="fa-solid fa-image"></i> VIEW AWS SCHOLAR CREDENTIAL (IMAGE)
            </button>
            <button type="button" class="view-doc-btn" data-doc="assets/aws_ai_practitioner.pdf" data-title="AWS Certified AI Practitioner Certificate" style="background:linear-gradient(90deg, var(--vice-gold), #ff9900); color:#121212">
              <i class="fa-solid fa-file-pdf"></i> VIEW AWS AI PRACTITIONER (aws_ai_practitioner.pdf)
            </button>
          </div>
        </div>
      `
    },
    'cert-datascience': {
      title: 'Data Science & Quantitative Analysis',
      subtitle: 'VERIFIED // ISSUED BY INFOSYS SPRINGBOARD',
      content: `
        <div style="background:rgba(18,18,18,0.95); border:2px solid var(--sunset-pink); padding:1.5rem; border-radius:8px; box-shadow:0 0 25px rgba(255,51,153,0.3)">
          <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:1rem; margin-bottom:1rem">
            <i class="fa-solid fa-chart-pie" style="font-size:2.2rem; color:var(--sunset-pink)"></i>
            <div>
              <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--vice-gold)">ISSUING SYNDICATE</div>
              <h4 style="font-family:var(--font-hud); font-size:1.3rem; color:#fff">Infosys Springboard</h4>
            </div>
          </div>

          <div style="margin-bottom:1.5rem">
            <div style="font-family:var(--font-hud); font-size:0.8rem; color:var(--sunset-pink); margin-bottom:8px"><i class="fa-solid fa-gears"></i> ACQUIRED SKILLS:</div>
            <div style="display:flex; flex-wrap:wrap; gap:8px">
              <span class="tech-tag" style="border-color:var(--sunset-pink); color:#fff">Python for Data Science</span>
              <span class="tech-tag" style="border-color:var(--sunset-pink); color:#fff">Probability & Statistics</span>
              <span class="tech-tag" style="border-color:var(--sunset-pink); color:#fff">Probability Distributions</span>
              <span class="tech-tag" style="border-color:var(--sunset-pink); color:#fff">Linear Algebra</span>
              <span class="tech-tag" style="border-color:var(--sunset-pink); color:#fff">Statistical Inference</span>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px">
            <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--sunset-pink); margin-bottom:2px">
              <i class="fa-solid fa-file-pdf"></i> CERTIFICATIONS:
            </div>
            <button type="button" class="view-doc-btn" data-doc="assets/Introduction to Data Science.pdf" data-title="Introduction to Data Science Certificate" style="background:linear-gradient(90deg, var(--sunset-pink), #cc0066); color:#fff">
              <i class="fa-solid fa-file-pdf"></i> 1. Introduction to Data Science.pdf
            </button>
            <button type="button" class="view-doc-btn" data-doc="assets/Python for Data Science.pdf" data-title="Python for Data Science Certificate" style="background:linear-gradient(90deg, #ff007f, #b30059); color:#fff">
              <i class="fa-solid fa-file-pdf"></i> 2. Python for Data Science.pdf
            </button>
            <button type="button" class="view-doc-btn" data-doc="assets/Basics of Linear Algebra using Python.pdf" data-title="Basics of Linear Algebra Certificate" style="background:linear-gradient(90deg, #9900ff, var(--sunset-pink)); color:#fff">
              <i class="fa-solid fa-file-pdf"></i> 3. Basics of Linear Algebra using Python.pdf
            </button>
            <button type="button" class="view-doc-btn" data-doc="assets/Probability and Statistics using Python.pdf" data-title="Probability & Statistics Certificate" style="background:linear-gradient(90deg, var(--ocean-cyan), #0099ff); color:#121212">
              <i class="fa-solid fa-file-pdf"></i> 4. Probability and Statistics using Python.pdf
            </button>
            <button type="button" class="view-doc-btn" data-doc="assets/Probability Distribution using Python.pdf" data-title="Probability Distribution Certificate" style="background:linear-gradient(90deg, #00c8ff, #0055ff); color:#fff">
              <i class="fa-solid fa-file-pdf"></i> 5. Probability Distribution using Python.pdf
            </button>
            <button type="button" class="view-doc-btn" data-doc="assets/Statistical Inference using Python.pdf" data-title="Statistical Inference Certificate" style="background:linear-gradient(90deg, var(--vice-gold), #ff9900); color:#121212">
              <i class="fa-solid fa-file-pdf"></i> 6. Statistical Inference using Python.pdf
            </button>
          </div>
        </div>
      `
    },
    'cert-genai': {
      title: 'Generative AI Workspace Integration',
      subtitle: 'VERIFIED // ISSUED BY COURSERA',
      content: `
        <div style="background:rgba(18,18,18,0.95); border:2px solid var(--vice-gold); padding:1.5rem; border-radius:8px; box-shadow:0 0 25px rgba(255,204,0,0.3)">
          <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:1rem; margin-bottom:1rem">
            <i class="fa-solid fa-wand-magic-sparkles" style="font-size:2.2rem; color:var(--vice-gold)"></i>
            <div>
              <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--vice-gold)">ISSUING SYNDICATE</div>
              <h4 style="font-family:var(--font-hud); font-size:1.3rem; color:#fff">Coursera</h4>
            </div>
          </div>

          <div style="margin-bottom:1.5rem">
            <div style="font-family:var(--font-hud); font-size:0.8rem; color:var(--vice-gold); margin-bottom:8px"><i class="fa-solid fa-gears"></i> ACQUIRED SKILLS:</div>
            <div style="display:flex; flex-wrap:wrap; gap:8px">
              <span class="tech-tag" style="border-color:var(--vice-gold); color:var(--vice-gold)">Introduction to Google Workspace with Gemini</span>
              <span class="tech-tag" style="border-color:var(--vice-gold); color:var(--vice-gold)">Gemini in Gmail</span>
              <span class="tech-tag" style="border-color:var(--vice-gold); color:var(--vice-gold)">AI Workflow Automation</span>
              <span class="tech-tag" style="border-color:var(--vice-gold); color:var(--vice-gold)">Prompt Engineering</span>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px">
            <div style="font-family:var(--font-arcade); font-size:0.7rem; color:var(--vice-gold); margin-bottom:2px">
              <i class="fa-solid fa-file-pdf"></i> SEQUENTIAL COURSERA CERTIFICATES:
            </div>
            <button type="button" class="view-doc-btn" data-doc="assets/Coursera COS9DREXL48M.pdf" data-title="Coursera Generative AI Certificate #1" style="background:linear-gradient(90deg, var(--vice-gold), #ff9900); color:#121212">
              <i class="fa-solid fa-file-pdf"></i> VIEW Coursera COS9DREXL48M.pdf
            </button>
            <button type="button" class="view-doc-btn" data-doc="assets/Coursera HKQEW72R0OQS.pdf" data-title="Coursera Generative AI Certificate #2" style="background:linear-gradient(90deg, #ffcc00, #e6b800); color:#121212">
              <i class="fa-solid fa-file-pdf"></i> VIEW Coursera HKQEW72R0OQS.pdf
            </button>
          </div>
        </div>
      `
    }
  };

  const evidenceModal = document.getElementById('evidence-modal');
  const evidenceModalClose = document.getElementById('evidence-modal-close');
  const evidenceStamp = document.getElementById('evidence-stamp');

  document.querySelectorAll('[data-evidence]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const evId = el.getAttribute('data-evidence');
      if (evId && evidenceData[evId]) {
        openEvidenceModal(evidenceData[evId]);
        playClickSound();
      }
    });
  });

  function openEvidenceModal(data) {
    if (!evidenceModal) return;
    document.getElementById('evidence-modal-subtitle').innerHTML = `<i class="fa-solid fa-folder-open"></i> ${data.subtitle}`;
    document.getElementById('evidence-modal-title').textContent = data.title;
    document.getElementById('evidence-modal-body').innerHTML = data.content;

    evidenceModal.classList.add('active');

    if (evidenceStamp) {
      evidenceStamp.classList.remove('stamped');
      setTimeout(() => {
        evidenceStamp.classList.add('stamped');
        playMissionPassedSound();
      }, 350);
    }
  }

  if (evidenceModalClose) {
    evidenceModalClose.addEventListener('click', () => {
      evidenceModal.classList.remove('active');
      playClickSound();
    });
  }

  if (evidenceModal) {
    evidenceModal.addEventListener('click', (e) => {
      if (e.target === evidenceModal) {
        evidenceModal.classList.remove('active');
        playClickSound();
      }
    });
  }

  // Sliding AWS Drawer Controller
  const awsDrawer = document.getElementById('aws-sliding-drawer');
  const awsBackdrop = document.getElementById('aws-drawer-backdrop');
  const awsCloseBtn = document.getElementById('aws-drawer-close');

  document.querySelectorAll('[data-drawer="aws-drawer"]').forEach(el => {
    el.addEventListener('click', () => {
      if (awsDrawer && awsBackdrop) {
        awsDrawer.classList.add('active');
        awsBackdrop.classList.add('active');
        playMissionPassedSound();
      }
    });
  });

  if (awsCloseBtn) {
    awsCloseBtn.addEventListener('click', () => {
      closeAwsDrawer();
    });
  }

  if (awsBackdrop) {
    awsBackdrop.addEventListener('click', () => {
      closeAwsDrawer();
    });
  }

  function closeAwsDrawer() {
    if (awsDrawer) awsDrawer.classList.remove('active');
    if (awsBackdrop) awsBackdrop.classList.remove('active');
    playClickSound();
  }

  // Sequential Media Carousel Controller (TI WiSE & SIH 2025)
  document.querySelectorAll('.hackathon-media-carousel').forEach(carousel => {
    const items = carousel.querySelectorAll('.carousel-media-item');
    const counterEl = carousel.querySelector('.carousel-current');
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');

    if (!items.length) return;
    let currentIndex = 0;

    function showItem(index) {
      items.forEach((item, i) => {
        if (i === index) {
          item.classList.add('active');
          if (item.tagName.toLowerCase() === 'video') {
            item.currentTime = 0;
            const hasAudio = item.dataset.audio === 'true' || item.hasAttribute('data-audio');
            if (hasAudio) {
              item.muted = false;
              item.controls = true;
            } else {
              item.muted = true;
              item.removeAttribute('controls');
            }
            item.play().catch(err => {
              console.log('Autoplay audio handling:', err);
              // Fallback if browser requires user gesture for unmuted video
              if (hasAudio) {
                item.muted = true;
                item.play().catch(() => {});
              }
            });
          }
        } else {
          item.classList.remove('active');
          if (item.tagName.toLowerCase() === 'video') {
            item.pause();
          }
        }
      });

      if (counterEl) counterEl.textContent = index + 1;
    }

    // Configure initial video mute & controls based on data-audio attribute
    carousel.querySelectorAll('video').forEach(vid => {
      const hasAudio = vid.dataset.audio === 'true' || vid.hasAttribute('data-audio');
      if (hasAudio) {
        vid.muted = false;
        vid.controls = true;
      } else {
        vid.muted = true;
        vid.removeAttribute('controls');
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showItem(currentIndex);
        playClickSound();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
        playClickSound();
      });
    }
  });

  // General click sound for all interactive buttons
  document.querySelectorAll('button, .hud-btn, .press-start-btn, .contact-card, .achievement-card, .cert-card, .hackathon-card, .save-download-btn').forEach(el => {
    el.addEventListener('click', () => {
      playClickSound();
    });
  });
});
