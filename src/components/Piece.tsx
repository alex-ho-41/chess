import { useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { PieceIcons } from './PieceIcons'

interface PieceProps {
    piece: { type: string; color: string }
    position: string
}

export default function Piece({ piece, position }: PieceProps) {
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: 'piece',
        item: { id: `${piece.color}${piece.type}`, position },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [piece, position])

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [])

    const pieceCode = `${piece.color}${piece.type.toUpperCase()}`
    const Icon = PieceIcons[pieceCode]

    return (
        <div
            ref={drag as any}
            className={`w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center transition-transform hover:scale-110 ${isDragging ? 'opacity-50' : 'opacity-100'
                }`}
        >
            {Icon}
        </div>
    )
}
