import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Square, { SQUARE_SIZE } from './Square.tsx';
import PieceDisplay, { PieceType, PieceColor } from './Piece.tsx';

export interface PieceOnBoard {
  row: number;
  col: number;
  type: PieceType;
  color: PieceColor;
  id: string; // Unique ID for each piece, e.g., 'white_pawn_1'
}

interface ChessBoardProps {
  boardData: (PieceOnBoard | null)[][]; 
  onSquarePress: (row: number, col: number) => void;
  selectedSquare?: { row: number; col: number } | null;
  possibleMoves?: { row: number; col: number }[];
  kingInCheckPos?: {row: number, col: number} | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ boardData, onSquarePress, selectedSquare, possibleMoves = [], kingInCheckPos }) => {
  const renderSquare = ({ item, index }: { item: PieceOnBoard | null, index: number }) => {
    const row = Math.floor(index / 8);
    const col = index % 8;
    const isLight = (row + col) % 2 === 0;
    const piece = boardData[row][col];

    const isSelected = selectedSquare?.row === row && selectedSquare?.col === col;
    const isPossible = possibleMoves.some(move => move.row === row && move.col === col);
    const isKingChecked = kingInCheckPos?.row === row && kingInCheckPos?.col === col;

    return (
      <View style={styles.squareContainer}>
        <Square 
          row={row} 
          col={col} 
          isLightSquare={isLight} 
          onPress={onSquarePress}
          isSelected={isSelected}
          isPossibleMove={isPossible}
          isKingInCheck={isKingChecked}
        />
        {piece && (
          <View style={styles.pieceWrapper}>
            <PieceDisplay type={piece.type} color={piece.color} />
          </View>
        )}
      </View>
    );
  };

  // Flatten the board data for FlatList
  const flatBoardData = boardData.flat();

  return (
    <View style={styles.boardContainer}>
      <FlatList
        data={flatBoardData}
        renderItem={renderSquare}
        keyExtractor={(item, index) => `square-${index}`}
        numColumns={8}
        scrollEnabled={false} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    width: SQUARE_SIZE * 8,
    height: SQUARE_SIZE * 8,
    borderWidth: 2,
    borderColor: '#333',
    flexDirection: 'row', 
    flexWrap: 'wrap', 
  },
  squareContainer: {
   
  },
  pieceWrapper: {
    ...StyleSheet.absoluteFillObject, 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, 
  },
});

export default ChessBoard;