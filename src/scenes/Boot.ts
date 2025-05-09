import { Scene } from 'phaser'

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
    this.load.image('logo', 'logo.png')
    this.load.image('background', 'bg.png')
    this.load.multiatlas('sheet', 'sheet.json')
  }

  create() {
    const frameNames = this.anims.generateFrameNames('sheet', {
      start: 0,
      end: 3,
      prefix: 'knight_m_run_anim_f',
      suffix: '.png',
    })
    this.anims.create({
      key: 'player',
      frames: frameNames,
      frameRate: 10,
      repeat: -1,
    })
    this.scene.start('Menu')
  }
}
