import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';

const { width } = Dimensions.get('window');
export const SQUARE_SIZE = width / 8;

interface SquareProps {
  row: number;
  col: number;
  isLightSquare: boolean;
  onPress: (row: number, col: number) => void;
  isSelected?: boolean;
  isPossibleMove?: boolean;
  isKingInCheck?: boolean;
}

const Square: React.FC<SquareProps> = ({ row, col, isLightSquare, onPress, isSelected, isPossibleMove, isKingInCheck }) => {
  const backgroundColor = isLightSquare ? 'rgb(240,228,213)' : 'rgb(185,108,12)';
  const highlightColor = isSelected ? 'rgba(100, 240, 100, 0.5)' : isPossibleMove ? 'rgba(255, 255, 0, 0.4)' : isKingInCheck ? 'rgba(255, 0, 0, 0.4)' : undefined;

  return (
    <TouchableOpacity onPress={() => onPress(row, col)} style={[styles.square, { backgroundColor }]}>
      {highlightColor && <View style={[styles.highlight, { backgroundColor: highlightColor }]} />}
      { debugtxt }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

export default Square;