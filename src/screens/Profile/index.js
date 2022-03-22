import React, {useEffect, useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, LogBox } from "react-native";
import auth from "@react-native-firebase/auth";
import Modal from "react-native-modal";
import * as Yup from "yup";
import { Formik } from "formik";
import database from '@react-native-firebase/database';
import { inject, observer} from "mobx-react";
import Header from "../../Components/Header";
import { forwardAsync } from "@babel/core/lib/gensync-utils/async";

// // Ignore log notification by message:
// LogBox.ignoreLogs(['Warning: ...']);
//
// // Ignore all log notifications:
// LogBox.ignoreAllLogs();

const Home = (props) => {
  const [visible, setVisible] = useState(false);
  const currentUser = auth().currentUser;

  const update = (values, { setSubmitting, resetForm}) => {

    currentUser.updateProfile({
      displayName:values.name
    }).then(() => {
      setSubmitting(false);
    });

    if(values.password != '' && values.password != null){
      currentUser.updatePassword(values.password).then(() => {
        setSubmitting(false);
      }).catch((error) => {
        if(error.code === 'auth/weak-password'){
          alert('Şifre Çok Kısa');
          setSubmitting(false);
        }
        if (error.code === 'auth/requires-recent-login') {
          alert('Şifre Güncellenemedi.Lütfen tekrar giriş yapıp deneyiniz.');
          setSubmitting(false);
        }
      })
    }

    currentUser.updateEmail(values.email).then(() => {
      setSubmitting(false);
    }).catch((error) => {
      if (error.code === 'auth/email-already-in-use') {
        alert('Bu Email Adresi Kullanımda');
        setSubmitting(false);
      }

      if (error.code === 'auth/invalid-email') {
        alert('Bu Email Adresi Geçerli Değil');
        setSubmitting(false);
      }

      if (error.code === 'auth/requires-recent-login') {
        alert('Email Güncellenemedi.Lütfen tekrar giriş yapıp deneyiniz.');
        setSubmitting(false);
      }
    })
  };

  return (
    <View style={style.container}>
      <Header/>
      <View style={style.itemTopContainer}>
        <Formik
          initialValues={{
            name:currentUser.displayName,
            email:currentUser.email,
            password:''
          }}
          onSubmit={update}
          validationSchema={
            Yup.object().shape({
              name: Yup.string().required('Adınız Zorunludur'),
              email: Yup.string().email('Email Formatı Hatalı').required('Email alanı zorunludur.'),
            })
          }>
          {({ values, handleSubmit, errors, handleChange, isValid, isSubmitting}) => (
            <View style={style.formContainer}>
              <View style={style.inputContainer}>
                <TextInput
                  value={values.name}
                  placeholder='Adınız veya Kullanıcı Adı'
                  autoCapitalize='none'
                  placeholderTextColor={'#fff'}
                  onChangeText={handleChange('name')}
                  style={style.input}
                />
                {(errors.name) && <Text style={style.error}>{errors.name}</Text>}
              </View>
              <View style={style.inputContainer}>
                <TextInput
                  value={values.email}
                  placeholder='Email Adresiniz'
                  autoCapitalize='none'
                  placeholderTextColor={'#fff'}
                  onChangeText={handleChange('email')}
                  style={style.input}
                />
                {(errors.email) && <Text style={style.error}>{errors.email}</Text>}
              </View>
              <View style={style.inputContainer}>
                <TextInput
                  value={values.password}
                  placeholder='Şifre'
                  autoCapitalize='none'
                  secureTextEntry={true}
                  placeholderTextColor={'#fff'}
                  onChangeText={handleChange('password')}
                  style={style.input}
                />
                {(errors.password) && <Text style={style.error}>{errors.password}</Text>}
              </View>
              <View style={style.inputContainer}>
                <TouchableOpacity
                  style={style.button}
                  disabled={!isValid || isSubmitting}
                  onPress={handleSubmit}
                >
                  <Text style={style.buttonText}>Güncelle</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
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
    marginTop:20,
    justifyContent:'center',
    alignItems:'center',
    flex:1
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
