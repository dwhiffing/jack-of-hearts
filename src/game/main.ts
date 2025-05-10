import { Boot } from './scenes/Boot'
import { Game as MainGame } from './scenes/Game'
import { Menu } from './scenes/Menu'
import { AUTO, Game } from 'phaser'

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#028af8',
  physics: { default: 'arcade', arcade: { debug: false, overlapBias: 10 } },
  pixelArt: true,
  scene: [Boot, Menu, MainGame],
}

const StartGame = (parent: string) => {
  return new Phaser.Game({ ...config, parent })
}

export default StartGame
