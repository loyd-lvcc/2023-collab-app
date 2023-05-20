import { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";

import UserComponent from './components/user';

const pubnub = new PubNub({
  subscribeKey: "sub-c-5dab58da-848a-4a04-9e1f-29b962c15518",
  publishKey: "pub-c-7fe263d8-78b2-43c8-a402-91de6449d9b9",
  userId: "testUser"
});
export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [
        {color: 'red', isTaken: false}, // 0
        {color: 'green', isTaken: false}, // 1
        {color: 'blue', isTaken: false}, // 2
        {color: 'pink', isTaken: false}, // 3
      ]
    };
  }

  pubnubListener(event) {
    console.log(event)
    if (event.channel == 'userTaken') {
      let users = this.state.users;

      // let userIndex = null;
      // for (i = 0; i < users.length; i++) {
      //   if (users[i].color == event.message) {
      //     userIndex = i;
      //   }
      // }

      let userIndex = users.findIndex(user => user.color == event.message);
      if (userIndex != null) {
        users[userIndex].isTaken = true;
        this.setState({ users });
      }
    }
  }

  async componentDidMount() {
    if (pubnub) {
      const listener = { message: (event) => this.pubnubListener(event) };
      pubnub.addListener(listener);
      pubnub.subscribe({ channels: ["userTaken"] });
    }
  }

  render() {
    return (
      <PubNubProvider client={pubnub}>
        <View style={styles.container}>
          <View style={styles.userContainer}>
            {this.state.users.map(user => {
              return <UserComponent 
                        key={user.color} 
                        color={user.color} 
                        isTaken={user.isTaken} 
                        pubnub={pubnub} />
            })}
          </View>
        </View>
      </PubNubProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});
