//Chess App.js
// import로 불러오기
import React, { useState, useEffect } from 'react';
import {PermissionAndriod, SafeAreaView, StyleSheet, 
     Alert, TouchableOpacity, Text, Image, FlatList, Dimensions} from 'react-native';
import ChessBoard from './src/components/Board.js';
import { BleManager }  from 'react-native-ble-plx';
import { Platform,PermissionAndriod } from 'react-native';

const manager = new BleManager();
//블루투스 초기화

const startBluetoothConnection = () => {
     // 블루투스 권한 요청
     if (Platform.OS === 'android') {
          try{
              const granted = await PermissionAndriod.request(
                PermissionAndriod.PERMISSIONS.BLUETOOTH_CONNNECT
              );
          
              if (granted === PermissionAndriod.RESULTS.GRANTED) {
                console.log('Bluetooth permission granted');
              } else {
                console.log('Bluetooth permission denied');
                return;
              }
          } catch (error) {
              console.error('Error requesting Bluetooth permission:', error);
              return;
          }  
     }
     // 블루투스 기기 검색 시작
     manager.startDeviceScan(null,null, (error, device) => {
          if (error) {
               console.error('Error scanning for devices:', error);
               return;
          }
          if (device && device.name && device.name.includes()) {
               console.log('Found device:', device.name,device.id);

               manager.stopDeviceScan();

               manager.connectToDevice(device.id)
                .then((device) => {
                      console.log('Connected to device:', device.name, device.id);
                      setConnectedDevice(device);
                      setConnectionStatus('Connected');

                      return device.discoverAllServicesAndCharacteristics();
                })
                .catch((error))  
          }
     });
    
      // 블루투스 기기 검색 중지
      setTimeout(() => {
          manager.stopDeviceScan();
          console.log('Device scan stopped');
        }, 5000); // 5초 후에 검색 중지
};



    

export function App() {
     // boardData: 체스판 상태 저장
     const [boardData, setBoardData] = useState(null);
     // fen: 체스판 상태를 나타내는 FEN 문자열
     const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
     //camelCase? 지키려면 setFen으로 해야함
     
     const [connectedDevice, setConnectedDevice] = useState(null);
     const [connectionStatus, setConnectionStatus] = useState('Disconnected');
     //연결된 기기 없고 연결 상태는 연결 안됨으로 지정
          
     
     // useEffect: 컴포넌트가 처음 렌더링될 때 FEN 문자열을 파싱하여 boardData를 설정
     useEffect(() => {
          const initialBoard = parseFEN(fen);
          setBoardData(initialBoard);
     }, []);
     //빈 배열은 최초 한 번만 실행됨을 의미함

     
     


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

}
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  Platform,
  moment,
  
} from 'react-native';
import ChessBoard, { SQUARE_SIZE } from './src/components/Square.js'; 
import {
  setupInitialBoard,
  getValidMoves,
  makeMove,
  checkGameEndStatus,
} from './src/logic/chessLogic';

const App = () => {
  const [boardState, setBoardState] = useState(setupInitialBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]); 
  const [currentTurn, setCurrentTurn] = useState('white');
  const [kingInCheckPos, setKingInCheckPos] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameMessage, setGameMessage] = useState('');
  
  const updateGameStatus = (currentBoard, turn) => {
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
  }, [currentTurn, boardState]);

  const handleSquarePress = (row, col) => {
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
      <Text style={styles.title}>ISB Chess Chess</Text>
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

    backgroundColor: '#000000',
    justifyContent: 'center';
    alignItems: 'center';
     // 8x8 체스판 형태 반환
     return board;
     }
});
     //앱 전체 레이아웃 스타일 정의
     const styles = StyleSheet.create({
          container: {
          flex: 1,
          backgroundColor: '#000000', 
          justifyContent: 'center',
          alignItems: 'center',

  },
}); 

     // 앱 실제 화면 구성
     return (
           <SafeAreaView style={styles.container}>
               <ChessBoard boardData={boardData} />
          </SafeAreaView>
     );   
};
    dja {
    alignItems: 'center';
    backgroundColor: '#3F3F3F';
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  };

  title: {
    fontSize: 24;
    fontWeight: 'bold';
    marginVertical: 20;
  };
  turnText: {
    fontSize: 18;
    marginBottom: 1;
  };
  moment: { 
    fontSize: 18;
    marginBottom: 10;
  };
  gameOverText: {
    fontSize: 20;
    color: 'red';
    fontWeight: 'bold';
    marginBottom: 10;
  };
  boardOuterContainer: {
    width: SQUARE_SIZE * 8 + 4; 
    height: SQUARE_SIZE * 8 + 4;
    justifyContent: 'center';
    alignItems: 'center';
    borderWidth: 2;
    borderColor: '#333';
  };


//export default startBluetoothConnection;

               {boardData && <ChessBoard boardData={boardData} />}
          
        
  
// App 컴포넌트를 기본으로 내보내기 
  export default App;
