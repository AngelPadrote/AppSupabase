import React, { Component } from 'react'
import { Button, Image, Text, TextInput, View, Alert } from 'react-native'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto';
import CryptoJS from 'crypto-js';

const supabaseUrl = 'https://oagktleyuvsbtbxnltiq.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2t0bGV5dXZzYnRieG5sdGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MjA3NTIsImV4cCI6MjA1NTQ5Njc1Mn0.Lv_3sU9hNagKH4R6bmEGMY8tyTzNpvexwUq9AMix3BU" 
const supabase = createClient(supabaseUrl, supabaseKey)

export default class Registro extends Component {
  constructor(props){
    super(props);
    this.state = {
      Nombre:"",
      Correo:"",
      Password:"",
    }
  }

  render() {
    
    registrar = async () => {
      const { Nombre, Correo, Password } = this.state; 

      if (!Nombre || !Correo || !Password) {
        Alert.alert('Error', 'Todos los campos son obligatorios.');
        return;
      }
  
      const hashedPassword = CryptoJS.SHA256(Password).toString(CryptoJS.enc.Hex);

      const { data, error } = await supabase
        .from('Usuarios')
        .insert([{ Nombre, Correo, Password: hashedPassword }])
        .select();

      if (error) {
        Alert.alert('Error', error.message);
        console.error('Error en Supabase:', error);
      } else {
        Alert.alert('Exito', 'Usuario registrado correctamente');
        console.log('Datos insertados:', data);

        this.props.navigation.navigate("Login");
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
        }}placeholder='Nombre' onChangeText={Nombre=> this.setState({Nombre})}></TextInput>

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
        }}placeholder='Correo' onChangeText={Correo=> this.setState({Correo})}></TextInput>

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
          width:80
        }}>
        </View>
        <View>
          <Button title='Registrarse' onPress={registrar}></Button>
        </View>
      </View>
    )
  }
}
