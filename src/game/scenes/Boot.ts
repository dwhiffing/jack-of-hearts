import { Scene } from 'phaser'
import { ANIMS } from '../constants/anims'
import { createAnims } from '../utils'

export class Boot extends Scene {
  constructor() {
    super('Boot')
  }

  init() {
    this.add
      .rectangle(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        468,
        32,
      )
      .setStrokeStyle(1, 0xffffff)
    const bar = this.add.rectangle(
      this.cameras.main.width / 2 - 230,
      this.cameras.main.height / 2,
      4,
      28,
      0xffffff,
    )
    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    this.load.setPath('assets')
    this.load.multiatlas('sheet', 'sheet.json')
    this.load.spritesheet('tiles', 'tiles.png', {
      frameWidth: 16,
      frameHeight: 16,
    })
    this.load.image('title', 'title.png')
    this.load.setPath('assets/audio')
    this.load.audio('click-disabled', 'click-disabled.mp3')
    this.load.audio('click', 'click.mp3')
    this.load.audio('core-destroyed', 'core-destroyed.mp3')
    this.load.audio('core-hit', 'core-hit.mp3')
    this.load.audio('dodge', 'dodge.mp3')
    this.load.audio('drop-item', 'drop-item.mp3')
    this.load.audio('enemy-destroyed', 'enemy-destroyed.mp3')
    this.load.audio('enemy-hit', 'enemy-hit.mp3')
    this.load.audio('enemy-spawn', 'enemy-spawn.mp3')
    this.load.audio('game-over', 'game-over.mp3')
    this.load.audio('level-complete', 'level-complete.mp3')
    this.load.audio('pickup-item', 'pickup-item.mp3')
    this.load.audio('player-attack', 'player-attack.mp3')
    this.load.audio('player-hit', 'player-hit.mp3')
    this.load.audio('music', 'music.mp3')
  }

  create() {
    createAnims(this.anims, ANIMS)
    // this.scene.start('Game')
    this.sound.play('music', { loop: true, volume: 0.5 })
    this.scene.start('Menu')
  }
}
