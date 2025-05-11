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
    this.load.image('title', 'title.png')
  }

  create() {
    createAnims(this.anims, ANIMS)
    // this.scene.start('Game')
    this.scene.start('Menu')
  }
}
