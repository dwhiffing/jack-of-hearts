import { Physics } from 'phaser'
import { Game } from '../scenes/Game'

export class EntityBase extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  declare body: Physics.Arcade.Body

  constructor(scene: Game, x: number, y: number, frame?: string) {
    super(scene, x, y, 'sheet', frame)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setDepth(this.body!.position.y)
  }

  public getHealth(): number {
    return this.getData('health') as number
  }

  public setHealth(amount: number): void {
    this.setData('health', amount)
  }

  public takeDamage(amount: number): void {
    this.setHealth(this.getHealth() - amount)
    this.setTint(0xff6666)
    this.sceneRef.time.delayedCall(250, () => this.active && this.clearTint())

    if (this.getHealth() <= 0) {
      this.destroy()
    }
  }
}
