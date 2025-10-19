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
      make: '',
      model: '',
      precio: '',
      license_plate: '',
      vin: ''
    };
  }

  async componentDidMount() {
    const { imagen } = this.props.route.params;

    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('imagen', imagen)
      .single();

    if (error) {
      console.error('Error al obtener datos:', error);
      Alert.alert('Error', 'No se pudo obtener la información del vehículo.');
    } else {
      console.log("🚗 Datos recibidos:", data);
      this.setState({
        NombrePhoto: imagen.split('/').pop().replace('.jpg', ''),
        make: data.make || '',
        model: data.model || '',
        precio: data.precio !== null ? data.precio.toString() : '', // ✅ campo correcto
        license_plate: data.license_plate || '',
        vin: data.vin || '',
      });
    }
  }

  actualizarProducto = async () => {
    const { NombrePhoto, make, model, precio, license_plate, vin } = this.state;

    if (!NombrePhoto || !make || !model || !precio || !license_plate || !vin) {
      Alert.alert('Error', 'Completa todos los campos antes de actualizar.');
      return;
    }

    const urlPublica = `${supabaseUrl}/storage/v1/object/public/Imagenes/${NombrePhoto}.jpg`;

    const { error } = await supabase
      .from('vehiculos')
      .update({
        make,
        model,
        precio: parseInt(precio, 10), // ✅ lo guarda como número entero
        license_plate,
        vin
      })
      .eq('imagen', urlPublica);

    if (error) {
      console.error('Error al actualizar:', error);
      Alert.alert('Error', 'No se pudo actualizar el vehículo.');
    } else {
      Alert.alert('Éxito', 'Vehículo actualizado correctamente.');
      this.setState({
        NombrePhoto: '',
        make: '',
        model: '',
        precio: '',
        license_plate: '',
        vin: '',
      });
    }
  };

  render() {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 30, color: 'red', textAlign: 'center' }}>Actualizar Vehículo</Text>

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
          placeholder="Nuevo nombre del vehículo"
          value={this.state.make}
          onChangeText={make => this.setState({ make })}
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
          placeholder="Nuevo modelo del vehículo"
          value={this.state.model}
          onChangeText={model => this.setState({ model })}
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
          placeholder="Nuevo Precio"
          value={this.state.precio}
          onChangeText={precio => this.setState({ precio })}
          keyboardType="numeric"
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
          placeholder="Nuevas placas"
          value={this.state.license_plate}
          onChangeText={license_plate => this.setState({ license_plate })}
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
          placeholder="Nuevo VIN"
          value={this.state.vin}
          onChangeText={vin => this.setState({ vin })}
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

        <View style={{ marginTop: 10 }}>
          <Button title="Actualizar Vehículo" onPress={this.actualizarProducto} />
        </View>
      </View>
    );
  }
}
