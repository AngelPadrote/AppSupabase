import React, { Component } from 'react'
import { Button, Image, Text, TextInput, View, Alert } from 'react-native'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto';
import CryptoJS from 'crypto-js';
import { PreventRemoveProvider } from '@react-navigation/native';

const supabaseUrl = 'https://oagktleyuvsbtbxnltiq.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2t0bGV5dXZzYnRieG5sdGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MjA3NTIsImV4cCI6MjA1NTQ5Njc1Mn0.Lv_3sU9hNagKH4R6bmEGMY8tyTzNpvexwUq9AMix3BU" 
const supabase = createClient(supabaseUrl, supabaseKey)

export default class Login extends Component {
constructor(props){
  super(props);
  this.state ={
  Nombre:"",
  Password:"",
}
}

  render() {
    const Logeo = async () =>{
        const {Nombre,Password} = this.state
        
        if (!Nombre || !Password) {
          Alert.alert('Error', 'Por favor, ingresa tu correo y contraseña.');
          return;
        }
  
        let { data: Admins, error } = await supabase
        .from('Admins')
        .select('*')
        .eq('Nombre', Nombre)
        .eq('Password',Password)
        .single();
  
        if (error) {
          Alert.alert('Error', 'No se pudo conectar con la base de datos.');
          console.error(error);
          return;
        }

        if(Admins.Password === Password){
          this.props.navigation.navigate("NAVBAR");
          Alert.alert('Bienvenido');
        }else{
          Alert.alert('Error', 'Correo o contraseña incorrectos.');
        }
      };

    return (
      
      <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        paddingHorizontal: 20,
        backgroundColor: "white",
      }}>
        
        <View>
          <Image source={require("./Imagenes/Leon.png")} style={{
            marginTop:100
          }}></Image>
        </View>

        <TextInput
        style={{
          width:140,
          height:45,
          padding:1,
          borderRadius:20,
          borderStyle:'solid',
          borderWidth:2,
          marginBottom:15,
          backgroundColor: '#fff',
          borderColor: '#ccc',
          paddingHorizontal: 10,
          fontSize: 16,
          marginTop:20
        }}placeholder='NombreAdmin' onChangeText={Nombre=> this.setState({Nombre})}></TextInput>

        <TextInput
        style={{
          width:140,
          height:45,
          padding:1,
          borderRadius:20,
          borderStyle:'solid',
          borderWidth:2,
          marginBottom:15,
          backgroundColor: '#fff',
          borderColor: '#ccc',
          paddingHorizontal: 10,
          fontSize: 16,
        }}placeholder='Password' secureTextEntry onChangeText={Password=> this.setState({Password})}></TextInput>
        <View style={{
          marginBottom:10,
          width:80,
        }}>
          <Button title='Login' onPress={Logeo}></Button>
        </View>
      </View>
    )
  }
}
