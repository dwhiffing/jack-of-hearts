import { Scene, GameObjects } from 'phaser'

export class Menu extends Scene {
  background: GameObjects.Image
  logo: GameObjects.Image
  title: GameObjects.Text

  constructor() {
    super('Menu')
  }

  create() {
    const { width, height } = this.cameras.main
    this.title = this.add
      .text(width / 2, height / 2, 'Click to start', {
        fontSize: 24,
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)

    this.input.once('pointerdown', () => {
      this.scene.start('Game')
    })
  }
}
