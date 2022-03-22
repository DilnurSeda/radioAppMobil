import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";

const Controls = ({name, loading, paused, onPressPlay, onPressPause, onClosePlayer}) => {

  return (<View style={style.container}>
    <Text style={{fontSize:15, color:'#fff'}}>{name}</Text>
    {loading && <ActivityIndicator/>}
    {!loading &&
      <View style={{flexDirection:'row', alignItems:'center'}}>
        <TouchableOpacity onPress={(paused) ? onPressPlay : onPressPause}>
          <Text style={{fontSize:15, color:'#fff'}}>{paused ? 'Oynat' : 'Durdur'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft:10, width:30, borderRadius:100, backgroundColor:'red', alignItems:'center'}} onPress={onClosePlayer}>
          <Text style={{fontSize:15, color:'#fff', fontWeight:'700'}}>X</Text>
        </TouchableOpacity>
      </View>
    }
  </View>)

};

const style = StyleSheet.create({
  container:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  }
})

export default Controls;
