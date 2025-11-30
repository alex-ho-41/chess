import { useState, useEffect } from 'react'
import { Chess } from 'chess.js'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Board from './Board'
import MoveHistory from './MoveHistory'
import PromotionDialog from './PromotionDialog'
import CustomDragLayer from './CustomDragLayer'
import { playMoveSound, playCaptureSound, playCheckSound } from '../utils/sound'

export default function Game() {
    const [game, setGame] = useState(new Chess())
    const [fen, setFen] = useState(game.fen())
    const [status, setStatus] = useState('')
    const [promotionMove, setPromotionMove] = useState<{ from: string; to: string } | null>(null)

    useEffect(() => {
        updateStatus()
    }, [game, fen])

    function updateStatus() {
        let status = ''
        if (game.isCheckmate()) {
            status = `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins.`
        } else if (game.isDraw()) {
            status = 'Draw!'
        } else {
            status = `${game.turn() === 'w' ? 'White' : 'Black'}'s turn`
            if (game.isCheck()) {
                status += ' (Check!)'
            }
        }
        setStatus(status)
    }

    function makeMove(move: { from: string; to: string; promotion?: string }) {
        // Check if this move requires promotion
        const possibleMoves = game.moves({ verbose: true })
        const isPromotion = possibleMoves.some(m =>
            m.from === move.from &&
            m.to === move.to &&
            m.promotion
        )

        if (isPromotion && !move.promotion) {
            setPromotionMove(move)
            return false
        }

        try {
            const result = game.move(move)
            if (result) {
                setFen(game.fen())

                if (game.isCheck()) {
                    playCheckSound()
                } else if (result.captured) {
                    playCaptureSound()
                } else {
                    playMoveSound()
                }

                return true
            }
        } catch (e) {
            return false
        }
        return false
    }

    function handlePromotion(piece: string) {
        if (promotionMove) {
            makeMove({ ...promotionMove, promotion: piece })
            setPromotionMove(null)
        }
    }

    function resetGame() {
        const newGame = new Chess()
        setGame(newGame)
        setFen(newGame.fen())
        setPromotionMove(null)
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <CustomDragLayer />
            <div className="flex gap-8 items-start p-8 bg-[#262421] rounded-xl shadow-2xl border border-stone-800 relative">
                <div className="flex flex-col items-center gap-6">
                    <div className="text-2xl font-bold text-stone-200 font-serif tracking-wider h-8">
                        {status}
                    </div>

                    <Board game={game} onMove={makeMove} />

                    <button
                        onClick={resetGame}
                        className="px-6 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg transition-colors font-medium shadow-md"
                    >
                        New Game
                    </button>
                </div>

                <MoveHistory history={game.history({ verbose: true })} />

                <PromotionDialog
                    isOpen={!!promotionMove}
                    color={game.turn()}
                    onSelect={handlePromotion}
                />
            </div>
        </DndProvider>
    )
}
