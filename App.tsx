import React, {useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';

function App() {
  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('fcm token', token);
    } catch (error) {
      console.log('Error fetching FCM token:', error);
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFCMToken();
    }
  };

  const NotificationListner = () => {
    // Assume a message-notification contains a "type" property in the data payload of the screen to open
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'Notification caused app to open from background  state:',
        remoteMessage,
      );
    });

    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log('get intitial notification', remoteMessage);
        }
      })
      .catch(error => {
        console.error('Error handling initial notification:', error);
      });

    messaging().onMessage(async remoteMessage => {
      console.log('notification on foreground state...', remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage) {
        console.log('background message...', remoteMessage);
      }
    });
  };

  useEffect(() => {
    requestUserPermission();
    NotificationListner();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Test Push Notif</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    color: 'red',
  },
});

export default App;
