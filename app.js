/**
 * Cinnamoroll × Zenless Zone Zero (ZZZ) "Random Play" Birthday Sub-Net
 * Core Frontend Logic & Direct Audio Synthesis Engine
 */

document.addEventListener("DOMContentLoaded", () => {
    // STATE VARIABLES
    let isSoundOn = true;
    let proxyName = "Sweetheart";
    let isMusicPlaying = false;
    let letterTyped = false;

    // AUDIO SYNTHESIS ENGINE (Web Audio API)
    // No external file dependencies - synthesizes high-fidelity retro arcade sounds & a full chord sequencer in real time!
    let audioCtx = null;
    let synthInterval = null; // music sequencer
    let currentBeat = 0;
    
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Synthesize Mechanical UI Click (High-contrast beep)
    function playClickSound() {
        if (!isSoundOn) return;
        initAudio();
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
            osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.08); // A6
            
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        } catch (e) { console.log(e); }
    }

    // Synthesize Retro Mechanical Latch (Tape Deck click)
    function playTapeLatchSound() {
        if (!isSoundOn) return;
        initAudio();
        try {
            const oscNode = audioCtx.createOscillator();
            const noiseNode = audioCtx.createGain(); // custom damp filter
            const gainNode = audioCtx.createGain();
            
            oscNode.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscNode.type = "triangle";
            oscNode.frequency.setValueAtTime(120, audioCtx.currentTime);
            oscNode.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);
            
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
            
            oscNode.start();
            oscNode.stop(audioCtx.currentTime + 0.15);
        } catch(e) {}
    }

    // Synthesize Success / Level Up Jingle on boot
    function playSuccessJingle() {
        if (!isSoundOn) return;
        initAudio();
        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major triad)
            notes.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime + index * 0.08);
                
                gain.gain.setValueAtTime(0.0, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + index * 0.08 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + index * 0.08 + 0.25);
                
                osc.start(audioCtx.currentTime + index * 0.08);
                osc.stop(audioCtx.currentTime + index * 0.08 + 0.3);
            });
        } catch (e) {}
    }

    // Synthesize a retro typewriting click
    function playTypewriterClick() {
        if (!isSoundOn) return;
        initAudio();
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = "sine";
            // Randomize slightly for realistic typewriter variation
            const freq = 1200 + Math.random() * 400;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.03);
        } catch(e) {}
    }

    // DYNAMIC RETRO MUSIC SYNTHESIZER (Playing a sweet Happy Birthday Lofi Chord loop)
    // We compose a beautiful custom music sequence: cozy lofi chord changes with a gentle bell melody!
    const lofiTempo = 95; // BPM
    const beatDuration = 60 / lofiTempo; // duration of one beat in seconds

    // Happy Birthday progression in F major: F -> C -> C -> F -> F7 -> Bb -> F -> C -> F
    const chords = [
        [174.61, 220.00, 261.63, 349.23], // F Major (F3, A3, C4, F4)
        [174.61, 220.00, 261.63, 349.23], 
        [130.81, 196.00, 261.63, 329.63], // C Major (C3, G3, C4, E4)
        [130.81, 196.00, 261.63, 329.63],
        [130.81, 196.00, 261.63, 329.63],
        [130.81, 196.00, 261.63, 329.63],
        [174.61, 220.00, 261.63, 349.23], // F Major
        [174.61, 220.00, 261.63, 349.23],
        [174.61, 220.00, 261.63, 349.23], // F7
        [174.61, 220.00, 311.13, 349.23], // F7 (F3, A3, Eb4, F4)
        [116.54, 185.00, 233.08, 293.66], // Bb Major (Bb2, F3, Bb3, D4)
        [116.54, 185.00, 233.08, 293.66],
        [174.61, 220.00, 261.63, 349.23], // F Major
        [130.81, 196.00, 261.63, 329.63], // C Major
        [174.61, 220.00, 261.63, 349.23], // F Major
        [174.61, 220.00, 261.63, 349.23]
    ];

    // Melodic notes sequence mapping standard "Happy Birthday to you"
    // Format: [Frequency, beatOffset, durationMultiplier]
    const melody = [
        [349.23, 0, 0.75], // F4 ("Hap-")
        [349.23, 0.75, 0.25], // F4 ("-py")
        [392.00, 1.0, 1.0],  // G4 ("Birth-")
        [349.23, 2.0, 1.0],  // F4 ("-day")
        [440.00, 3.0, 1.0],  // A4 ("to")
        [392.00, 4.0, 2.0],  // G4 ("you")
        
        [349.23, 6.0, 0.75], // F4 ("Hap-")
        [349.23, 6.75, 0.25], // F4 ("-py")
        [392.00, 7.0, 1.0],  // G4 ("Birth-")
        [349.23, 8.0, 1.0],  // F4 ("-day")
        [523.25, 9.0, 1.0],  // C5 ("to")
        [440.00, 10.0, 2.0], // A4 ("you")
        
        [349.23, 12.0, 0.75], // F4 ("Hap-")
        [349.23, 12.75, 0.25], // F4 ("-py")
        [698.46, 13.0, 1.0],  // F5 ("Birth-")
        [587.33, 14.0, 1.0],  // D5 ("-day")
        [440.00, 15.0, 1.0],  // A4 ("dear")
        [392.00, 16.0, 1.0],  // G4 ("Sweet-")
        [349.23, 17.0, 1.0],  // F4 ("-heart")
        
        [622.25, 18.0, 0.75], // Eb5 ("Hap-")
        [622.25, 18.75, 0.25], // Eb5 ("-py")
        [587.33, 19.0, 1.0],  // D5 ("Birth-")
        [440.00, 20.0, 1.0],  // A4 ("-day")
        [523.25, 21.0, 1.0],  // C5 ("to")
        [349.23, 22.0, 2.0]   // F4 ("you")
    ];

    function playMusicTick() {
        if (!isMusicPlaying) return;
        initAudio();
        
        const currentChordIndex = Math.floor(currentBeat / 2) % chords.length;
        const currentChord = chords[currentChordIndex];
        
        // 1. Play Soft Pad Chords (Warm Low-Pass Triangles)
        if (currentBeat % 2 === 0) {
            currentChord.forEach(freq => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.type = "triangle";
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                
                filter.type = "lowpass";
                filter.frequency.setValueAtTime(500, audioCtx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + beatDuration * 1.8);
                
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
                gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + beatDuration * 1.9);
                
                osc.start();
                osc.stop(audioCtx.currentTime + beatDuration * 2);
            });
        }

        // 2. Play Cozy Lofi Bell Melody
        // Search if there's a note at this beat offset
        const loopBeat = currentBeat % 32; // Loop melody every 32 beats (approx 20 secs)
        const melodyNote = melody.find(n => Math.abs(n[1] - loopBeat) < 0.05);
        if (melodyNote) {
            const freq = melodyNote[0];
            const duration = melodyNote[2] * beatDuration;
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = "sine"; // Pure bell tone
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration * 0.9);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        }

        // 3. Bounce Equalizer UI Bars in exact sync with beats
        animateEqualizerBars();

        // Progress tape time increment
        updateMusicProgress();

        // Increment beat count
        currentBeat++;
    }

    // Dynamic scale equalizer bars based on beat
    function animateEqualizerBars() {
        const bars = document.querySelectorAll(".eq-bar");
        bars.forEach(bar => {
            if (isMusicPlaying) {
                // Random height multiplier centered around beat intensity
                const height = 10 + Math.random() * 26;
                bar.style.height = `${height}px`;
            } else {
                bar.style.height = "4px";
            }
        });
    }

    function toggleMusicPlayback(play) {
        initAudio();
        if (play && !isMusicPlaying) {
            playTapeLatchSound();
            isMusicPlaying = true;
            currentBeat = 0;
            
            // Set up a loop matching our BPM tempo
            synthInterval = setInterval(playMusicTick, beatDuration * 1000);
            
            // Add UI state modifications
            document.getElementById("reel-left").classList.add("playing");
            document.getElementById("reel-right").classList.add("playing");
            document.getElementById("modal-music").classList.add("playing-deck");
            
            document.getElementById("deck-play").disabled = true;
            document.getElementById("deck-pause").disabled = false;
            document.getElementById("deck-play").classList.add("active-btn");
            document.getElementById("deck-pause").classList.remove("active-btn");
        } else if (!play && isMusicPlaying) {
            playTapeLatchSound();
            isMusicPlaying = false;
            clearInterval(synthInterval);
            
            document.getElementById("reel-left").classList.remove("playing");
            document.getElementById("reel-right").classList.remove("playing");
            document.getElementById("modal-music").classList.remove("playing-deck");
            animateEqualizerBars(); // resets them to flat
            
            document.getElementById("deck-play").disabled = false;
            document.getElementById("deck-pause").disabled = true;
            document.getElementById("deck-play").classList.remove("active-btn");
            document.getElementById("deck-pause").classList.add("active-btn");
        }
    }

    // Increment simulated tape time elapsed
    let elapsedSeconds = 0;
    const totalDurationSeconds = 150; // 02:30
    
    function updateMusicProgress() {
        if (!isMusicPlaying) return;
        elapsedSeconds = (elapsedSeconds + beatDuration) % totalDurationSeconds;
        
        // Update numeric counter display
        const m = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
        const s = Math.floor(elapsedSeconds % 60).toString().padStart(2, '0');
        document.getElementById("track-time-elapsed").textContent = `${m}:${s}`;
        
        // Progress bar filling
        const percent = (elapsedSeconds / totalDurationSeconds) * 100;
        document.getElementById("music-progress-fill").style.width = `${percent}%`;
    }

    function resetTape() {
        toggleMusicPlayback(false);
        elapsedSeconds = 0;
        document.getElementById("track-time-elapsed").textContent = "00:00";
        document.getElementById("music-progress-fill").style.width = "0%";
    }

    // ==========================================================================
    // PHASE 1: RETRO CRT BOOT SCREEN LOGIC
    // ==========================================================================
    
    const logs = [
        "> SECURE_PROTOCOL: ENABLED",
        "> SYNCHRONIZING DEEP HOLLOW SIGNALS... [100%]",
        "> DECRYPTING VIDEO STORAGE DIRECTORIES...",
        "> ACCESS REEL READY FOR INITIALIZATION.",
        "> >> WAITING FOR USER INPUT AUTHORIZATION... <<"
    ];

    let logIndex = 0;
    const logBox = document.getElementById("boot-logs");

    function typeLogLines() {
        if (logIndex < logs.length) {
            const p = document.createElement("p");
            p.className = "log-line text-info";
            p.textContent = logs[logIndex];
            logBox.appendChild(p);
            logBox.scrollTop = logBox.scrollHeight;
            
            // Random mechanical click noise for logs
            playTypewriterClick();
            
            logIndex++;
            setTimeout(typeLogLines, 500 + Math.random() * 300);
        } else {
            // Enable login input once all boot items are printed
            document.getElementById("proxy-name").focus();
        }
    }

    // Start boot simulation log prints
    setTimeout(typeLogLines, 1000);

    // Watch proxy name input box
    const authInput = document.getElementById("proxy-name");
    const loginBtn = document.getElementById("btn-login");

    // Keep button enabled by default to guarantee mobile tap feedback
    loginBtn.disabled = false;

    authInput.addEventListener("input", (e) => {
        // Aesthetic feedback, button remains clickable
        if (e.target.value.trim().length > 0) {
            loginBtn.classList.add("btn-neon");
        }
    });

    // Submit Authorization Button Trigger
    loginBtn.addEventListener("click", () => {
        // Fallback default name if empty to bypass iOS typing keyboard completely
        proxyName = authInput.value.trim() || "Sweetheart";
        
        // Lock body and scroll viewport to exactly 0 to defeat iOS virtual keyboard displacement
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Force overflow hidden on HTML and Body
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.documentElement.style.position = "fixed";
        document.body.style.position = "fixed";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        
        // Update user's name across the entire site
        document.getElementById("display-proxy-name").textContent = proxyName.toUpperCase();
        document.getElementById("agent-display-name").textContent = proxyName.toUpperCase();
        document.getElementById("letter-proxy-name").textContent = proxyName.toUpperCase();

        // Boot Screen Flash Aberration
        const glitchOverlay = document.getElementById("glitch-overlay");
        glitchOverlay.classList.add("active");
        playSuccessJingle();

        setTimeout(() => {
            glitchOverlay.classList.remove("active");
            
            // Slide Boot Screen out and slide in the Random Play store counter
            document.getElementById("boot-screen").classList.add("hidden");
            document.getElementById("main-dashboard").classList.remove("hidden");
            
            // Completely disable display of boot-screen after transition completes (prevents scrolling back up)
            setTimeout(() => {
                const bootElement = document.getElementById("boot-screen");
                bootElement.style.setProperty("display", "none", "important");
                bootElement.style.setProperty("visibility", "hidden", "important");
                bootElement.style.setProperty("pointer-events", "none", "important");
                // Ensure main dashboard is fully visible
                const dashElement = document.getElementById("main-dashboard");
                dashElement.style.setProperty("display", "flex", "important");
                dashElement.style.setProperty("visibility", "visible", "important");
                // Final scroll reset lock for all elements
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
                document.body.scroll(0, 0);
            }, 800);
            
            // Auto start lo-fi ambient beats once dashboard opens to maximize cozy vibe
            setTimeout(() => {
                toggleMusicPlayback(true);
            }, 800);
        }, 600);
    });

    // Support submitting by Enter key
    authInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && authInput.value.trim().length > 0) {
            loginBtn.click();
        }
    });

    // ==========================================================================
    // MAIN DESK & TV WALL MONITOR LOGIC
    // ==========================================================================
    
    // SFX Mute/Unmute Toggle
    const soundToggle = document.getElementById("btn-sound-toggle");
    soundToggle.addEventListener("click", () => {
        isSoundOn = !isSoundOn;
        if (isSoundOn) {
            soundToggle.innerHTML = '<span class="btn-skew-content"><i class="fa-solid fa-volume-high"></i> SFX: ON</span>';
            playClickSound();
        } else {
            soundToggle.innerHTML = '<span class="btn-skew-content"><i class="fa-solid fa-volume-xmark"></i> SFX: OFF</span>';
        }
    });

    // Cinnamoroll interactive speech scripts on hover & click
    const cinnamorollLines = [
        "Happy Birthday, Proxy! Let's crack open the S-Rank memory channels!",
        "Wow! The Hollow energy scanner is showing off-the-charts sweetness today!",
        "Need a snack, Proxy? I brought some cinnamon rolls from the Random Play kitchen!",
        "Don't worry about the Hollow Raiders, Proxy! I'll protect you with S-Rank cuteness!",
        "You are my favourite partner. Let's make this day absolute perfection!"
    ];

    const mascotMascot = document.getElementById("mascot-trigger");
    const mascotBubble = document.getElementById("mascot-speech");

    function triggerMascotDialogue() {
        const randomIndex = Math.floor(Math.random() * cinnamorollLines.length);
        mascotBubble.textContent = cinnamorollLines[randomIndex];
        
        // Synthesize cute electronic squeak chirp
        if (isSoundOn) {
            initAudio();
            try {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(2000, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.15);
            } catch(e) {}
        }
    }

    mascotMascot.addEventListener("mouseenter", triggerMascotDialogue);
    mascotMascot.addEventListener("click", triggerMascotDialogue);

    // Monitor overlays handling
    const monitors = document.querySelectorAll(".crt-monitor");
    monitors.forEach(monitor => {
        monitor.addEventListener("click", () => {
            const targetModalId = monitor.getAttribute("data-target");
            const modal = document.getElementById(targetModalId);
            
            playTapeLatchSound();
            
            // Screen static flicker aberration trigger
            const glitchOverlay = document.getElementById("glitch-overlay");
            glitchOverlay.classList.add("active");
            
            setTimeout(() => {
                glitchOverlay.classList.remove("active");
                modal.classList.remove("hidden");
                
                // Specific animations depending on which modal is loaded
                if (targetModalId === "modal-agent") {
                    modal.classList.add("active-stat");
                }
                
                if (targetModalId === "modal-letter") {
                    startLetterTypewriter();
                }
            }, 150);
        });
    });

    // Modal close triggers
    const closeBtns = document.querySelectorAll("[data-close]");
    closeBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const modal = e.target.closest(".modal-overlay");
            playTapeLatchSound();
            modal.classList.add("hidden");
            if (modal.id === "modal-agent") {
                modal.classList.remove("active-stat");
            }
        });
    });

    // Close modal by clicking background overlay
    const overlays = document.querySelectorAll(".modal-overlay");
    overlays.forEach(overlay => {
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) {
                playTapeLatchSound();
                overlay.classList.add("hidden");
                if (overlay.id === "modal-agent") {
                    overlay.classList.remove("active-stat");
                }
            }
        });
    });

    // ==========================================================================
    // TAPE CASSETTE CONTROLS BINDINGS
    // ==========================================================================
    
    document.getElementById("deck-play").addEventListener("click", () => toggleMusicPlayback(true));
    document.getElementById("deck-pause").addEventListener("click", () => toggleMusicPlayback(false));
    document.getElementById("deck-stop").addEventListener("click", resetTape);

    // ==========================================================================
    // BIRTHDAY LETTER DECRYPTION TYPEWRITER
    // ==========================================================================
    
    const letterText = `Happy Birthday to the most amazing S-Rank Sensation in my entire universe! 💖

We run "Random Play" together, but honestly, every single day with you feels like the ultimate jackpot pull. No matter what crazy "Hollows" life decides to throw at us, I know we'll always co-op through them with maximum sync rates and absolute ease. 

Thank you for being my anchor, my favorite sleeping partner, and the absolute sweetest energy source in existence. Cinnamoroll and I have locked down this declassified security sector to guarantee that your new level cap is filled with endless cake, cozy blankets, SSS-class love, and beautiful adventures. 

I'm incredibly lucky to have you as my permanent co-op partner. I love you SSS-much! Happy Birthday!`;

    const typingContainer = document.getElementById("letter-typing-area");

    function startLetterTypewriter() {
        if (letterTyped) return;
        letterTyped = true;
        typingContainer.textContent = "";
        
        let charIndex = 0;
        function typeChar() {
            if (charIndex < letterText.length) {
                const char = letterText.charAt(charIndex);
                
                if (char === "\n") {
                    typingContainer.appendChild(document.createElement("br"));
                } else {
                    const span = document.createElement("span");
                    span.textContent = char;
                    typingContainer.appendChild(span);
                }
                
                // Play typewriter sound (only occasionally to avoid auditory overload!)
                if (Math.random() > 0.4 && char !== " " && char !== "\n") {
                    playTypewriterClick();
                }
                
                charIndex++;
                // Speed up slightly for paragraphs to keep reading flow fast
                const delay = char === "." || char === "!" || char === "?" ? 350 : 25;
                setTimeout(typeChar, delay);
            }
        }
        
        setTimeout(typeChar, 400);
    }

    // ==========================================================================
    // CANVAS DUST & CONFETTI PARTICLE SYSTEM
    // ==========================================================================
    
    const confettiBtn = document.getElementById("btn-confetti");
    
    confettiBtn.addEventListener("click", () => {
        playSuccessJingle();
        createConfettiStorm();
    });

    function createConfettiStorm() {
        const particleCount = 100;
        const colors = ['#ffd000', '#00ffcc', '#92d3f5', '#ff3b30', '#ffffff'];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div");
            particle.className = "confetti-particle";
            
            // Random properties
            const size = 5 + Math.random() * 8;
            const left = Math.random() * window.innerWidth;
            const animDuration = 2 + Math.random() * 3;
            const delay = Math.random() * 0.5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.position = 'fixed';
            particle.style.top = '-10px';
            particle.style.left = `${left}px`;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.backgroundColor = color;
            particle.style.boxShadow = `0px 0px 8px ${color}`;
            particle.style.zIndex = '9999';
            particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            particle.style.pointerEvents = 'none';
            particle.style.transform = `rotate(${Math.random() * 360}deg)`;
            
            // Fall animation using inline keyframes inject
            particle.style.animation = `fall-down ${animDuration}s linear ${delay}s forwards`;
            
            document.body.appendChild(particle);
            
            // Remove after animation finishes
            setTimeout(() => {
                particle.remove();
            }, (animDuration + delay) * 1000);
        }
    }

    // Inject fall animation stylesheet rules
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes fall-down {
            0% {
                top: -10px;
                transform: translateX(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                opacity: 0.9;
            }
            100% {
                top: 105vh;
                transform: translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 720}deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
