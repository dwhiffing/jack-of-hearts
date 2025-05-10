import { CoreStats } from '../constants'
import { Game } from '../scenes/Game'
import { EntityBase } from './EntityBase'

export class Core extends EntityBase {
  isPrimary: boolean
  leftHalf: Phaser.GameObjects.Sprite
  rightHalf: Phaser.GameObjects.Sprite
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'ui_heart_empty.png')

    this.setSize(10, 4).setOffset(1.5, 6).setScale(4).setPushable(false)
    this.setPosition(x, y)

    this.leftHalf = this.sceneRef.add
      .sprite(x, y, 'sheet', 'ui_heart_half_left.png')
      .setScale(4)
    this.rightHalf = this.sceneRef.add
      .sprite(x, y, 'sheet', 'ui_heart_half_right.png')
      .setScale(4)
  }

  public spawn(x: number, y: number, isPrimary = false, stats: CoreStats) {
    this.isPrimary = isPrimary
    this.setMaxHealth(50)
    this.setDamping(true).setCollideWorldBounds(true).setDrag(0.01, 0.01)
    this.setPosition(x, y)
    this.leftHalf.setTint(stats.left.color)
    this.rightHalf.setTint(stats.right.color)
  }

  public setPosition(x: number, y: number) {
    const isCarried = this.sceneRef?.player.carriedCore === this
    const depth = isCarried ? this.sceneRef.player.y + 1 : this.y
    const _y = isCarried ? this.sceneRef.player.y - 20 : y
    const _x = isCarried ? this.sceneRef.player.x : x

    super.setPosition(_x, _y)
    this.healthBar?.setPosition(x - 20, _y - 35)
    this.shadow?.setPosition(x, _y + 29)
    this.setDepth(depth)
    this.leftHalf?.setPosition(this.x, this.y).setDepth(depth + 1)
    this.rightHalf?.setPosition(this.x, this.y).setDepth(depth + 1)
    return this
  }

  public update() {
    super.update()
    this.setPosition(this.x, this.y)
  }

  public destroy(fromScene?: boolean): void {
    if (this.isPrimary) this.sceneRef.triggerGameOver()
    super.destroy(fromScene)
  }
}
