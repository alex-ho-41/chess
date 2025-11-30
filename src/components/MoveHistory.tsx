import { Move } from 'chess.js'

interface MoveHistoryProps {
    history: Move[]
}

export default function MoveHistory({ history }: MoveHistoryProps) {
    const moves = []
    for (let i = 0; i < history.length; i += 2) {
        moves.push({
            white: history[i],
            black: history[i + 1],
            number: Math.floor(i / 2) + 1
        })
    }

    return (
        <div className="w-64 h-[600px] bg-stone-800 rounded-lg border border-stone-700 flex flex-col overflow-hidden shadow-xl">
            <div className="p-4 bg-stone-900 border-b border-stone-700">
                <h2 className="text-xl font-bold text-stone-200 font-serif">Move History</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-stone-600 scrollbar-track-transparent">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-stone-500 text-sm border-b border-stone-700">
                            <th className="py-2 pl-2 font-medium">#</th>
                            <th className="py-2 font-medium">White</th>
                            <th className="py-2 font-medium">Black</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moves.map((move) => (
                            <tr key={move.number} className="text-stone-300 hover:bg-stone-700/50 transition-colors text-sm">
                                <td className="py-1 pl-2 text-stone-500 w-8">{move.number}.</td>
                                <td className="py-1 font-mono">{move.white.san}</td>
                                <td className="py-1 font-mono">{move.black?.san || ''}</td>
                            </tr>
                        ))}
                        {moves.length === 0 && (
                            <tr>
                                <td colSpan={3} className="py-8 text-center text-stone-600 italic">
                                    Game start
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
