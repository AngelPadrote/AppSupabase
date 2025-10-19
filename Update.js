import React, { Component } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oagktleyuvsbtbxnltiq.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2t0bGV5dXZzYnRieG5sdGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MjA3NTIsImV4cCI6MjA1NTQ5Njc1Mn0.Lv_3sU9hNagKH4R6bmEGMY8tyTzNpvexwUq9AMix3BU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default class Update extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NombrePhoto: '',
      Producto: '',
      Cantidad: '',
      Precio: '',
      Descripcion: ''
    };
  }

  async componentDidMount() {
    const { Imagen } = this.props.route.params;

    const { data, error } = await supabase
      .from('Productos2')
      .select('*')
      .eq('Imagen', Imagen)
      .single();

    if (error) {
      console.error('Error al obtener datos:', error);
      Alert.alert('Error', 'No se pudo obtener la información del producto.');
    } else {
      this.setState({
        NombrePhoto: Imagen.split('/').pop().replace('.jpg', ''),
        Producto: data.Producto,
        Cantidad: data.Cantidad,
        Precio: data.Precio,
        Descripcion: data.Descripcion
      });
    }
  }

  actualizarProducto = async () => {
    const { NombrePhoto, Producto, Cantidad, Precio, Descripcion } = this.state;

    if (!NombrePhoto || !Producto || !Cantidad || !Precio || !Descripcion) {
      Alert.alert('Error', 'Completa todos los campos antes de actualizar.');
      return;
    }

    const urlPublica = `${supabaseUrl}/storage/v1/object/public/Imagenes/${NombrePhoto}.jpg`;

    const { error } = await supabase
      .from('Productos2')
      .update({
        Producto,
        Cantidad,
        Precio,
        Descripcion
      })
      .eq('Imagen', urlPublica);

    if (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'No se pudo actualizar el producto.');
    } else {
      Alert.alert('Éxito', 'Producto actualizado correctamente.');
      this.setState({
        NombrePhoto: '',
        Producto: '',
        Cantidad: '',
        Precio: '',
        Descripcion: ''
      });
    }
  };

  render() {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 30, color: 'red', textAlign: 'center' }}>Actualizar Producto</Text>

        <TextInput
          placeholder="Nombre archivo imagen (sin .jpg)"
          value={this.state.NombrePhoto}
          onChangeText={NombrePhoto => this.setState({ NombrePhoto })}
          style={{
            height: 45,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: '#fff'
          }}
        />
        <TextInput
          placeholder="Nuevo nombre del producto"
          value={this.state.Producto}
          onChangeText={Producto => this.setState({ Producto })}
          style={{
            height: 45,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: '#fff'
          }}
        />
        <TextInput
          placeholder="Nueva cantidad"
          value={this.state.Cantidad}
          onChangeText={Cantidad => this.setState({ Cantidad })}
          style={{
            height: 45,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: '#fff'
          }}
        />
        <TextInput
          placeholder="Nuevo precio"
          value={this.state.Precio}
          onChangeText={Precio => this.setState({ Precio })}
          style={{
            height: 45,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: '#fff'
          }}
        />
        <TextInput
          placeholder="Nueva descripción"
          value={this.state.Descripcion}
          onChangeText={Descripcion => this.setState({ Descripcion })}
          multiline
          style={{
            height: 90,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 10,
            marginVertical: 10,
            paddingHorizontal: 10,
            backgroundColor: '#fff',
            textAlignVertical: 'top'
          }}
        />

        <View style={{ marginTop: 10 }}>
          <Button title="Actualizar Producto" onPress={this.actualizarProducto} />
        </View>
      </View>
    );
  }
}
