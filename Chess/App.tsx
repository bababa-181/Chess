import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  Platform, // Added Platform
  // Button, // Uncomment if you want a reset button
} from 'react-native';
import ChessBoard, { PieceOnBoard, SQUARE_SIZE } from './src/components/Square.tsx';
import { PieceColor } from './src/components/Piece';
import {
  setupInitialBoard,
  getValidMoves,
  makeMove,
  checkGameEndStatus,
  Move,
  findKing, // Added for kingInCheckPos update
} from './src/logic/chessLogic';

const App = () => {
  const [boardState, setBoardState] = useState<(PieceOnBoard | null)[][]>(setupInitialBoard());
  const [selectedPiece, setSelectedPiece] = useState<PieceOnBoard | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('white');
  const [kingInCheckPos, setKingInCheckPos] = useState<Move | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('');

  const updateGameStatus = (currentBoard: (PieceOnBoard | null)[][], turn: PieceColor) => {
    const status = checkGameEndStatus(turn, currentBoard);
    setGameOver(status.gameOver);
    setGameMessage(status.message);
    setKingInCheckPos(status.kingInCheckPos);
    if (status.gameOver) {
        Alert.alert(status.message.includes('CHECKMATE') ? "Checkmate!" : status.message.includes('STALEMATE') ? "Stalemate!" : "Game Over", status.message);
    }
  };

  useEffect(() => {
    if (!gameOver) {
        updateGameStatus(boardState, currentTurn);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTurn, boardState]);

  const handleSquarePress = (row: number, col: number) => {
    if (gameOver) return;

    const clickedPiece = boardState[row][col];

    if (selectedPiece) {
      if (possibleMoves.some(move => move.row === row && move.col === col)) {
        const { newBoard, promoted } = makeMove(boardState, selectedPiece, row, col);
        setBoardState(newBoard);
        if (promoted) {
          Alert.alert("Pawn Promotion", `${selectedPiece.color} Pawn promoted to Queen!`);
        }
        setSelectedPiece(null);
        setPossibleMoves([]);
        const nextTurn = currentTurn === 'white' ? 'black' : 'white';
        setCurrentTurn(nextTurn);
        // Game status will be updated by useEffect due to currentTurn/boardState change
      } else if (clickedPiece && clickedPiece.color === currentTurn) {
        setSelectedPiece(clickedPiece);
        setPossibleMoves(getValidMoves(clickedPiece, boardState));
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else {
      if (clickedPiece && clickedPiece.color === currentTurn) {
        setSelectedPiece(clickedPiece);
        setPossibleMoves(getValidMoves(clickedPiece, boardState));
      }
    }
  };

 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Text style={styles.title}>isabellehs Chess</Text>
      <Text style={styles.turnText}>Current Turn: {currentTurn.toUpperCase()}</Text>
      {gameOver && <Text style={styles.gameOverText}>{gameMessage}</Text>}
      <View style={styles.boardOuterContainer}>
        <ChessBoard 
            boardData={boardState} 
            onSquarePress={handleSquarePress} 
            selectedSquare={selectedPiece ? {row: selectedPiece.row, col: selectedPiece.col} : null}
            possibleMoves={possibleMoves}
            kingInCheckPos={kingInCheckPos}
        />
      </View>
      {/* <Button title="Reset Game" onPress={resetGame} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  turnText: {
    fontSize: 18,
    marginBottom: 10,
  },
  gameOverText: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  boardOuterContainer: {
    width: SQUARE_SIZE * 8 + 4, 
    height: SQUARE_SIZE * 8 + 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#333',
  }
});

export default App;
