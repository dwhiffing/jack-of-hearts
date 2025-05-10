import { Scene } from 'phaser'
import { ANIMS } from '../constants'
import { createAnims } from '../utils'

export class Boot extends Scene {
  constructor() {
    super('Boot')
  }

  init() {
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff)
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff)
    this.load.on('progress', (progress: number) => {
      bar.width = 4 + 460 * progress
    })
  }

  preload() {
    this.load.setPath('assets')
    this.load.multiatlas('sheet', 'sheet.json')
  }

  create() {
    createAnims(this.anims, ANIMS)
    // this.scene.start('Game')
    this.scene.start('Menu')
  }
}
