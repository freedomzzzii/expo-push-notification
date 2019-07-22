import React, { Component } from 'react';
import { AppLoading, Notifications } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';

import firebase from './configFirebase';
import { IconWithNotification } from './components';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
    };
  }

  componentDidMount() {
    registerForPushNotificationsAsync();

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    Notifications.addListener(this._handleNotification);
  

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('reminders', {
        name: 'Reminders',
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  }

  loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free to
        // remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  }
  
  handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error);
  }
  
  handleFinishLoading = () => this.setState({ isLoadingComplete: true });

  _handleNotification = (notification) => {
    this.setState({notification: notification});
  };

  render() {
    const { isLoadingComplete } = this.state;

    if (!isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {/* <AppNavigator /> */}
          <Test />
        </View>
      );
    }
  }
}

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  
  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  
  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  console.log('token>>>', token);
  // POST the token to your backend server from where you can retrieve it to send push notifications.
}

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notification: null,
    };
    this.database = firebase.database().ref('notification/P5Tq36Gzgd0tS0Q02mwTnn/homeNotification');
  }

  componentDidMount() {
    this.database.on('value', snapshot => {
      this.setState({ notification: snapshot.val() });
    });
  }

  render() {
    const { notification } = this.state;

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <IconWithNotification
          name="star-o"
          size={35}
          styleIcon={{ color: 'red' }}
          notification={notification}
          styleBoxNotification={{ backgroundColor: '#ff9600', }}
          styleTextNotification={{ color: '#ffffff' }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
