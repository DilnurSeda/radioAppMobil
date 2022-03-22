import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput } from "react-native";
import auth from "@react-native-firebase/auth";
import database from '@react-native-firebase/database';
import { inject, observer} from "mobx-react";
import Header from "../../Components/Header";

const Home = (props) => {
  const [visible, setVisible] = useState(false);
  const currentUser = auth().currentUser;
  const [data, setData] = useState([]);

  useEffect(() => {
    database()
      .ref('/data')
      .on('value', snapshot => {
          let newArray = [];
          snapshot.forEach((item) => {
            newArray.push(item.val());
          })
        setData(newArray);
      });
  }, [])

  const openStream = (item) => {
    props.PlayerStore.savePlayer(item.url, item.name);
  }

  const renderItem = ({ item }) => {
    return <TouchableOpacity onPress={() => openStream(item)} style={style.itemContainer}>
      <Text style={style.item}>{item.name}</Text>
    </TouchableOpacity>
  }

  return (
    <View style={style.container}>
      <Header/>
      <View style={style.itemTopContainer}>
        <FlatList
          data={data}
          numColumns={2}
          renderItem={renderItem}
        />
      </View>
    </View>)
}

const style = StyleSheet.create({
  container:{
    backgroundColor:'#000',
    flex:1
  },
  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:10,
    paddingVertical:15,
    borderBottomWidth:1,
    borderColor:'#fff',
  },
  right:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
  },
  name:{
    color:'#fff',
    fontWeight:'700',
    fontSize:18
  },
  logoutContainer:{
    marginLeft:10
  },
  logout:{
    color:'#fff',
    fontWeight:'700',
    fontSize:18
  },
  addContainer:{
    marginLeft:5
  },
  add:{
    color:'#fff',
    fontWeight:'700',
    fontSize:18
  },
  itemContainer:{
    flex:1,
    borderWidth:1,
    borderColor:'#fff',
    marginBottom:15,
    marginHorizontal:5,
    justifyContent:'center',
    alignItems:'center',
    minHeight:100,
    borderRadius:5,
    backgroundColor:'#161616'
  },
  item:{
    color:'#fff',
    textAlign:"center",
    fontSize:20,
    fontWeight:'700'
  },
  itemTopContainer:{
    paddingHorizontal:10,
    marginTop:20
  },
  inputContainer:{
    marginBottom:20,
    justifyContent:'center',
    alignItems:'center'
  },
  input:{
    padding:15,
    borderRadius:5,
    backgroundColor:'#161616',
    width:'100%',
    color:'#fff',
  },
  formContainer:{
    width:'100%',
    paddingHorizontal:30,
    justifyContent:'center',
  },
  button:{
    paddingHorizontal:10,
    paddingVertical:15,
    backgroundColor:'#607D8B',
    width:100,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:5
  },
  buttonText:{
    color:'#fff',
    fontSize:19,
    fontWeight:'700'
  },
  error:{
    fontSize:16,
    color:'#F44336',
    marginTop:5,
  }
})

export default inject('PlayerStore')(observer(Home));
