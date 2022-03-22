import React, { useEffect, useState } from "react";
import { NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator} from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import auth from "@react-native-firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image } from "react-native";

import Home from "../screens/Home/index";
import Profile from "../screens/Profile/index";
import My from "../screens/My/index";
import Login from "../screens/Auth/login";
import Register from "../screens/Auth/register";

const Stack = createNativeStackNavigator();
const HomeStack = () => {
  return (<Stack.Navigator initialRouteName={"HomeIndex"}>
            <Stack.Screen
              name="HomeIndex"
              options={{headerShown:false}}
              component={Home}
            />
          </Stack.Navigator>);
}

const AuthStack = () => {
  return (<Stack.Navigator initialRouteName={"Login"}>
    <Stack.Screen
      name="Login"
      options={{headerShown:false}}
      component={Login}
    />
    <Stack.Screen
      name="Register"
      options={{headerShown:false}}
      component={Register}
    />
  </Stack.Navigator>);
}

const Tab = createBottomTabNavigator();
const customTabBarStyle = {
  tabBarActiveTintColor: 'blue',
  tabBarInactiveTintColor: 'black',
  tabBarActiveBackgroundColor: 'white',
  headerShown:false
};
const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={customTabBarStyle}
    >
      <Tab.Screen name="Home" component={Home}
        options={{
          tabBarLabel: 'Keşfet',
          showIcon: true,
          tabBarIcon: ({color}) => (
            <Icon name={'home'} size={20} color={color} />
          )
        }}
      />
      <Tab.Screen name="My" component={My}
                  options={{
                    tabBarLabel: 'Akışım',
                    showIcon: true,
                    tabBarIcon: ({color}) => (
                      <Icon name={'list'} size={20} color={color} />
                    )
                  }}
      />
      <Tab.Screen name="Profile" component={Profile}
                  options={{
                    tabBarLabel: 'Hesap',
                    showIcon: true,
                    tabBarIcon: ({color}) => (
                      <Icon name={'user'} size={20} color={color} />
                    )
                  }}
      />
    </Tab.Navigator>
  )
}

const AppNavigationContainer = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(()=>{
    auth().onAuthStateChanged(user => {

      if(user){
        setIsSignedIn(true);
      }else{
        setIsSignedIn(false);
      }
    })
  }, []);

  return <NavigationContainer>
          { isSignedIn ? <AppTabs/> : <AuthStack/> }
          </NavigationContainer>
}

export default AppNavigationContainer;
