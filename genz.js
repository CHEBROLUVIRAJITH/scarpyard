document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const micButton = document.getElementById('micButton');
    const statusBar = document.getElementById('statusBar');
    const originalTextElement = document.getElementById('originalText');
    const genZTextElement = document.getElementById('genZText');
    const playButton = document.getElementById('playButton');
    
    // Speech recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        statusBar.textContent = "Speech recognition not supported in this browser. Try Chrome!";
        micButton.style.backgroundColor = "#888";
        return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Changed to true for continuous listening
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    let isRecording = false;
    let finalTranscript = '';
    let genZTranslation = '';
    
    // Gen Z conversion rules
    const genZDictionary = {
        // Common replacements
        "cool": "bussin",
        "very": "mad",
        "really": "fr",
        "for real": "fr",
        "friend": "bestie",
        "friends": "besties",
        "amazing": "fire",
        "good": "valid",
        "bad": "mid",
        "extremely": "lowkey",
        "definitely": "no cap",
        "yes": "bet",
        "no": "cap",
        "what": "what the actual",
        "seriously": "deadass",
        "crazy": "wildin",
        "laughing": "crying",
        "funny": "sending me",
        "excited": "hyped",
        "absolute": "straight",
        "absolutely": "straight up",
        "truth": "facts",
        "true": "facts",
        "awesome": "elite",
        "excellent": "goated",
        "upset": "pressed",
        "angry": "pressed",
        "relatable": "mood",
        "tired": "dead",
        "exhausted": "dead",
        "impressive": "hits different",
        "interesting": "slaps",
        "boring": "basic",
        "authentic": "real one",
        "love": "stan",
        "great": "slays",
        "oh my god": "omg",
        "flirting": "rizz",
        "style": "aesthetic",
        "knowledge": "tea",
        "gossip": "tea",
        "information": "tea",
        "suspicious": "sus",
        "weird": "sus",
        "attractive": "a vibe",
        "understand": "vibe with",
        "parents": "the rents",
        "embarrassing": "cringe",
        "embarrassed": "cringed",
        "talking": "spilling",
        "nice": "clean",
        "stupid": "sus",
        "agree": "cosign",
        "look": "peep",
        "see": "peep",
        "expensive": "boujee",
        "fancy": "boujee",
        "rich": "boujee"
    };
    
    // Phrases to add at beginning/end
    const genZPrefixes = [
        "Bestie, ",
        "Listen, ",
        "No cap, ",
        "Deadass, ",
        "Fr fr, ",
        "I mean, ",
        "Like literally, ",
        "Ngl, ",
        "Bruh, ",
        "Lowkey, ",
        "Highkey, ",
        "Yo, ",
        "Straight up, ",
        "Tbh, ",
        "Vibes check: ",
        "It's giving ",
        ""
    ];
    
    const genZSuffixes = [
        " fr",
        " no cap",
        " tbh",
        " lowkey",
        " tho",
        " ngl",
        " and I stand by that",
        " it's giving main character energy",
        " period",
        " sheesh",
        " I'm dead",
        " istg",
        " slay",
        " not me being obsessed",
        " living for this",
        " and that's on periodt",
        " respectfully",
        " *skull emoji*",
        " *crying emoji*",
        ""
    ];
    
    // Gen Z patterns
    const replaceGenZPatterns = (text) => {
        let result = text.toLowerCase();
        
        // Replace dictionary words
        for (const [standard, genZ] of Object.entries(genZDictionary)) {
            const regex = new RegExp(`\\b${standard}\\b`, 'gi');
            result = result.replace(regex, genZ);
        }
        
        // Add random Gen Z prefix (40% chance)
        if (Math.random() < 0.4) {
            const randomPrefix = genZPrefixes[Math.floor(Math.random() * genZPrefixes.length)];
            result = randomPrefix + result;
        }
        
        // Add random Gen Z suffix (50% chance)
        if (Math.random() < 0.5) {
            const randomSuffix = genZSuffixes[Math.floor(Math.random() * genZSuffixes.length)];
            result = result + randomSuffix;
        }
        
        // Replace "I" with "me" in some contexts (20% chance)
        if (Math.random() < 0.2) {
            result = result.replace(/\bi\b/g, "me");
        }
        
        // Add slang patterns
        result = result
            // Repetition for emphasis
            .replace(/\b(yes|yeah|no)\b/gi, match => match + " " + match)
            // Abbreviate words
            .replace(/\bbecause\b/gi, "bc")
            .replace(/\byou\b/gi, "u")
            .replace(/\byour\b/gi, "ur")
            .replace(/\bthat\b/gi, "dat")
            .replace(/\bwith\b/gi, "w/")
            .replace(/\bwithout\b/gi, "w/o")
            .replace(/\bto be honest\b/gi, "tbh")
            .replace(/\bin my opinion\b/gi, "imo")
            .replace(/\bi don't know\b/gi, "idk")
            .replace(/\bi swear to god\b/gi, "istg")
            .replace(/\bthank you\b/gi, "ty")
            .replace(/\bi love you\b/gi, "ily")
            .replace(/\bon god\b/gi, "ong")
            .replace(/\bfor real\b/gi, "fr")
            .replace(/\bnot going to lie\b/gi, "ngl")
            .replace(/\bto be fair\b/gi, "tbf")
            .replace(/\boh my god\b/gi, "omg");
        
        // Convert to sentence case but keep abbreviations as is
        result = result.charAt(0).toUpperCase() + result.slice(1);
        
        return result;
    };
    
    // Create loading animation element
    const createLoadingElement = () => {
        const loadingWaves = document.createElement('div');
        loadingWaves.className = 'loading-waves';
        for (let i = 0; i < 4; i++) {
            const dot = document.createElement('div');
            loadingWaves.appendChild(dot);
        }
        return loadingWaves;
    };
    
    // Event listeners for recognition
    recognition.onstart = () => {
        isRecording = true;
        micButton.classList.add('recording');
        statusBar.textContent = "Listening...";
        finalTranscript = '';
        originalTextElement.textContent = '';
        genZTextElement.textContent = '';
        playButton.disabled = true;
    };
    
    recognition.onresult = (event) => {
        let interimTranscript = '';
        
        // Build the transcript from all results
        finalTranscript = '';
        for (let i = 0; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        // Display the transcript in real-time
        originalTextElement.textContent = finalTranscript + interimTranscript;
        
        // Translate as-you-go for a better real-time experience
        if (finalTranscript || interimTranscript) {
            const textToTranslate = finalTranscript || interimTranscript;
            genZTranslation = replaceGenZPatterns(textToTranslate);
            genZTextElement.textContent = genZTranslation;
        }
    };
    
    recognition.onend = () => {
        if (isRecording) {
            // If still recording but recognition ended (timeout), restart it
            // This helps with longer speeches
            recognition.start();
            return;
        }
        
        micButton.classList.remove('recording');
        
        if (finalTranscript) {
            statusBar.textContent = "Translation complete!";
            playButton.disabled = false;
        } else {
            statusBar.textContent = "No speech detected. Try again?";
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        isRecording = false;
        micButton.classList.remove('recording');
        
        if (event.error === 'no-speech') {
            statusBar.textContent = "No speech detected. Try again?";
        } else if (event.error === 'aborted') {
            statusBar.textContent = "Listening stopped";
        } else {
            statusBar.textContent = `Error: ${event.error}. Try again?`;
        }
    };
    
    // Mic button click handler
    micButton.addEventListener('click', () => {
        if (isRecording) {
            isRecording = false; // Set this first so onend doesn't restart
            recognition.stop();
            statusBar.textContent = "Stopped listening";
        } else {
            try {
                recognition.start();
            } catch (err) {
                console.error('Recognition start error:', err);
                statusBar.textContent = "Couldn't start speech recognition. Try refreshing the page.";
            }
        }
    });
    
    // Play button functionality for speech synthesis
    playButton.addEventListener('click', () => {
        if (!genZTranslation) return;
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        // Speech synthesis
        const utterance = new SpeechSynthesisUtterance(genZTranslation);
        utterance.rate = 1.1; // Slightly faster than normal
        utterance.pitch = 1.1; // Slightly higher pitch
        
        // Get available voices
        let voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            // If voices aren't loaded yet, wait a bit and try again
            setTimeout(() => {
                voices = window.speechSynthesis.getVoices();
                setVoiceAndSpeak();
            }, 100);
        } else {
            setVoiceAndSpeak();
        }
        
        function setVoiceAndSpeak() {
            // Try to find a good English voice
            const youngVoices = voices.filter(voice => 
                voice.lang.startsWith('en-') && 
                !voice.name.includes('Microsoft David')
            );
            
            if (youngVoices.length > 0) {
                utterance.voice = youngVoices[Math.floor(Math.random() * youngVoices.length)];
            }
            
            // Status update
            statusBar.textContent = "Playing translation...";
            playButton.disabled = true;
            
            // Play the speech
            window.speechSynthesis.speak(utterance);
            
            // When speech ends
            utterance.onend = () => {
                statusBar.textContent = "Ready for another translation";
                playButton.disabled = false;
            };
            
            // Fallback in case onend doesn't fire (happens in some browsers)
            setTimeout(() => {
                if (statusBar.textContent === "Playing translation...") {
                    statusBar.textContent = "Ready for another translation";
                    playButton.disabled = false;
                }
            }, 5000 + (genZTranslation.length * 80)); // Rough estimate of speech duration
        }
    });
    
    // Initialize voice list for speech synthesis
    if ('speechSynthesis' in window) {
        // Chrome and Firefox have different ways of loading voices
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
        
        // Try to pre-load voices
        window.speechSynthesis.getVoices();
    } else {
        playButton.disabled = true;
        playButton.textContent = "Speech synthesis not supported";
    }
    
    // Add permission handling
    const checkMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            statusBar.textContent = "Tap the mic to start speaking";
        } catch (err) {
            statusBar.textContent = "Microphone access denied. Please enable it in your browser settings.";
            micButton.style.backgroundColor = "#888";
            console.error('Permission error:', err);
        }
    };
    
    // Check microphone permission on load
    checkMicrophonePermission();
});