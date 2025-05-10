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
  physics: { default: 'arcade', arcade: { debug: false } },
  pixelArt: true,
  scene: [Boot, Menu, MainGame],
}

document.addEventListener('DOMContentLoaded', () => {
  new Game({ ...config, parent: 'game-container' })
})
