import { useState, useEffect, useCallback } from 'react'
import { Chess } from 'chess.js'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Board from './Board'
import MoveHistory from './MoveHistory'
import PromotionDialog from './PromotionDialog'
import CustomDragLayer from './CustomDragLayer'
import GameOptionsDialog from './GameOptionsDialog'
import Timer from './Timer'
import { playMoveSound, playCaptureSound, playCheckSound } from '../utils/sound'
import { getBestMove } from '../utils/ai'

const INITIAL_TIME = 600 // 10 minutes in seconds

export default function Game() {
    const [game, setGame] = useState(new Chess())
    const [fen, setFen] = useState(game.fen())
    const [status, setStatus] = useState('')
    const [promotionMove, setPromotionMove] = useState<{ from: string; to: string } | null>(null)

    // Timer State
    const [whiteTime, setWhiteTime] = useState(INITIAL_TIME)
    const [blackTime, setBlackTime] = useState(INITIAL_TIME)
    const [isTimerActive, setIsTimerActive] = useState(false)

    // AI State
    const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('pvp')
    const [aiColor, setAiColor] = useState<'w' | 'b' | null>(null)
    const [showNewGameDialog, setShowNewGameDialog] = useState(true)
    const [isAiThinking, setIsAiThinking] = useState(false)

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null

        if (isTimerActive && !game.isGameOver()) {
            interval = setInterval(() => {
                if (game.turn() === 'w') {
                    setWhiteTime(t => {
                        if (t <= 0) {
                            setIsTimerActive(false)
                            return 0
                        }
                        return t - 1
                    })
                } else {
                    setBlackTime(t => {
                        if (t <= 0) {
                            setIsTimerActive(false)
                            return 0
                        }
                        return t - 1
                    })
                }
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isTimerActive, game.turn(), game])

    // Check for timeout
    useEffect(() => {
        if (whiteTime === 0 || blackTime === 0) {
            setIsTimerActive(false)
        }
    }, [whiteTime, blackTime])

    useEffect(() => {
        updateStatus()

        // AI Move Logic
        if (gameMode === 'ai' && !game.isGameOver() && game.turn() === aiColor && !isAiThinking) {
            makeAiMove()
        }
    }, [game, fen, gameMode, aiColor, isAiThinking])

    function updateStatus() {
        let status = ''
        if (whiteTime === 0) {
            status = 'Time out! Black wins.'
        } else if (blackTime === 0) {
            status = 'Time out! White wins.'
        } else if (game.isCheckmate()) {
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

    const makeMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
        // Prevent player from moving AI's pieces
        if (gameMode === 'ai' && game.turn() === aiColor) {
            return false
        }

        // Check if game is over due to time
        if (whiteTime === 0 || blackTime === 0) return false

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
            const gameCopy = new Chess(game.fen())
            const result = gameCopy.move(move)
            if (result) {
                setGame(gameCopy)
                setFen(gameCopy.fen())
                if (!isTimerActive) setIsTimerActive(true)

                if (gameCopy.isCheck()) {
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
    }, [game, gameMode, aiColor, whiteTime, blackTime, isTimerActive])

    function makeAiMove() {
        console.log("makeAiMove started")
        setIsAiThinking(true)
        // Use setTimeout to allow UI to render "thinking" state
        setTimeout(() => {
            try {
                // Clone the game to avoid mutating the state object directly during calculation
                // and to prevent any corruption if calculation fails
                console.log("Cloning game for AI calculation")
                const gameCopy = new Chess(game.fen())
                console.log("Calling getBestMove")
                const bestMove = getBestMove(gameCopy)
                console.log("Best move found:", bestMove)

                if (bestMove) {
                    const gameCopyForMove = new Chess(game.fen())
                    const result = gameCopyForMove.move(bestMove)
                    if (result) {
                        setGame(gameCopyForMove)
                        setFen(gameCopyForMove.fen())
                        if (!isTimerActive) setIsTimerActive(true)

                        if (gameCopyForMove.isCheck()) {
                            playCheckSound()
                        } else if (result.captured) {
                            playCaptureSound()
                        } else {
                            playMoveSound()
                        }
                    }
                }
            } catch (e) {
                console.error("AI Move Error", e)
            } finally {
                setIsAiThinking(false)
            }
        }, 100)
    }

    function handlePromotion(piece: string) {
        if (promotionMove) {
            makeMove({ ...promotionMove, promotion: piece })
            setPromotionMove(null)
        }
    }

    function startNewGame(mode: 'pvp' | 'ai', aiCol?: 'w' | 'b') {
        const newGame = new Chess()
        setGame(newGame)
        setFen(newGame.fen())
        setPromotionMove(null)
        setGameMode(mode)
        setAiColor(aiCol || null)
        setWhiteTime(INITIAL_TIME)
        setBlackTime(INITIAL_TIME)
        setIsTimerActive(false)
        setShowNewGameDialog(false)
        setIsAiThinking(false)
    }

    // Determine if board should be flipped
    // Flip if user is playing Black (AI is White)
    const isFlipped = gameMode === 'ai' && aiColor === 'w'

    return (
        <DndProvider backend={HTML5Backend}>
            <CustomDragLayer />
            <div className="flex gap-8 items-start p-8 bg-[#262421] rounded-xl shadow-2xl border border-stone-800 relative">
                <div className="flex flex-col items-center gap-6">
                    <div className="text-2xl font-bold text-stone-200 font-serif tracking-wider h-8">
                        {status}
                    </div>

                    <Board game={game} onMove={makeMove} isFlipped={isFlipped} />

                    <button
                        onClick={() => setShowNewGameDialog(true)}
                        className="px-6 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg transition-colors font-medium shadow-md"
                    >
                        New Game
                    </button>
                </div>

                <div className="flex flex-col gap-6 w-64">
                    <Timer whiteTime={whiteTime} blackTime={blackTime} turn={game.turn()} />
                    <MoveHistory history={game.history({ verbose: true })} />
                </div>

                <PromotionDialog
                    isOpen={!!promotionMove}
                    color={game.turn()}
                    onSelect={handlePromotion}
                />

                <GameOptionsDialog
                    isOpen={showNewGameDialog}
                    onStartGame={startNewGame}
                    onCancel={() => setShowNewGameDialog(false)}
                />
            </div>
        </DndProvider>
    )
}
