//Chess App.js
// import로 불러오기
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet} from 'react-native';
import ChessBoard from './src/components/Board.js';

export function App() {
     // boardData: 체스판 상태 저장
     const [boardData, setBoardData] = useState([]);
     // fen: 체스판 상태를 나타내는 FEN 문자열
     const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
     //camelCase? 지키려면 setFen으로 해야함
          
     
     // useEffect: 컴포넌트가 처음 렌더링될 때 FEN 문자열을 파싱하여 boardData를 설정
     useEffect(() => {
          const initialBoard = parseFEN(fen);
          setBoardData(initialBoard);
     }, []);
     //빈 배열은 최초 한 번만 실행됨을 의미함

     useEffect(() => {
          const newBoard = parseFEN(fen);
          setBoardData(newBoard);

     }, [fen]);

     
     


     // parseFEN: FEN 문자열을 파싱하여 체스판 상태를 반환하는 함수
     const parseFEN = (fenString) => {
     // FEN 문자열에서 보드 상태 부분을 추출하고, 각 행을 배열로 변환
     const boardPart = fenString.split(' ')[0];
     const rows = boardPart.split('/');
     const board = rows.map((row) => {
          const newRow = [];
          for (let i = 0; i < row.length; i++) {
               const char = row[i];
               if (isNaN(char)) {
                    //알파벳이면(기물) 그대로 넣음
                    newRow.push(char);
               } else {
                    //숫자이면 그 수만큼 null을 넣음
                    const emptySquares = parseInt(char, 10);
                    for (let j = 0; j < emptySquares; j++) {
                         newRow.push(null);
                    }
               }
          }
          //한 행 완성 후 반환
          return newRow;
     });
     return board;
};
     
     const styles = StyleSheet.create({
          container: {
               flex: 1,
               backgroundColor: '#000000',
               justifyContent: 'center',
               alignItems: 'center'
          }
     })



     return(
          <SafeAreaView style={styles.container}>
               {/* 체스판 컴포넌트 렌더링 */}
               {boardData && (
                    <ChessBoard
                         boardData={boardData}

                    />
               )}
          </SafeAreaView>
     );
};
// App 컴포넌트를 기본으로 내보내기 
  export default App;
