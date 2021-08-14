// import Phaser from 'phaser'

import WelcomeScreen from "./comp/WelcomeScreen.js"
import GamePlayScreen from "./comp/GamePlayScreen.js"
import GameOver from "./comp/GameOverScreen.js"
import UiScene from "./comp/UiScene.js"

var config = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  physics: {
      default: 'matter',
      matter: {
        gravity: { y: .3, x:0 },
        debug: true
      }
  },
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [ WelcomeScreen, GamePlayScreen, UiScene, GameOver ]
}

var game = new Phaser.Game(config)
