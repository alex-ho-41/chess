

interface TimerProps {
    whiteTime: number
    blackTime: number
    turn: 'w' | 'b'
}

export default function Timer({ whiteTime, blackTime, turn }: TimerProps) {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${turn === 'b' ? 'bg-stone-700 ring-2 ring-yellow-500/50' : 'bg-stone-800'
                }`}>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-black border border-stone-500"></div>
                    <span className="text-stone-300 font-medium">Black</span>
                </div>
                <span className={`font-mono text-xl font-bold ${turn === 'b' ? 'text-white' : 'text-stone-400'
                    }`}>
                    {formatTime(blackTime)}
                </span>
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg transition-colors ${turn === 'w' ? 'bg-stone-200 ring-2 ring-yellow-500/50' : 'bg-stone-300'
                }`}>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white border border-stone-400"></div>
                    <span className="text-stone-800 font-medium">White</span>
                </div>
                <span className={`font-mono text-xl font-bold ${turn === 'w' ? 'text-stone-900' : 'text-stone-600'
                    }`}>
                    {formatTime(whiteTime)}
                </span>
            </div>
        </div>
    )
}
