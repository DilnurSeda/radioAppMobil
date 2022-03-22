import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import * as Yup from 'yup';
import auth from '@react-native-firebase/auth';
const Login = (props) => {
  const login = (values, { setSubmitting, resetForm}) => {
    try{
      auth().signInWithEmailAndPassword(values.email, values.password).then(() => {
        resetForm({});
      })
        .catch((error) => {
          if (error.code === 'auth/email-already-in-use') {
            alert('Bu Email Adresi Kullanımda');
            setSubmitting(false);
          }

          if (error.code === 'auth/invalid-email') {
            alert('Bu Email Adresi Geçerli Değil');
            setSubmitting(false);
          }

          if(error.code === 'auth/weak-password'){
            alert('Şifre Çok Kısa');
            setSubmitting(false);
          }

          if(error.code === 'auth/wrong-password'){
            alert('Şifre Hatalı');
            setSubmitting(false);
          }

          if(error.code === 'auth/user-not-found'){
            alert('Kullanıcı Bulunamadı');
            setSubmitting(false);
          }

          console.error(error);
        });
    }catch (e){
      alert(e.message);
      setSubmitting(false);
    }

    //setSubmitting(false);
    //resetForm({});
  }
  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.logo}>RadioApp</Text>
      </View>
      <Formik
        initialValues={{email:'', password:''}}
        onSubmit={login}
        validationSchema={
          Yup.object().shape({
            email: Yup.string().email('Email Formatı Hatalı').required('Email alanı zorunludur.'),
            password: Yup.string().required('Şifre zorunludur.')
          })
        }>
        {({ values, handleSubmit, errors, handleChange, isValid, isSubmitting}) => (
          <View style={style.formContainer}>
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
                <Text style={style.buttonText}>Giriş</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => props.navigation.navigate('Register')}>
                <Text style={{textAlign:'center', fontSize:18, color:'#fff'}}>Hesabınız yok ise Kayıt Olun</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  )
}

const style = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#000',
    justifyContent:'center',
    alignItems:'center'
  },
  header:{
    marginBottom:30,
  },
  logo:{
    fontSize:30,
    color:'#fff',
    fontWeight:'700',
    textAlign:'center',
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
});


export default Login;
