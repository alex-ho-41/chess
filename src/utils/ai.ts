import { Chess } from 'chess.js'

const PIECE_VALUES: Record<string, number> = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900,
}

// Piece-Square Tables (simplified)
// Higher numbers mean better positions for white. 
// For black, we mirror or negate.
const PAWN_PST = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 5, 5, 5, 5, 5, 5, 5],
    [1, 1, 2, 3, 3, 2, 1, 1],
    [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
    [0, 0, 0, 2, 2, 0, 0, 0],
    [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
    [0.5, 1, 1, -2, -2, 1, 1, 0.5],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

const KNIGHT_PST = [
    [-5, -4, -3, -3, -3, -3, -4, -5],
    [-4, -2, 0, 0, 0, 0, -2, -4],
    [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
    [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
    [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
    [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
    [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
    [-5, -4, -3, -3, -3, -3, -4, -5]
]

const BISHOP_PST = [
    [-2, -1, -1, -1, -1, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 1, 1, 0.5, 0, -1],
    [-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1],
    [-1, 0, 1, 1, 1, 1, 0, -1],
    [-1, 1, 1, 1, 1, 1, 1, -1],
    [-1, 0.5, 0, 0, 0, 0, 0.5, -1],
    [-2, -1, -1, -1, -1, -1, -1, -2]
]

const ROOK_PST = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0.5, 1, 1, 1, 1, 1, 1, 0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [0, 0, 0, 0.5, 0.5, 0, 0, 0]
]

const QUEEN_PST = [
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-0.5, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [0, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [-1, 0.5, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-1, 0, 0.5, 0, 0, 0, 0, -1],
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2]
]

const KING_PST = [
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-2, -3, -3, -4, -4, -3, -3, -2],
    [-1, -2, -2, -2, -2, -2, -2, -1],
    [2, 2, 0, 0, 0, 0, 2, 2],
    [2, 3, 1, 0, 0, 1, 3, 2]
]

function evaluateBoard(game: Chess): number {
    let totalEvaluation = 0
    const board = game.board()

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j]
            if (piece) {
                const value = PIECE_VALUES[piece.type]
                let pstValue = 0
                const pstRow = piece.color === 'w' ? i : 7 - i

                switch (piece.type) {
                    case 'p': pstValue = PAWN_PST[pstRow][j]; break;
                    case 'n': pstValue = KNIGHT_PST[pstRow][j]; break;
                    case 'b': pstValue = BISHOP_PST[pstRow][j]; break;
                    case 'r': pstValue = ROOK_PST[pstRow][j]; break;
                    case 'q': pstValue = QUEEN_PST[pstRow][j]; break;
                    case 'k': pstValue = KING_PST[pstRow][j]; break;
                }

                if (piece.color === 'w') {
                    totalEvaluation += value + pstValue
                } else {
                    totalEvaluation -= (value + pstValue)
                }
            }
        }
    }
    return totalEvaluation
}

function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): number {
    if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game)
    }

    const moves = game.moves()

    if (isMaximizingPlayer) {
        let maxEval = -Infinity
        for (const move of moves) {
            game.move(move)
            const evalValue = minimax(game, depth - 1, alpha, beta, false)
            game.undo()
            maxEval = Math.max(maxEval, evalValue)
            alpha = Math.max(alpha, evalValue)
            if (beta <= alpha) break
        }
        return maxEval
    } else {
        let minEval = Infinity
        for (const move of moves) {
            game.move(move)
            const evalValue = minimax(game, depth - 1, alpha, beta, true)
            game.undo()
            minEval = Math.min(minEval, evalValue)
            beta = Math.min(beta, evalValue)
            if (beta <= alpha) break
        }
        return minEval
    }
}
export function getBestMove(game: Chess, depth: number = 3): string | null {
    const moves = game.moves()
    if (moves.length === 0) return null

    let bestMove = null
    const currentTurn = game.turn()
    let bestValue = currentTurn === 'w' ? -Infinity : Infinity

    // Randomize moves to avoid deterministic behavior in equal positions
    moves.sort(() => Math.random() - 0.5)

    for (const move of moves) {
        game.move(move)

        // After making a move, it's the opponent's turn.
        // If I am White (game.turn() was 'w'), now it is Black's turn.
        // We want to evaluate the resulting position.
        // If the original turn was 'w', we are maximizing. So we want the result of minimax from Black's perspective (minimizing).
        // minimax(..., isMaximizingPlayer)
        // If it's Black's turn now, isMaximizingPlayer should be false.
        // So we pass game.turn() === 'w'.
        const boardValue = minimax(game, depth - 1, -Infinity, Infinity, game.turn() === 'w')
        game.undo()

        if (currentTurn === 'w') {
            if (boardValue > bestValue) {
                bestValue = boardValue
                bestMove = move
            }
        } else {
            if (boardValue < bestValue) {
                bestValue = boardValue
                bestMove = move
            }
        }
    }

    return bestMove
}
