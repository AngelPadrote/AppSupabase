import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Importa tus pantallas
import ALTAS from './Altas';
import BAJAS from './Bajas';
import UPDATE from './Update';
import BUSCADOR from './Buscador';

const Tab = createBottomTabNavigator();

export default function MyTabs({ route }) {
  const { admin_id, admin_name } = route.params || {};  
  return (
      <Tab.Navigator>
        <Tab.Screen name="ALTAS" component={ALTAS} initialParams={{ admin_id, admin_name }} />
        <Tab.Screen name="BAJAS" component={BAJAS} />
        {/*<Tab.Screen name="UPDATE" component={UPDATE} />*/}
        <Tab.Screen name="BUSCADOR" component={BUSCADOR} />
      </Tab.Navigator>
  );
}
