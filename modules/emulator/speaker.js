const SPEAKER = {
    initialize() {
        // do nothing yet, but will do when sound is added
    },
    async beep(duration, frequency) {
        var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
        var oscillator = audioCtx.createOscillator();
        var gainNode = audioCtx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        gainNode.gain.value = -10;
        oscillator.frequency.value = frequency;
        
        oscillator.start(audioCtx.currentTime);
        return new Promise(resolve => {
            setTimeout(() => {
                oscillator.stop();
                resolve(true);
            }, duration);
        });
    }
};

export {
    SPEAKER
};