import React, { useEffect } from 'react';
import * as Phaser from 'phaser';
import Scenes from '../game/scenes';
import { Tutorial } from '../components/Tutorial';

const removeValuesInLocalStorage = () => {
  window.localStorage.removeItem('mypId');
  window.localStorage.removeItem('maxClients');
  window.localStorage.removeItem('maxAstroids');
  window.localStorage.removeItem('maxEnemys');
};

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Space Player',

  type: Phaser.AUTO,

  scale: {
    width: 1280,
    height: 960,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  scene: Scenes,

  physics: {
    default: 'arcade',
    arcade: {
      // found pink borders and green movment vector (if debug true)
      debug: false,
    },
  },

  parent: 'game',
  backgroundColor: '#000000',
};

export const GamePage = () => {
  useEffect(() => {
    const guestMode = `${localStorage.getItem('GuestCheck')}`;
    (async () => {
      if (guestMode !== 'true') {
        const getUser = await fetch('/api/user/', {
          method: 'GET',
          headers: { Authorization: `${localStorage.getItem('auth-token')}` },
        });

        if (getUser.status === 200) {
          const getUserJson = await getUser.json();
          localStorage.setItem('highScore', getUserJson.data.highScore);
          // tslint:disable-next-line:no-unused-expression
          new Phaser.Game(gameConfig);
        }
      } else {
        // tslint:disable-next-line:no-unused-expression
        new Phaser.Game(gameConfig);
      }
      removeValuesInLocalStorage();
    })();
  }, []);

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const gameRoomid = urlParams.get('g');

  return (
    <div style={{ padding: 0 }}>
      <Tutorial />
      <h1 style={{ paddingLeft: '25px' }}>Game Page of Room: {gameRoomid}</h1>
      <div id="content" />
    </div>
  );
};
