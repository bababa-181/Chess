import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button } from 'react-native';

const TimerExample = () => {
  const [seconds, setSeconds] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    let intervalId = null;

    if (isGameStarted) {
      // 게임이 시작되면 1초마다 seconds를 1씩 증가
      intervalId = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else {
      // 게임이 중지되거나 아직 시작되지 않았으면 타이머를 멈추고 0으로 리셋 (선택적)
      // setSeconds(0); // 필요에 따라 리셋 로직 추가
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    // 컴포넌트가 언마운트되거나 isGameStarted 상태가 변경되기 전에 인터벌 정리
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isGameStarted]); // isGameStarted 상태가 변경될 때마다 useEffect 실행

  const handleGameStartStop = () => {
    setIsGameStarted(prevState => !prevState);
    // 게임이 멈췄다가 다시 시작될 때 초를 0부터 다시 세고 싶다면 아래 주석 해제
    // if (!isGameStarted) { 
    //   setSeconds(0);
    // }
  };
  
  const handleReset = () => {
    setIsGameStarted(false);
    setSeconds(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.timerText}>경과 시간: {seconds}초</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title={isGameStarted ? "게임 중지" : "게임 시작"} 
          onPress={handleGameStartStop} 
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="타이머 리셋" 
          onPress={handleReset} 
          color="#FF6347" // 토마토색
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10, // 버튼 사이의 수직 간격
    width: '60%', // 버튼 너비
  },
});

export default TimerExample;
