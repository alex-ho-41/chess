import { useState } from 'react'
import { Chess } from 'chess.js'
import type { Square as SquareType } from 'chess.js'
import Square from './Square'

interface BoardProps {
    game: Chess
    onMove: (move: { from: string; to: string }) => void
    isFlipped?: boolean
}

export default function Board({ game, onMove, isFlipped = false }: BoardProps) {
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
    const board = game.board()

    // Last move highlighting
    const history = game.history({ verbose: true })
    const lastMove = history[history.length - 1]
    const lastMoveSquares = lastMove ? [lastMove.from, lastMove.to] : []

    // Valid moves for selected square
    const validMoves = selectedSquare
        ? game.moves({ square: selectedSquare as SquareType, verbose: true }).map(m => m.to)
        : []

    function handleSquareClick(square: string) {
        // If clicking on a square with a piece of the current turn's color, select it
        const piece = game.get(square as SquareType)
        if (piece && piece.color === game.turn()) {
            setSelectedSquare(square)
        } else if (selectedSquare) {
            // If a square is already selected, try to move to the clicked square
            const move = { from: selectedSquare, to: square }
            onMove(move)
            setSelectedSquare(null)
        }
    }

    const rows = isFlipped ? [...board].reverse() : board

    return (
        <div className="grid grid-cols-8 border-4 border-stone-800 rounded-sm overflow-hidden shadow-xl">
            {rows.map((row, rowIndex) => {
                const actualRowIndex = isFlipped ? 7 - rowIndex : rowIndex
                const displayRow = isFlipped ? [...row].reverse() : row

                return displayRow.map((piece, colIndex) => {
                    const actualColIndex = isFlipped ? 7 - colIndex : colIndex
                    const square = (String.fromCharCode(97 + actualColIndex) + (8 - actualRowIndex)) as SquareType

                    const isBlack = (actualRowIndex + actualColIndex) % 2 === 1
                    const highlight = lastMoveSquares.includes(square)
                    const isValidMove = validMoves.includes(square)
                    const isSelected = square === selectedSquare

                    return (
                        <Square
                            key={square}
                            position={square}
                            piece={piece}
                            isBlack={isBlack}
                            onMove={(move) => {
                                onMove(move)
                                setSelectedSquare(null)
                            }}
                            highlight={highlight}
                            isValidMove={isValidMove}
                            isSelected={isSelected}
                            onClick={() => handleSquareClick(square)}
                        />
                    )
                })
            })}
        </div>
    )
}
