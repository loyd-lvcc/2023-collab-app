import { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export default class User extends Component {

  getUserColor() {
    if (this.props.isTaken) {
      return 'grey';
    }

    return this.props.color;
  }

  takeUser() {
    this.props.pubnub.publish({
      channel: 'userTaken',
      message: this.props.color
    })
  }

  render() {
    return(
      <TouchableOpacity disabled={this.props.isTaken} onPress={() => this.takeUser()}>
        <View style={[styles.user, {backgroundColor: this.getUserColor()}]}></View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  user: {
    width: 50,
    height: 50,
    borderRadius: 25
  }
});
