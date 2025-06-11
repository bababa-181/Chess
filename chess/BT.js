import { BleManager }  from 'react-native-ble-plx';
import { Platform,PermissionsAndroid } from 'react-native';
import React, { useState, useEffect } from 'react';

const manager = new BleManager();
//블루투스 초기화

const BluetoothComponent = () => {  
const [connectedDevice, setConnectedDevice] = useState(null);
const [connectionStatus, setConnectionStatus] = useState('Disconnected');

const startBluetoothConnection = async () => {
     // 블루투스 권한 요청
     if (Platform.OS === 'android') {
          try{
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
              );
          
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
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
          if (device && device.name && device.name.includes("arduino")) {
               console.log('Found device:', device.name,device.id);

               manager.stopDeviceScan();

               manager.connectToDevice(device.id)
                .then((device) => {
                      console.log('Connected to device:', device.name, device.id);
                      setConnectedDevice(device);
                      setConnectionStatus('Connected');

                      return device.discoverAllServicesAndCharacteristics();
                })
                .catch((error) => {
                    console.error('connection error:', error);
                });
            }
          });

    
      
    
      // 블루투스 기기 검색 중지
      setTimeout(() => {
          manager.stopDeviceScan();
          console.log('Device scan stopped');
        }, 5000); // 5초 후에 검색 중지
};

  return (
    <View>
      <Text>Status: {connectionStatus}</Text>
      <Button title = "Connect to Bluetooth Device" onPress={startBluetoothConnection} />
    </View>
  );
};

export default BluetoothComponent;
        