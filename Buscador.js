import React, { Component } from 'react'
import { Button, Image, Text, TextInput, View, Alert, TouchableOpacity,FlatList } from 'react-native'
import { createClient } from '@supabase/supabase-js'
import 'react-native-url-polyfill/auto';
import { PreventRemoveProvider } from '@react-navigation/native';


    const supabaseUrl = 'https://oagktleyuvsbtbxnltiq.supabase.co'
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZ2t0bGV5dXZzYnRieG5sdGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk5MjA3NTIsImV4cCI6MjA1NTQ5Njc1Mn0.Lv_3sU9hNagKH4R6bmEGMY8tyTzNpvexwUq9AMix3BU" 
    const supabase = createClient(supabaseUrl, supabaseKey)

export default class Productos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Elementos:[],
      search:'',
    };
  }
  async componentDidMount(){
    
    let { data: Productos2, error } = await supabase
    .from('vehiculos')
    .select('*')

    if(error){
      Alert.alert('Error', 'No se pudo conectar con la base de datos.');
      console.error(error);
    }else{
      this.setState({ Elementos: Productos2 });
      console.log(Productos2);
    }
  }
  
  render() {
    const Busqueda = async () =>{
      const  {search} = this.state

      let { data: Productos2, error } = await supabase
      .from('vehiculos')
      .select('*')
      .ilike("make", `%${search}%`);

      if(error){
        Alert.alert('Error', 'No se pudo conectar con la base de datos.');
        console.error(error);
      }else{
        this.setState({ Elementos: Productos2 });
        console.log(Productos2);
      }
    }
    return (
      
      <View>
        <View>
        <View>
          <TextInput placeholder='Ingresa Producto' style={{
            width:200,
            height:45,
            padding:1,
            borderRadius:15,
            borderStyle:'solid',
            borderWidth:2,
            marginBottom:15,
            backgroundColor: '#fff',
            borderColor: '#ccc',
            paddingHorizontal: 25,
            fontSize: 15,
            marginTop:20,
            marginLeft:105
          }} onChangeText={search => this.setState({search})}>
          </TextInput>
        </View>
        <TouchableOpacity onPress={Busqueda}>
        <Image source={require("./Imagenes/Lupa.png")} style={{
          width:30,
          height:30,
          marginTop:-50,
          marginLeft:260
        }}></Image>
        </TouchableOpacity>
        </View>
        <FlatList
              contentContainerStyle={{ paddingBottom: 45 }}
                data={this.state.Elementos}
                renderItem={({item}) => (
                  <View style={{ flexDirection: "row", alignItems: "center", padding: 20 }}>  
                    <Image
                      source={{uri:item.imagen}}
                      style={{
                        width: 200,
                        height: 200,
                        resizeMode: "cover",
                        marginRight: 20,
                      }}
                    />
                          
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 25,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginBottom: 10,
                        }}
                      >
                          {item.make}
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginBottom: 10,
                        }}
                      >
                          {item.model}
                      </Text>
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginBottom: 10,
                        }}
                      >{item.precio}
                      </Text>
                      
        
                      <View style={{ alignItems: "center" }}>
                      <Button title="Ver Detalles" onPress={() => this.props.navigation.navigate("UPDATE", { imagen: item.imagen, })}/>
                      </View>
                    </View>
                  </View>
                )}
                  
                keyExtractor={item => item.id}
              />

      
      </View>
      
    );
  }
}

