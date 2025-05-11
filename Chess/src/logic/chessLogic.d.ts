import { PieceOnBoard, PieceType, PieceColor } from '../components/Board.tsx';


export interface Move {
  row: number;
  col: number;
}

export interface GameState {
  board: (PieceOnBoard | null)[][];
  currentTurn: PieceColor;
  selectedPiece: PieceOnBoard | null;
  possibleMoves: Move[];
  kingInCheckPos: Move | null;
  gameOver: boolean;
  gameMessage: string;
}


export const cloneBoard = (board: (PieceOnBoard | null)[][]): (PieceOnBoard | null)[][] => {
  return board.map(row => row.map(piece => (piece ? { ...piece } : null)));
};

export const findKing = (color: PieceColor, board: (PieceOnBoard | null)[][]): PieceOnBoard | null => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === 'king' && piece.color === color) {
        return piece;
      }
    }
  }
  return null;
};

// --- 말 이동 규칙 --- 
// 각 말의 이동 가능 경로 
const getRawMovesForPawn = (piece: PieceOnBoard, board: (PieceOnBoard | null)[][]): Move[] => {
  const moves: Move[] = [];
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;

  // 1칸 전진
  if (board[piece.row + direction] && board[piece.row + direction][piece.col] === null) {
    moves.push({ row: piece.row + direction, col: piece.col });
    // 첫 수 2칸 전진
    if (piece.row === startRow && board[piece.row + 2 * direction] && board[piece.row + 2 * direction][piece.col] === null) {
      moves.push({ row: piece.row + 2 * direction, col: piece.col });
    }
  }
  // 대각선 공격
  for (const dCol of [-1, 1]) {
    if (board[piece.row + direction] && board[piece.row + direction][piece.col + dCol]) {
      const targetPiece = board[piece.row + direction][piece.col + dCol];
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push({ row: piece.row + direction, col: piece.col + dCol });
      }
    }
  }

  return moves;
};

const getRawMovesForRook = (piece: PieceOnBoard, board: (PieceOnBoard | null)[][]): Move[] => {
  const moves: Move[] = [];
  const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
  for (const [dr, dc] of directions) {
    for (let i = 1; i < 8; i++) {
      const r = piece.row + dr * i;
      const c = piece.col + dc * i;
      if (r < 0 || r >= 8 || c < 0 || c >= 8) break;
      const target = board[r][c];
      if (target === null) {
        moves.push({ row: r, col: c });
      } else {
        if (target.color !== piece.color) moves.push({ row: r, col: c });
        break;
      }
    }
  }
  return moves;
};

const getRawMovesForKnight = (piece: PieceOnBoard, board: (PieceOnBoard | null)[][]): Move[] => {
  const moves: Move[] = [];
  const deltas = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1],
  ];
  for (const [dr, dc] of deltas) {
    const r = piece.row + dr;
    const c = piece.col + dc;
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];
      if (target === null || target.color !== piece.color) {
        moves.push({ row: r, col: c });
      }
    }
  }
  return moves;
};

const getRawMovesForBishop = (piece: PieceOnBoard, board: (PieceOnBoard | null)[][]): Move[] => {
  const moves: Move[] = [];
  const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  for (const [dr, dc] of directions) {
    for (let i = 1; i < 8; i++) {
      const r = piece.row + dr * i;
      const c = piece.col + dc * i;
      if (r < 0 || r >= 8 || c < 0 || c >= 8) break;
      const target = board[r][c];
      if (target === null) {
        moves.push({ row: r, col: c });
      } else {
        if (target.color !== piece.color) moves.push({ row: r, col: c });
        break;
      }
    }
  }
  return moves;
};

const getRawMovesForQueen = (piece: PieceOnBoard, board: (PieceOnBoard | null)[][]): Move[] => {
  return [
    ...getRawMovesForRook(piece, board),
    ...getRawMovesForBishop(piece, board),
  ];
};

const getRawMovesForKing = (piece: PieceOnBoard, board: (PieceOnBoard | null)[][]): Move[] => {
  const moves: Move[] = [];
  const deltas = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];
  for (const [dr, dc] of deltas) {
    const r = piece.row + dr;
    const c = piece.col + dc;
    if (r >= 0 && r < 8 && c >= 0 && c < 8) {
      const target = board[r][c];
      if (target === null || target.color !== piece.color) {
        moves.push({ row: r, col: c });
      }
    }
  }
  // TODO: 캐슬링 로직 추가 (isSquareAttacked, hasMoved 등 필요)
  return moves;
};

export const getRawMoves = (piece: PieceOnBoard, board: (PieceOnBoard | null)[][]): Move[] => {
  switch (piece.type) {
    case 'pawn': return getRawMovesForPawn(piece, board);
    case 'rook': return getRawMovesForRook(piece, board);
    case 'knight': return getRawMovesForKnight(piece, board);
    case 'bishop': return getRawMovesForBishop(piece, board);
    case 'queen': return getRawMovesForQueen(piece, board);
    case 'king': return getRawMovesForKing(piece, board);
    default: return [];
  }
};

// --- 게임 상태 확인 함수 ---
export const isSquareAttacked = (row: number, col: number, attackerColor: PieceColor, board: (PieceOnBoard | null)[][]): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === attackerColor) {
        const rawMoves = getRawMoves(piece, board);
        // 폰의 공격은 rawMoves와 다를 수 있으므로 특별 처리 (getRawMovesForPawn은 공격 포함)
        if (rawMoves.some(move => move.row === row && move.col === col)) {
          return true;
        }
      }
    }
  }
  return false;
};

export const isInCheck = (kingColor: PieceColor, board: (PieceOnBoard | null)[][]): boolean => {
  const king = findKing(kingColor, board);
  if (!king) return false; // 킹이 없으면 (이론상으론 없어야 함)
  const opponentColor = kingColor === 'white' ? 'black' : 'white';
  return isSquareAttacked(king.row, king.col, opponentColor, board);
};

export const getValidMoves = (piece: PieceOnBoard, board: (PieceOnBoard | null)[][]): Move[] => {
  const validMoves: Move[] = [];
  const rawMoves = getRawMoves(piece, board);

  for (const move of rawMoves) {
    const tempBoard = cloneBoard(board);
    tempBoard[move.row][move.col] = { ...piece, row: move.row, col: move.col };
    tempBoard[piece.row][piece.col] = null;
    if (!isInCheck(piece.color, tempBoard)) {
      validMoves.push(move);
    }
  }
  return validMoves;
};

export const getAllValidMovesForColor = (color: PieceColor, board: (PieceOnBoard | null)[][]): Move[] => {
  let allMoves: Move[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.color === color) {
        allMoves = allMoves.concat(getValidMoves(piece, board));
      }
    }
  }
  return allMoves;
};

export const checkGameEndStatus = (currentTurn: PieceColor, board: (PieceOnBoard | null)[][]): { gameOver: boolean; message: string; kingInCheckPos: Move | null } => {
  const kingIsCurrentlyInCheck = isInCheck(currentTurn, board);
  let kingPos: Move | null = null;
  if (kingIsCurrentlyInCheck) {
      const k = findKing(currentTurn, board);
      if (k) kingPos = {row: k.row, col: k.col};
  }

  const allLegalMoves = getAllValidMovesForColor(currentTurn, board);

  if (allLegalMoves.length === 0) {
    if (kingIsCurrentlyInCheck) {
      return { gameOver: true, message: `CHECKMATE! ${currentTurn === 'white' ? 'Black' : 'White'} wins!`, kingInCheckPos: kingPos };
    }
    return { gameOver: true, message: 'STALEMATE! It\'s a draw.', kingInCheckPos: kingPos };
  }
  return { gameOver: false, message: '', kingInCheckPos: kingPos };
};

// --- 초기 보드 설정 ---
export const setupInitialBoard = (): (PieceOnBoard | null)[][] => {
  const board: (PieceOnBoard | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  const add = (row: number, col: number, type: PieceType, color: PieceColor) => {
    board[row][col] = { row, col, type, color, id: `${color}_${type}_${row}_${col}_${Math.random()}` }; // ID에 랜덤 추가하여 유니크하게
  };

  for (let i = 0; i < 8; i++) { add(1, i, 'pawn', 'black'); add(6, i, 'pawn', 'white'); }
  add(0,0,'rook','black'); add(0,7,'rook','black'); add(7,0,'rook','white'); add(7,7,'rook','white');
  add(0,1,'knight','black'); add(0,6,'knight','black'); add(7,1,'knight','white'); add(7,6,'knight','white');
  add(0,2,'bishop','black'); add(0,5,'bishop','black'); add(7,2,'bishop','white'); add(7,5,'bishop','white');
  add(0,3,'queen','black'); add(7,3,'queen','white');
  add(0,4,'king','black'); add(7,4,'king','white');
  return board;
};

// --- 말 이동 및 상태 업데이트 로직 ---
export const makeMove = (board: (PieceOnBoard | null)[][], piece: PieceOnBoard, targetRow: number, targetCol: number): {newBoard: (PieceOnBoard | null)[][], promoted: boolean} => {
  const newBoard = cloneBoard(board);
  newBoard[targetRow][targetCol] = { ...piece, row: targetRow, col: targetCol };
  newBoard[piece.row][piece.col] = null;
  let promoted = false;

  // 폰 프로모션 (기본 퀸)
  if (piece.type === 'pawn' && ((piece.color === 'white' && targetRow === 0) || (piece.color === 'black' && targetRow === 7))) {
    newBoard[targetRow][targetCol]!.type = 'queen';
    promoted = true;
  }
  // TODO: 캐슬링 시 룩 이동 처리
  return {newBoard, promoted};
};