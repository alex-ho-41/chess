import { useDrop } from 'react-dnd'
import Piece from './Piece'

interface SquareProps {
    position: string
    piece: { type: string; color: string } | null
    isBlack: boolean
    onMove: (move: { from: string; to: string }) => void
    highlight: boolean
    isValidMove?: boolean
    isSelected?: boolean
    onClick?: () => void
}

export default function Square({ position, piece, isBlack, onMove, highlight, isValidMove, isSelected, onClick }: SquareProps) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'piece',
        drop: (item: { position: string }) => {
            onMove({ from: item.position, to: position })
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [onMove, position])

    const bgColor = isBlack ? 'bg-chess-board-dark' : 'bg-chess-board-light'
    const highlightColor = highlight ? 'ring-inset ring-4 ring-yellow-400/50' : ''
    const dropColor = isOver && canDrop ? 'bg-yellow-200/50' : ''
    const selectedColor = isSelected ? 'bg-yellow-200/80' : ''

    return (
        <div
            ref={drop as any}
            onClick={onClick}
            className={`w-16 h-16 flex items-center justify-center relative ${selectedColor || bgColor} ${highlightColor} ${dropColor} cursor-pointer`}
        >
            {piece && <Piece piece={piece} position={position} />}

            {/* Valid move indicator */}
            {isValidMove && (
                <div className={`absolute w-4 h-4 rounded-full ${piece ? 'border-4 border-stone-800/20' : 'bg-stone-800/20'}`} />
            )}

            {/* Coordinate labels */}
            {position.endsWith('1') && (
                <span className={`absolute bottom-0.5 right-1 text-[10px] font-bold ${isBlack ? 'text-chess-board-light' : 'text-chess-board-dark'}`}>
                    {position[0]}
                </span>
            )}
            {position.startsWith('a') && (
                <span className={`absolute top-0.5 left-1 text-[10px] font-bold ${isBlack ? 'text-chess-board-light' : 'text-chess-board-dark'}`}>
                    {position[1]}
                </span>
            )}
        </div>
    )
}
