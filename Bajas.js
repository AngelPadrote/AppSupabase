import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert} from 'react-native';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oagktleyuvsbtbxnltiq.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2t0bGV5dXZzYnRieG5sdGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MjA3NTIsImV4cCI6MjA1NTQ5Njc1Mn0.Lv_3sU9hNagKH4R6bmEGMY8tyTzNpvexwUq9AMix3BU"
const supabase = createClient(supabaseUrl, supabaseKey)

export default class Bajas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NombrePhoto: '',
    };
  }

  eliminarProducto = async () => {
    const { NombrePhoto } = this.state;

    if (!NombrePhoto) {
      Alert.alert('Error', 'Escribe el nombre del archivo para eliminar.');
      return;
    }

    const imagenNombre = `${NombrePhoto}.jpg`;

    const { error: errorStorage } = await supabase
      .storage
      .from('Imagenes')
      .remove([imagenNombre]);

    if (errorStorage) {
      console.error('Error al eliminar imagen:', errorStorage);
      Alert.alert('Error', 'No se pudo eliminar la imagen del bucket.');
      return;
    }

    const urlPublica = `${supabaseUrl}/storage/v1/object/public/Imagenes/${imagenNombre}`;
    const { error: errorDB } = await supabase
      .from('Productos2')
      .delete()
      .eq('Imagen', urlPublica);

    if (errorDB) {
      console.error('Error al eliminar registro:', errorDB);
      Alert.alert('Error', 'No se pudo eliminar el registro de la base de datos.');
    } else {
      Alert.alert('Éxito', 'Producto eliminado correctamente.');
      this.setState({ NombrePhoto: '' });
    }
  };

  render() {
    return (
      <View contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 30, color: 'red', textAlign: 'center' }}>Eliminar Producto</Text>

        <TextInput
          placeholder="Nombre archivo imagen (sin .jpg)"
          onChangeText={NombrePhoto => this.setState({ NombrePhoto })}
          value={this.state.NombrePhoto}
          style={{
            height: 45,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            width:350,
            marginLeft:35
          }}
        />
        <View style={{
            width:300,
            marginLeft:60
            }}>
        <Button title="Eliminar Producto" onPress={this.eliminarProducto}/>
        </View>
      </View>
    );
  }
}
