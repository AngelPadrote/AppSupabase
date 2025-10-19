import React, { Component } from 'react';
import {View, Text, Button, Image, TextInput, Alert, ScrollView} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; 
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oagktleyuvsbtbxnltiq.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2t0bGV5dXZzYnRieG5sdGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MjA3NTIsImV4cCI6MjA1NTQ5Njc1Mn0.Lv_3sU9hNagKH4R6bmEGMY8tyTzNpvexwUq9AMix3BU"
const supabase = createClient(supabaseUrl, supabaseKey)

export default class Altas extends Component {
  constructor(props) {
    super(props);
    this.state = {
        imagenPath:"",
        imagenbase64:"",
        imagenuri:"",
        NombrePhoto:"",
        Producto: "",
        Cantidad: "",
        Precio: "",
        Descripcion: "",
    };
  }

  imagenbs64(){
    if(this.state.imagenbase64){
     return <Image 
     source={{uri:'data:image/jpeg;base64,'+this.state.imagenbase64}} 
     style={{ borderWidth:2, borderColor:"red", width:150, height:150 }}
     />
    } else {
      return <Image source={require("./Imagenes/dummy.jpg")}
      style={{ borderWidth:2, borderColor:"red", width:150, height:150 }}
      />
    }
  }

  imagenuri(){
    if(this.state.imagenuri){
     return <Image 
     source={{uri:this.state.imagenuri}} 
     style={{ borderWidth:2, borderColor:"red", width:150, height:150 }}
     />
    } else {
      return <Image source={require("./Imagenes/dummy.jpg")}
      style={{ borderWidth:2, borderColor:"red", width:150, height:150 }}
      />
    }
  }

  base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  render() {
    const subirASupabase = async () => {
      const { imagenbase64, NombrePhoto, Producto, Cantidad, Precio, Descripcion } = this.state;
      if (!imagenbase64 || !NombrePhoto || !Producto || !Cantidad || !Precio || !Descripcion) {
        Alert.alert('Error', 'Completa todos los campos antes de subir.');
        return;
      }

      const fileData = this.base64ToUint8Array(imagenbase64);

      const { data, error } = await supabase.storage
        .from('Imagenes')
        .upload(`${NombrePhoto}.jpg`, fileData, {
          contentType: 'image/jpeg',
        });

      if (error) {
        console.log("Error al subir:", error);
        Alert.alert("Error", "No se pudo subir la imagen.");
        return;
      }

      const imageUrl = `${supabaseUrl}/storage/v1/object/public/Imagenes/${NombrePhoto}.jpg`;

      const { data: insertData, error: errorInsert } = await supabase
        .from('Productos2')
        .insert([
          {
            Imagen: imageUrl,
            Producto: Producto,
            Cantidad: Cantidad,
            Precio: Precio,
            Descripcion: Descripcion,
          },
        ]);

      if (errorInsert) {
        console.error('Error al insertar:', errorInsert);
        Alert.alert('Error', 'No se pudo registrar el producto.');
      } else {
        Alert.alert('Éxito', 'Producto registrado correctamente.');
      }
    }

    const abreGaleria = () => {
      const opciones = {
        mediaType: 'photo',
        includeBase64: true,
        maxHeight: 800,
        maxWidth: 800
      };
      launchImageLibrary(opciones, (response) => {
        if (response.error) {
            console.log(response.error)
        } else {
            this.setState({
                imagenPath: response.assets[0].originalPath,
                imagenbase64: response.assets[0].base64,
                imagenuri: response.assets[0].uri
            });
        }
      });
    }

    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 30, color: "red", textAlign: "center" }}> Altas de Productos </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View>
              {this.imagenbs64()}
              <Text>BASE 64</Text>
          </View>
          <View>
              {this.imagenuri()}
              <Text>URL</Text>
          </View>
        </View>

        <TextInput placeholder="Nombre archivo imagen" onChangeText={NombrePhoto => this.setState({NombrePhoto})} style={styles.input} />
        <TextInput placeholder="Nombre del Producto" onChangeText={Producto => this.setState({Producto})} style={styles.input} />
        <TextInput placeholder="Cantidad" keyboardType="numeric" onChangeText={Cantidad => this.setState({Cantidad})} style={styles.input} />
        <TextInput placeholder="Precio" keyboardType="numeric" onChangeText={Precio => this.setState({Precio})} style={styles.input} />
        <TextInput placeholder="Descripción" onChangeText={Descripcion => this.setState({Descripcion})} style={styles.input} multiline />

        <Button title="Abrir Galería" onPress={abreGaleria} />
        <View style={{ marginTop: 10 }}>
          <Button title="Subir y Registrar Producto" onPress={subirASupabase} />
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff'
  }
};
