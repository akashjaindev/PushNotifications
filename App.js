import { StatusBar } from "expo-status-bar";
import { Alert, Button, Platform } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
    };
  },
});

export default function App() {
  useEffect(() => {
    async function configurePushNotification() {
      const value = await Notifications.getPermissionsAsync();
      if (value.status !== "granted") {
        const value = await Notifications.requestPermissionsAsync();
        if (value.status !== "granted") {
          Alert.alert(
            "permission required",
            "Push notifications need permissions"
          );
          return;
        }
      }
      const pushToken = await Notifications.getExpoPushTokenAsync({
        projectId: "a051a43b-f4a3-4b96-9f72-1995fcfc90cd",
      });
      console.log("configurePushNotification", Platform.OS,pushToken);
      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("DEFAULT", {
          name: "default",
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }
    }
    configurePushNotification();
  }, []);
  useEffect(() => {
    const subscriptionReceived = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("notification received");
        console.log(notification);
      }
    );
    const subscriptionResponse =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    return () => {
      subscriptionReceived.remove();
      subscriptionResponse.remove();
    };
  }, []);
  function scheduleNotification() {
    Notifications.scheduleNotificationAsync({
      content: {
        sound: true,
        priority: "high",
        title: "My First Local Notifiction",
        body: "This is the body of notifications",
        data: { userName: "MAX" },
      },
      trigger: { seconds: 2 },
    });
  }
  async function sendPushNotification(){
    let pushToken
    if(Platform.OS==='android'){
      pushToken = 'ExponentPushToken[WHeBX7ETqgcwbsUn_DjHoP]'
    }else{
      pushToken = 'ExponentPushToken[N-YjPiN152FaLywdJ_fQdJ]'
    }
    const response = await fetch('https://exp.host/--/api/v2/push/send',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify({
        to: pushToken,
        title:"hello",
        body: "world"
      })
    })
    console.log("response",response)
  }
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Button title="Schedule Notification" onPress={scheduleNotification} />
      <Button title="Send Push Notification" onPress={sendPushNotification} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
