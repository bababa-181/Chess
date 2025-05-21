//Chess App.js

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, 
     Alert, TouchableOpacity, Text, Image, FlatList, Dimensions} from 'react-native';
import ChessBoard from './src/components/Board.js';
     
export function App() {
     const [boardData, setBoardData] = useState(null);
     const [fen, setfen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
     const ChessPiece: React.FC<ChessPieceProps> = ({piece}) => {
          const pieceUnicode: Record<string, string> = {
    'p': '♟', 
    'r': '♜', 
    'n': '♞',
    'b': '♝', 
    'q': '♛', 
    'k': '♚', 
    'P': '♙', 
    'R': '♖', 
    'N': '♘',
    'B': '♗', 
    'Q': '♕',
    'K': '♔'  
  };
     }

     useEffect(() => {
          const initialBoard = [
              updateBoardWithFEN(fen)
          ];
          setBoardData(initialBoard);
     }, []);

const updateBoardWithFEN = (fenSpring) => {
     console.log('수신된 FEN 정보:',fenSpring);

     const boardPart = fenSpring.split(' ')[0];
     const rows = boardPart.split('/');

     const newBoard = rows.map((row) => {
          const newRow = [];
          for (let i = 0; i < row.length; i++) {
               const char = row[i];
               if (isNaN(char)) {
                    newRow.push(char);
               } else {
                    const emptySquares = parseInt(char, 10);
                    for (let j = 0; j < emptySquares; j++) {
                         newRow.push(null);
                    }
               }
          }
          return newRow;
     });

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', 
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 
    
     return (
           <SafeAreaView style={styles.container}>
               <ChessBoard boardData={boardData} />
          </SafeAreaView>
     );   
     



     
     
     




}
export default App;
