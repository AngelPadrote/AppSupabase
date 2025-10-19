import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LOGIN from "./Login";
import REGISTRO from "./Registro";
import PRODUCTOS from "./Productos";
import DETALLE from './Detalle';

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    const Stack = createNativeStackNavigator();

    return (
      <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Login" component={LOGIN} />
            <Stack.Screen name="Registro" component={REGISTRO} />
            <Stack.Screen name="Productos" component={PRODUCTOS} />
            <Stack.Screen name="Detalle" component={DETALLE} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
