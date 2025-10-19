import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LOGINADMINS from "./Loginadmins";
import NAVBAR from "./NavBar";
import UPDATE from "./Update";

const Stack = createNativeStackNavigator();

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Loginadmins" component={LOGINADMINS} />
            <Stack.Screen name="NAVBAR" component={NAVBAR} />
            <Stack.Screen name="UPDATE" component={UPDATE} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
