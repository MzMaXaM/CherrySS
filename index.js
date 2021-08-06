import WelcomeScreen from "./comp/WelcomeScreen.js"
import GamePlayScreen from "./comp/GamePlayScreen.js"
import GameOver from "./comp/GameOverScreen.js"
import EventCenter from "./comp/EventCentre.js"
import UiScene from "./comp/UiScene.js"

var config = {
  type: Phaser.AUTO,
  width: 1000,
  height: 500,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 400 },
          debug: true
      }
  },
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [ GamePlayScreen, WelcomeScreen, UiScene, GameOver, EventCenter ]
}

var game = new Phaser.Game(config)