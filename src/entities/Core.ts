import { Game } from '../scenes/Game'
import { EntityBase } from './EntityBase'

export class Core extends EntityBase {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 100, 'ui_heart_full.png')

    this.setSize(10, 4).setOffset(1.5, 6).setScale(4).setImmovable(true)
    this.setDamping(true).setCollideWorldBounds(true).setDrag(0.05, 0.05)
    this.setPosition(x, y)
  }

  public setPosition(x: number, y: number) {
    super.setPosition(x, y)
    this.healthBar?.setPosition(x - 20, y - 35)
    this.shadow?.setPosition(x, y + 29)
    this.setDepth(this.body?.position.y)
    return this
  }

  public update() {
    super.update()
    this.setPosition(this.x, this.y)
  }

  public destroy(fromScene?: boolean): void {
    this.sceneRef.triggerGameOver()
    super.destroy(fromScene)
  }
}
