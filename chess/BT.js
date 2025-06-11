const manager = new BleManager();
//블루투스 초기화

const startBluetoothConnection = async () => {
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