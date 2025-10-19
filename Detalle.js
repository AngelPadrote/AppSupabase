import React, { Component } from 'react';
import { View, Text, Image, Button, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

// Configuración de Supabase
const supabaseUrl = 'https://oagktleyuvsbtbxnltiq.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2t0bGV5dXZzYnRieG5sdGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MjA3NTIsImV4cCI6MjA1NTQ5Njc1Mn0.Lv_3sU9hNagKH4R6bmEGMY8tyTzNpvexwUq9AMix3BU";
const supabase = createClient(supabaseUrl, supabaseKey);

export default class Detalle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      producto: null,
    };
  }

  async componentDidMount() {
    const { id } = this.props.route.params;

    let { data: producto, error } = await supabase
      .from('Productos2')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      Alert.alert('Error', 'No se pudo conectar con la base de datos.');
      console.error(error);
    } else {
      this.setState({ producto }); 
      console.log(producto); 
    }
  }

  render() {
    const { producto } = this.state;

    return (
      <View style={{ padding: 20 }}>
        <Text style={{ 
          fontSize: 30, 
          color: 'green', 
          textAlign: 'center' 
          }}>

          {producto?.Producto}

        </Text>
        
        <Image
          source={{ uri: producto?.Imagen }}
          style={{
            width: 300,
            height: 300,
            alignSelf: 'center',
            marginTop: 20,
          }}
        />
        
        <Text style={{ 
          fontSize: 30, 
          textAlign: 'center', 
          marginTop: 20 
          }}>

          ${producto?.Precio}
        
        </Text>
        
        <Text style={{ 
          fontSize: 20, 
          marginTop: 10 
          }}>
          Descripción: {producto?.Descripcion}
        </Text>

        <View style={{ 
          marginTop: 30, 
          alignItems: 'center',
          }}>
          <Button title="Comprar" onPress={() => Alert.alert('Compra realizada')}/>
        </View>
      </View>
    );
  }
}
