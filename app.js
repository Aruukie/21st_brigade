/**
 * Cinnamoroll × Zenless Zone Zero (ZZZ) "Random Play" Birthday Sub-Net
 * Core Frontend Logic, Cassette Playback & UI Sound Effects
 */

document.addEventListener("DOMContentLoaded", () => {
    // STATE VARIABLES
    let isSoundOn = true;
    let proxyName = "Sweetheart";
    let isMusicPlaying = false;
    let letterTyped = false;

    // UI SOUND EFFECTS (Web Audio API)
    // The Sound Archive itself plays real audio files through the cassette deck.
    let audioCtx = null;
    
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

    // SOUND ARCHIVE SONGS
    // The cassette deck plays local static audio files. encodeURI keeps Vercel URLs safe.
    function assetPath(path) {
        return encodeURI(path);
    }

    const soundArchivePlaylists = [
        {
            title: "Who Knows",
            artist: "Daniel Caesar",
            cassetteTitle: "WHO KNOWS",
            code: "TAPE A",
            duration: 226,
            audioSources: [assetPath("assets/MUSIC FINAL/Who Knows.mp3")],
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/3b/c0/c5/3bc0c51d-33f2-ee19-e148-6d8f2c50df24/25UMGIM90843.rgb.jpg/300x300bb.jpg",
        },
        {
            title: "Superpowers",
            artist: "Daniel Caesar",
            cassetteTitle: "SUPERPOWERS",
            code: "TAPE B",
            duration: 175,
            audioSources: [assetPath("assets/MUSIC FINAL/Daniel Caesar - Superpowers (Official Audio).mp3")],
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/24/4f/ec/244fec58-ea20-e0b0-eea6-e06c6aff948b/23UMGIM14483.rgb.jpg/300x300bb.jpg",
        },
        {
            title: "See You Again",
            artist: "Tyler, The Creator",
            cassetteTitle: "SEE YOU AGAIN",
            code: "TAPE C",
            duration: 180,
            audioSources: [assetPath("assets/MUSIC FINAL/Tyler, The Creator - See You Again (Audio) ft. Kali Uchis (1).mp3")],
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/fd/fd/8c/fdfd8c26-b8f9-4768-41d3-b24773250c65/886446605814.jpg/300x300bb.jpg",
        },
        {
            title: "Roommates",
            artist: "Malcolm Todd",
            cassetteTitle: "ROOMMATES",
            code: "TAPE D",
            duration: 215,
            audioSources: [assetPath("assets/MUSIC FINAL/Malcolm Todd - Roommates (Audio).mp3")],
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/33/b8/5a/33b85ad4-cfd1-bcb8-444b-15329d4965ef/196871375542.jpg/300x300bb.jpg",
        },
        {
            title: "Pasilyo",
            artist: "SunKissed Lola",
            cassetteTitle: "PASILYO",
            code: "TAPE E",
            duration: 270,
            audioSources: [assetPath("assets/MUSIC FINAL/SunKissed Lola - Pasilyo (Official Lyric Video).mp3")],
            coverUrl: "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/73/0c/ef/730cefeb-f4ad-d503-0a25-f34f933c34d6/5063161188159_cover.jpg/300x300bb.jpg",
        }
    ];

    let activePlaylistIndex = 0;
    let activePlaylist = soundArchivePlaylists[activePlaylistIndex];
    let audioSourceAttempt = 0;
    const cassetteAudio = new Audio();
    cassetteAudio.preload = "metadata";

    function formatTime(totalSeconds) {
        const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
        const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function renderPlaylistOptions() {
        const optionsContainer = document.getElementById("playlist-options");
        optionsContainer.innerHTML = "";

        soundArchivePlaylists.forEach((playlist, index) => {
            const button = document.createElement("button");
            button.className = "playlist-option";
            button.type = "button";
            button.dataset.playlistIndex = index;
            button.innerHTML = `
                <span class="playlist-option-name">${playlist.title}</span>
                <span class="playlist-option-artist">${playlist.artist}</span>
                <span class="playlist-option-code">${playlist.code}</span>
            `;
            button.addEventListener("click", () => selectPlaylist(index));
            optionsContainer.appendChild(button);
        });
    }

    function updatePlaylistDisplay() {
        document.getElementById("current-track-name").textContent = `${activePlaylist.title} - ${activePlaylist.artist}`;
        document.getElementById("cassette-playlist-title").textContent = activePlaylist.cassetteTitle;
        document.getElementById("cassette-playlist-artist").textContent = activePlaylist.artist.toUpperCase();
        document.getElementById("track-total-duration").textContent = formatTime(activePlaylist.duration);
        const coverArt = document.getElementById("cassette-cover-art");
        coverArt.src = activePlaylist.coverUrl;
        coverArt.alt = `${activePlaylist.title} cover art`;

        document.querySelectorAll(".playlist-option").forEach((button, index) => {
            button.classList.toggle("active-playlist", index === activePlaylistIndex);
        });
    }

    function loadActiveAudioTrack() {
        audioSourceAttempt = 0;
        cassetteAudio.src = activePlaylist.audioSources[audioSourceAttempt];
        cassetteAudio.load();
        document.getElementById("track-time-elapsed").textContent = "00:00";
        document.getElementById("music-progress-fill").style.width = "0%";
    }

    function tryNextAudioSource() {
        audioSourceAttempt++;
        if (audioSourceAttempt < activePlaylist.audioSources.length) {
            cassetteAudio.src = activePlaylist.audioSources[audioSourceAttempt];
            cassetteAudio.load();
            if (isMusicPlaying) {
                cassetteAudio.play().catch(() => tryNextAudioSource());
            }
            return;
        }

        isMusicPlaying = false;
        setDeckPlayingState(false);
    }

    function selectPlaylist(nextIndex) {
        const playlistCount = soundArchivePlaylists.length;
        const normalizedIndex = (nextIndex + playlistCount) % playlistCount;
        if (normalizedIndex === activePlaylistIndex) return;

        const wasPlaying = isMusicPlaying;
        if (wasPlaying) {
            toggleMusicPlayback(false);
        }

        activePlaylistIndex = normalizedIndex;
        activePlaylist = soundArchivePlaylists[activePlaylistIndex];

        updatePlaylistDisplay();
        loadActiveAudioTrack();
        playClickSound();

        if (wasPlaying) {
            toggleMusicPlayback(true);
        }
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
        if (play && !isMusicPlaying) {
            playTapeLatchSound();
            if (!cassetteAudio.src || audioSourceAttempt >= activePlaylist.audioSources.length) {
                loadActiveAudioTrack();
            }

            cassetteAudio.play()
                .then(() => {
                    isMusicPlaying = true;
                    setDeckPlayingState(true);
                })
                .catch(() => {
                    isMusicPlaying = false;
                    setDeckPlayingState(false);
                });
        } else if (!play && isMusicPlaying) {
            playTapeLatchSound();
            isMusicPlaying = false;
            cassetteAudio.pause();
            setDeckPlayingState(false);
        }
    }

    function setDeckPlayingState(playing) {
        document.getElementById("reel-left").classList.toggle("playing", playing);
        document.getElementById("reel-right").classList.toggle("playing", playing);
        document.getElementById("modal-music").classList.toggle("playing-deck", playing);
        document.getElementById("deck-play").disabled = playing;
        document.getElementById("deck-pause").disabled = !playing;
        document.getElementById("deck-play").classList.toggle("active-btn", playing);
        document.getElementById("deck-pause").classList.toggle("active-btn", !playing);

        if (!playing) {
            animateEqualizerBars();
        }
    }

    function updateMusicProgress() {
        const duration = Number.isFinite(cassetteAudio.duration) ? cassetteAudio.duration : activePlaylist.duration;
        const elapsedSeconds = cassetteAudio.currentTime || 0;
        
        // Update numeric counter display
        document.getElementById("track-time-elapsed").textContent = formatTime(elapsedSeconds);
        
        // Progress bar filling
        const percent = duration > 0 ? (elapsedSeconds / duration) * 100 : 0;
        document.getElementById("music-progress-fill").style.width = `${percent}%`;

        if (isMusicPlaying) {
            animateEqualizerBars();
        }
    }

    function resetTape() {
        toggleMusicPlayback(false);
        cassetteAudio.currentTime = 0;
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
        document.body.classList.add("proxy-initialized");

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
    document.getElementById("playlist-prev").addEventListener("click", () => selectPlaylist(activePlaylistIndex - 1));
    document.getElementById("playlist-next").addEventListener("click", () => selectPlaylist(activePlaylistIndex + 1));
    renderPlaylistOptions();
    updatePlaylistDisplay();
    loadActiveAudioTrack();

    cassetteAudio.addEventListener("loadedmetadata", () => {
        if (Number.isFinite(cassetteAudio.duration)) {
            activePlaylist.duration = cassetteAudio.duration;
            document.getElementById("track-total-duration").textContent = formatTime(cassetteAudio.duration);
        }
    });
    cassetteAudio.addEventListener("timeupdate", updateMusicProgress);
    cassetteAudio.addEventListener("ended", resetTape);
    cassetteAudio.addEventListener("error", tryNextAudioSource);

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
