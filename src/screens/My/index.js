import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from "react-native";
import auth from "@react-native-firebase/auth";
import Modal from "react-native-modal";
import * as Yup from "yup";
import { Formik } from "formik";
import database from '@react-native-firebase/database';
import { inject, observer} from "mobx-react";
import Header from "../../Components/Header";

const Home = (props) => {
  const [visible, setVisible] = useState(false);
  const currentUser = auth().currentUser;
  const [data, setData] = useState([]);
  const [currentForm, setCurrentForm] = useState({
    key:'',
    name:'',
    url:''
  });

  useEffect(() => {
    database()
      .ref('/data')
      .orderByChild('uid')
      .startAt(auth().currentUser.uid)
      .endAt(auth().currentUser.uid)
      .on('value', snapshot => {
        let newArray = [];
        snapshot.forEach((item, key) => {
          let ItemObject = item.val();
          ItemObject['key'] = item.key;
          newArray.push(ItemObject);
        })
        setData(newArray);
      });
  }, [])

  const update = (values, { resetForm ,setSubmitting}) => {
    database()
      .ref(`/data/${currentForm.key}`)
      .update({
        ...values,
      })
      .then(() => {
        alert('Veriler güncellendi');
        setVisible(false);
        setSubmitting(false);
      }).catch((e) => {
        alert(e.message);
        setSubmitting(false);
    })
  };

  const openModal = (item) => {
    setCurrentForm({
      key:item.key,
      name:item.name,
      url:item.url
    });
    setVisible(true)
  }

  const longPress = (item) => {
    Alert.alert('Akışı Silmek İster misin?', 'Bunu Silersen Geri Alamazsın', [
      {
        text:'Evet',
        onPress:async ()=>{
          await database().ref(`/data/${item.key}`).remove();
        }
      },
      {
        text:'Hayır'
      }
    ])
  }

  const renderItem = ({ item }) => {
    return <TouchableOpacity
      onLongPress={() => longPress(item)}
      onPress={() => openModal(item)} style={style.itemContainer}>
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
      <Modal isVisible={visible}>
        <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
          <View style={{backgroundColor:'#000', paddingVertical:20, width:350, justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity onPress={() => setVisible(false)} style={{ zIndex:999 ,justifyContent:'center', alignItems:'center', position:'absolute', top:0, right:0, width:40, height:40, borderRadius:100, backgroundColor:'red'}}>
              <Text style={{fontSize:15, color:'#fff', fontWeight:'700'}}>X</Text>
            </TouchableOpacity>
            <Formik
              initialValues={{
                  name:currentForm.name,
                  url:currentForm.url
              }}
              onSubmit={update}
              validationSchema={
                Yup.object().shape({
                  name: Yup.string().required('Yayın Adı zorunludur.'),
                  url: Yup.string().required('Yayın Adres zorunludur.')
                })
              }>
              {({ values, handleSubmit, errors, handleChange, isValid, isSubmitting}) => (
                <View style={style.formContainer}>
                  <View style={style.inputContainer}>
                    <TextInput
                      value={values.name}
                      placeholder='Yayın Adı'
                      placeholderTextColor={'#fff'}
                      onChangeText={handleChange('name')}
                      style={style.input}
                    />
                    {(errors.name) && <Text style={style.error}>{errors.name}</Text>}
                  </View>
                  <View style={style.inputContainer}>
                    <TextInput
                      value={values.url}
                      placeholder='Yayın Adresi'
                      placeholderTextColor={'#fff'}
                      onChangeText={handleChange('url')}
                      style={style.input}
                    />
                    {(errors.url) && <Text style={style.error}>{errors.url}</Text>}
                  </View>
                  <View style={style.inputContainer}>
                    <TouchableOpacity
                      style={style.button}
                      disabled={!isValid || isSubmitting}
                      onPress={handleSubmit}
                    >
                      <Text style={style.buttonText}>Kaydet</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>
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
