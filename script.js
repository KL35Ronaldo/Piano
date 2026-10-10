let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Piano Note Frequencies (C3 to C5)
const notes = [
    { note: 'C3', freq: 130.81, type: 'white', keyBind: 'a', isC: true },
    { note: 'C#3', freq: 138.59, type: 'black' },
    { note: 'D3', freq: 146.83, type: 'white', keyBind: 's' },
    { note: 'D#3', freq: 155.56, type: 'black' },
    { note: 'E3', freq: 164.81, type: 'white', keyBind: 'd' },
    { note: 'F3', freq: 174.61, type: 'white', keyBind: 'f' },
    { note: 'F#3', freq: 185.00, type: 'black' },
    { note: 'G3', freq: 196.00, type: 'white', keyBind: 'g' },
    { note: 'G#3', freq: 207.65, type: 'black' },
    { note: 'A3', freq: 220.00, type: 'white', keyBind: 'h' },
    { note: 'A#3', freq: 233.08, type: 'black' },
    { note: 'B3', freq: 246.94, type: 'white', keyBind: 'j' },
    
    { note: 'C4', freq: 261.63, type: 'white', keyBind: 'k', isC: true }, // Middle C
    { note: 'C#4', freq: 277.18, type: 'black' },
    { note: 'D4', freq: 293.66, type: 'white', keyBind: 'l' },
    { note: 'D#4', freq: 311.13, type: 'black' },
    { note: 'E4', freq: 329.63, type: 'white', keyBind: ';' },
    { note: 'F4', freq: 349.23, type: 'white' },
    { note: 'F#4', freq: 369.99, type: 'black' },
    { note: 'G4', freq: 392.00, type: 'white' },
    { note: 'G#4', freq: 415.30, type: 'black' },
    { note: 'A4', freq: 440.00, type: 'white' },
    { note: 'A#4', freq: 466.16, type: 'black' },
    { note: 'B4', freq: 493.88, type: 'white' },
    { note: 'C5', freq: 523.25, type: 'white', isC: true }
];

const keyboardEl = document.getElementById('keyboard');
const keyElements = {};

// Build Keyboard Interface dynamically
let whiteKeyCount = 0;
notes.forEach((item) => {
    const key = document.createElement('div');
    key.className = `key ${item.type}-key`;
    
    if (item.type === 'white') {
        whiteKeyCount++;
        const label = document.createElement('span');
        label.className = `note-label ${item.isC ? 'c-note' : ''}`;
        label.innerText = item.isC ? item.note : '';
        key.appendChild(label);
    } else {
        key.style.left = `${(whiteKeyCount * 52) - 16}px`;
    }

    key.addEventListener('mousedown', () => playNote(item));
    key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        playNote(item);
    });

    keyboardEl.appendChild(key);
    if (item.keyBind) {
        keyElements[item.keyBind] = { item: item };
    }
});

// Sound Synthesis Function
function playNote(item) {
    initAudio();
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(item.freq, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.7, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 1.5);

    // Visual Key Activation Feedback
    const matchingKeyEl = Array.from(keyboardEl.children)[notes.indexOf(item)];
    if (matchingKeyEl) {
        matchingKeyEl.classList.add('active');
        setTimeout(() => matchingKeyEl.classList.remove('active'), 150);
    }
}

// Computer Keyboard Mapping
window.addEventListener('keydown', (e) => {
    const keyData = keyElements[e.key.toLowerCase()];
    if (keyData && !e.repeat) {
        playNote(keyData.item);
    }
});
