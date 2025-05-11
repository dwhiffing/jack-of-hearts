import { Scene, GameObjects } from 'phaser'
import { CAMERA_FADE } from '../constants'
import { Floor } from '../entities/Floor'

export class Menu extends Scene {
  background: GameObjects.Image
  logo: GameObjects.Image
  title: GameObjects.Text

  constructor() {
    super('Menu')
  }

  create() {
    const { width, height } = this.cameras.main
    new Floor(this)
    this.title = this.add
      .text(width / 2, height * 0.75, 'Press Z to Start', {
        fontSize: 24,
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)

    this.add.image(width / 2, height / 2.5, 'title').setScale(2)

    this.cameras.main.fadeFrom(CAMERA_FADE, 0, 0, 0)
    this.input.keyboard!.once('keydown-Z', () => {
      this.cameras.main.fade(
        CAMERA_FADE,
        0,
        0,
        0,
        true,
        (_: any, p: number) => {
          if (p === 1) this.scene.start('Game')
        },
      )
    })
  }
}
