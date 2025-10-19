import React, { Component } from 'react';
import { View, Text, Button, Image, TextInput, Alert, ScrollView } from 'react-native';
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
        imagenbase64: "",
        imagenuri: "",
        NombrePhoto: "",
        make: "",
        model: "",
        precio: "",
        license_plate: "",
        vin: "",
        admin_id: this.props.route?.params?.admin_id || null, // 👈 admin_id recibido desde NAVBAR/Login
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
      const { imagenbase64, NombrePhoto, make, model, precio, license_plate, vin, admin_id } = this.state;

      if (!imagenbase64 || !NombrePhoto || !make || !model || !precio || !license_plate || !vin) {
        Alert.alert('Error', 'Completa todos los campos antes de subir.');
        return;
      }

      // Subir imagen a Supabase Storage
      const fileData = this.base64ToUint8Array(imagenbase64);
      const { error: uploadError } = await supabase.storage
        .from('Imagenes')
        .upload(`${NombrePhoto}.jpg`, fileData, { contentType: 'image/jpeg' });

      if (uploadError) {
        console.log("Error al subir:", uploadError);
        Alert.alert("Error", "No se pudo subir la imagen.");
        return;
      }

      const imageUrl = `${supabaseUrl}/storage/v1/object/public/Imagenes/${NombrePhoto}.jpg`;

      // Insertar en tabla vehiculos
      const { error: insertError } = await supabase
        .from('vehiculos')
        .insert([
          {
            imagen: imageUrl,
            user_id: admin_id, // 👈 ID del admin logueado
            make: make,
            model: model,
            precio: precio,
            license_plate: license_plate,
            vin: vin
          }
        ]);

      if (insertError) {
        console.error('Error al insertar:', insertError);
        Alert.alert('Error', 'No se pudo registrar el vehículo.');
      } else {
        Alert.alert('Éxito', 'Vehículo registrado correctamente.');
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
        } else if(response.assets && response.assets[0]){
            this.setState({
                imagenbase64: response.assets[0].base64,
                imagenuri: response.assets[0].uri
            });
        }
      });
    }

    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 30, color: "red", textAlign: "center" }}> Altas de Vehículos </Text>
        <Text>ID Admin: {this.state.admin_id}</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View>{this.imagenbs64()}<Text>BASE 64</Text></View>
          <View>{this.imagenuri()}<Text>URL</Text></View>
        </View>

        <TextInput placeholder="Nombre archivo imagen" onChangeText={NombrePhoto => this.setState({NombrePhoto})} style={styles.input} />
        <TextInput placeholder="Marca" onChangeText={make => this.setState({make})} style={styles.input} />
        <TextInput placeholder="Modelo" onChangeText={model => this.setState({model})} style={styles.input} />
        <TextInput placeholder="Precio" keyboardType="numeric" onChangeText={precio => this.setState({precio})} style={styles.input} />
        <TextInput placeholder="Placas" onChangeText={license_plate => this.setState({license_plate})} style={styles.input} />
        <TextInput placeholder="VIN" onChangeText={vin => this.setState({vin})} style={styles.input} />

        <Button title="Abrir Galería" onPress={abreGaleria} />
        <View style={{ marginTop: 10 }}>
          <Button title="Registrar Vehículo" onPress={subirASupabase} />
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
