import React, { useEffect, useState } from "react";
import Video from 'react-native-video';
import MusicControl from "react-native-music-control";
import { View, StyleSheet } from "react-native";
import Controls from "./Controls";
import {inject, observer} from "mobx-react";

const Player = (props) => {
  const [pause, setPause] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    MusicControl.enableBackgroundMode(true);
    MusicControl.enableControl('play', false);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', false);
    MusicControl.enableControl('previewTrack', false);
    MusicControl.on('play', onPlay);
    MusicControl.on('pause', onPause);
  }, []);

  const onPlay = () => {
    MusicControl.setNowPlaying({
      title:'Alem FM'
    });
    MusicControl.enableControl('play', false);
    MusicControl.enableControl('pause', true);
    setLoading(true);
    setPause(false);
  }

  const onPause = () => {
    setPause(true);
  }

  const onLoadStart = () => {
    setLoading(true);
  }

  const onProgress = () => {
    if(loading){
      setLoading(false);
    }
  }

  const closePlayer = (error) => {
    props.PlayerStore.closePlayer();
  }

  const onError = (error) => {
    alert(error.error.errorString);
    closePlayer();
  }

  if(props.PlayerStore.player == null )
    return <View></View>

  return<View style={style.container}>
          <Controls
            loading={loading}
            paused={pause}
            name={props.PlayerStore.player.name}
            onPressPlay={onPlay}
            onPressPause={onPause}
            onClosePlayer={closePlayer}
          />
          <Video
            paused={pause}
            onLoadStart={onLoadStart}
            onProgress={onProgress}
            onError={onError}
            playInBackground={true}
            source={{uri: props.PlayerStore.player.url}}
          />
        </View>
}

const style = StyleSheet.create({
  container:{
    backgroundColor:'#272727',
    padding:20,
    justifyContent:'center'
  }
})

export default inject('PlayerStore')(observer(Player));
