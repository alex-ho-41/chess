interface GameOverDialogProps {
    isOpen: boolean
    result: string
    onNewGame: () => void
}

export default function GameOverDialog({ isOpen, result, onNewGame }: GameOverDialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#262421] p-8 rounded-xl shadow-2xl border border-stone-700 w-96 text-center animate-in fade-in zoom-in duration-300">
                <h3 className="text-stone-200 text-3xl font-bold mb-2 font-serif">Game Over</h3>
                <p className="text-stone-400 text-lg mb-8">{result}</p>

                <button
                    onClick={onNewGame}
                    className="w-full py-3 bg-green-700 hover:bg-green-600 text-stone-100 rounded-lg transition-all font-bold shadow-lg text-lg transform hover:scale-105"
                >
                    New Game
                </button>
            </div>
        </div>
    )
}
