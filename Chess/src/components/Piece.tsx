import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { SQUARE_SIZE } from './Square'; // Assuming Square.tsx exports SQUARE_SIZE

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

interface PieceProps {
  type: PieceType;
  color: PieceColor;
  
}


const PIECE_IMAGES = {
  white: {
    pawn: require('../../assets/white_pawn.png'),
    rook: require('../../assets/white_rook.png'),
    knight: require('../../assets/white_knight.png'),
    bishop: require('../../assets/white_bishop.png'),
    queen: require('../../assets/white_queen.png'),
    king: require('../../assets/white_king.png'),
  },
  black: {
    pawn: require('../../assets/black_pawn.png'),
    rook: require('../../assets/black_rook.png'),
    knight: require('../../assets/black_knight.png'),
    bishop: require('../../assets/black_bishop.png'),
    queen: require('../../assets/black_queen.png'),
    king: require('../../assets/black_king.png'),
  },
};

const PieceDisplay: React.FC<PieceProps> = ({ type, color }) => {
  const pieceUnicode: { [key in PieceType]: string } = {
    king: color === 'white' ? '\u2654' : '\u265A',
    queen: color === 'white' ? '\u2655' : '\u265B',
    rook: color === 'white' ? '\u2656' : '\u265C',
    bishop: color === 'white' ? '\u2657' : '\u265D',
    knight: color === 'white' ? '\u2658' : '\u265E',
    pawn: color === 'white' ? '\u2659' : '\u265F',
  };

 
  let imageSource = null;
  try {
    imageSource = PIECE_IMAGES[color][type];
  } catch (e) {
    
  }

  return (
    <View style={styles.pieceContainer}>
      {imageSource ? (
        <Image source={imageSource} style={styles.pieceImage} resizeMode="contain" />
      ) : (
        <Text style={[styles.pieceText, { color: color === 'white' ? '#FFFFFF' : '#000000' }]}>
          {pieceUnicode[type]}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pieceContainer: {
    width: SQUARE_SIZE * 0.8, 
    height: SQUARE_SIZE * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceImage: {
    width: '100%',
    height: '100%',
  },
  pieceText: {
    fontSize: SQUARE_SIZE * 0.6, 
    fontWeight: 'bold',
  },
});

export default PieceDisplay;