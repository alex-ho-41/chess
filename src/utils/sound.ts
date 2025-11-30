const moveAudio = new Audio('/sounds/move.mp3')
const captureAudio = new Audio('/sounds/capture.mp3')
const checkAudio = new Audio('/sounds/notify.mp3')

// Preload sounds
moveAudio.load()
captureAudio.load()
checkAudio.load()

function playSound(audio: HTMLAudioElement) {
    audio.currentTime = 0
    audio.play().catch(e => console.error('Audio playback failed', e))
}

export function playMoveSound() {
    playSound(moveAudio)
}

export function playCaptureSound() {
    playSound(captureAudio)
}

export function playCheckSound() {
    playSound(checkAudio)
}
