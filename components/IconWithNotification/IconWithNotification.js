import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Icon from '@expo/vector-icons';

export default class IconWithNotification extends Component {
  handlePosition = () => {
    const { notification, styleBoxNotification } = this.props;
    if (notification < 10) {
      return {top: -12, right: -10, ...styleBoxNotification, ...styles.styleBoxNotification};
    } else if (notification < 100) {
      return {top: -12, right: -12, ...styleBoxNotification, ...styles.styleBoxNotification};
    } else if (notification < 999) {
      return {top: -12, right: -13, ...styleBoxNotification, ...styles.styleBoxNotification};
    }
    return {top: -12, right: -15, ...styleBoxNotification, ...styles.styleBoxNotification};
  }

  render() {
    const { name, size, styleIcon, notification, styleTextNotification } = this.props;

    return (
      <View style={styles.boxIcon}>
        <Icon.FontAwesome
          name={name}
          size={size}
          style={{...styleIcon, ...styles.styleIcon}}
        />
        {
          notification ?
            <View style={this.handlePosition()}>
              <Text style={{...styleTextNotification, ...styles.styleTextNotification}}>
                {notification < 1000 ? notification : '999+'}
              </Text>
            </View>
            : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  boxIcon: {
    position: 'relative',
  },
  styleIcon: {},
  styleBoxNotification: {
    position: 'absolute',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 50,
  },
});
