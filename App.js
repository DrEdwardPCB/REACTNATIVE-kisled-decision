import 'react-native-gesture-handler';
import { View, SafeAreaView, Image } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'native-base';
import PreferenceScreen from './Screen/PreferenceScreen'
import RandomScreen from "./Screen/RandomScreen"
import ShuffleScreen from "./Screen/ShuffleScreen"
import ProfileScreen from "./Screen/ProfileScreen"
//import SplashScreen from 'react-native-splash-screen'
import PreferenceManager from './Manager/PreferenceManager';
import ProfileManager from './Manager/ProfileManager';
import COLOR, { getStyle } from './StyleSheets/Theme'
import admob, { MaxAdContentRating } from '@react-native-firebase/admob';

/**
 * preference item: start up screen opt
 * bright or dark theme
 * auto add to profile
 */


const Tab = createBottomTabNavigator();
class MyTabs extends React.Component {
  constructor() {
    super()
    this.state={
      dummy:""
    }
  }
  updateDummy=(callback)=>{
    this.setState({dummy:""},()=>{callback()})
  }
  render() {
    return (
      <Tab.Navigator initialRouteName={PreferenceManager.getInstance().getPreferenceObject().StartupPage} tabBarOptions={{
        
        activeTintColor: getStyle(COLOR.BLUE, true, true).backgroundColor,
        //activeBackgroundColor
        inactiveTintColor: getStyle(COLOR.GRAY2, true, true).backgroundColor,
        //inactiveBackgroundColor
        style: [getStyle(COLOR.GRAY6, true, true)]
      }}>
        <Tab.Screen name="Random" component={RandomScreen} options={{ tabBarIcon: ({ focused, color, size }) => { return <Icon type="Entypo" name="select-arrows" color={color} size={size} style={{ color: color, fontSize: size }} /> }, unmountOnBlur: true }} />{/**only show 1 output */}
        <Tab.Screen name="Shuffle" component={ShuffleScreen} options={{ tabBarIcon: ({ focused, color, size }) => { return <Icon type="Ionicons" name="ios-shuffle" color={color} size={size} style={{ color: color, fontSize: size }} /> }, unmountOnBlur: true }} />{/**show desire number of output with repeat or without repeat */}
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ({ focused, color, size }) => { return <Icon type="AntDesign" name="profile" color={color} size={size} style={{ color: color, fontSize: size }} /> }, unmountOnBlur: true }} />
        <Tab.Screen name="Preference" component={PreferenceScreen} options={{ tabBarIcon: ({ focused, color, size }) => { return <Icon type="Ionicons" name="ios-settings" color={color} size={size} style={{ color: color, fontSize: size }} /> }, unmountOnBlur: true}} initialParams={{update:this.updateDummy}}/>
    
      </Tab.Navigator>
    );
  }
}
export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      showSplash: true
    }
    //console.log(this.state)
  }
  /*static getDerivedStateFromProps(a,b){
    
    var interval=setInterval(()=>{
      var theme=PreferenceManager.getInstance().getPreferenceObject();
      console.log("still not ready")
      if(theme!==null){
        console.log("ready")
        clearInterval(interval)
        SplashScreen.hide();
        return null
      }
    },300)
  }*/
  componentDidMount() {
    //SplashScreen.show();
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    admob()
      .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: true,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,
      })
      .then(() => {
        // Request config successfully set!
        var async1=new Promise((resolve,reject)=>{
          var interval = setInterval(() => {
            var theme = PreferenceManager.getInstance().getPreferenceObject();
            console.log("still not ready")
            if (theme !== null) {
              console.log("ready")
              clearInterval(interval)
              resolve()
            }
          }, 300)
        })
        var async2=new Promise((resolve,reject)=>{
          var interval1 = setInterval(() => {
            var theme = ProfileManager.getInstance().getProfilesObject();
            console.log("still not ready")
            if (theme !== null) {
              console.log("ready")
              clearInterval(interval1)
              resolve()
            }
          }, 300)
        })
        Promise.all([async1,async2]).then(()=>this.setState({showSplash:false}))
      });
    
  }

  render() {
    if (this.state.showSplash) {
      return (
        <View>
          <SafeAreaView>
            <Image source={require("./assets/Appsplash1.png")} resizeMode='contain' style={{ alignContent: 'center', justifyContent: 'center', width: '100%', height: '100%' }}></Image>
          </SafeAreaView>
        </View>
      )
    }
    return (
      <NavigationContainer>
        {console.log('start loading')}
        <MyTabs />
      </NavigationContainer>
    )
  }
}