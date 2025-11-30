import { PieceIcons } from './PieceIcons'

interface PromotionDialogProps {
    isOpen: boolean
    color: 'w' | 'b'
    onSelect: (piece: string) => void
}

export default function PromotionDialog({ isOpen, color, onSelect }: PromotionDialogProps) {
    if (!isOpen) return null

    const pieces = ['q', 'r', 'b', 'n']

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#262421] p-6 rounded-xl shadow-2xl border border-stone-700">
                <h3 className="text-stone-200 text-lg font-bold mb-4 text-center">Promote Pawn</h3>
                <div className="flex gap-4">
                    {pieces.map((p) => (
                        <button
                            key={p}
                            onClick={() => onSelect(p)}
                            className="w-16 h-16 bg-stone-700/50 hover:bg-stone-600 rounded-lg flex items-center justify-center transition-colors border border-stone-600 hover:border-stone-500"
                        >
                            <div className="w-12 h-12">
                                {PieceIcons[`${color}${p.toUpperCase()}`]}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
