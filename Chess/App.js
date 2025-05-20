import React from 'react';
import { View, SafeAreaView, Button, useState,
     useEffect, StyleSheet, Dimensions, 
     TouchableOpacity, Text , Image, FlatList} from 'react-native'
import PieceDisplay from './src/components/Piece.js';
import { SQUARE_SIZE } from './src/components/Square.js'
import ChessBoard from './src/components/Board.js'
     
export default function App() {
     const [boardData, setBoardData] = useState(null);
     useEffect(() => {
          const initialBoard = [
               ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
               ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
               [null, null, null, null, null, null, null, null],
               [null, null, null, null, null, null, null, null],
               [null, null, null, null, null, null, null, null],
               [null, null, null, null, null, null, null, null],
               ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
               ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
          ];
          setBoardData(initialBoard);
     }, []);
     return(
          <SafeAreaView style={styles.container}>
               <ChessBoard boardData={boardData} />
          </SafeAreaView>
     );    
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', 
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function parseFEN(fen) {
     const piecetypes = {
          'p': '♟', // black pawn
          'r': '♜', // black rook
          'n': '♞', // black knight
          'b': '♝', // black bishop
          'q': '♛', // black queen
          'k': '♚', // black king
          'P': '♙', // white pawn
          'R': '♖', // white rook
          'N': '♘', // white knight
          'B': '♗', // white bishop
          'Q': '♕', // white queen
          'K': '♔'  // white king
     };
     
     const rows = fen.split(' ')[0].split('/');
     const board = Array.from({ length: 8 }, () => Array(8).fill(null));
     
}



