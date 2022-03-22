import React from "react";
import { observable, action, makeObservable} from "mobx";

class PlayerStore
{
  player = null;
  constructor() {
    makeObservable(this, {
      player:observable,
      savePlayer:action,
      getPlayer:action
    })
  }

  getPlayer = () => {
    return this.player;
  }

  savePlayer = (url, name) => {
    this.player = { url, name};
  }

  closePlayer = (url, name) => {
    this.player = null;
  }
}

export default new PlayerStore();
