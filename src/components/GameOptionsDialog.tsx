interface GameOptionsDialogProps {
    isOpen: boolean
    onStartGame: (mode: 'pvp' | 'ai', aiColor?: 'w' | 'b') => void
    onCancel: () => void
}

export default function GameOptionsDialog({ isOpen, onStartGame, onCancel }: GameOptionsDialogProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#262421] p-8 rounded-xl shadow-2xl border border-stone-700 w-96">
                <h3 className="text-stone-200 text-2xl font-bold mb-6 text-center font-serif">New Game</h3>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => onStartGame('pvp')}
                        className="w-full py-4 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg transition-all font-medium shadow-md flex items-center justify-center gap-3 text-lg group"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform">👥</span>
                        Play vs Friend
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-stone-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#262421] text-stone-500">OR PLAY COMPUTER</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => onStartGame('ai', 'b')}
                            className="py-3 bg-stone-100 hover:bg-white text-stone-900 rounded-lg transition-colors font-bold shadow-md flex flex-col items-center gap-1"
                        >
                            <span className="text-xl">♔</span>
                            Play as White
                        </button>
                        <button
                            onClick={() => onStartGame('ai', 'w')}
                            className="py-3 bg-stone-900 hover:bg-black text-stone-200 rounded-lg transition-colors font-bold shadow-md border border-stone-700 flex flex-col items-center gap-1"
                        >
                            <span className="text-xl">♚</span>
                            Play as Black
                        </button>
                    </div>

                    <button
                        onClick={onCancel}
                        className="mt-2 text-stone-500 hover:text-stone-400 text-sm underline"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
