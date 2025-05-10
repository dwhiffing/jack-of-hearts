import { Physics } from 'phaser'
import { Game } from '../scenes/Game'
import { HealthBar } from './HealthBar'
import { Shadow } from './Shadow'

export class EntityBase extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  declare body: Physics.Arcade.Body
  public healthBar: HealthBar
  public shadow: Shadow
  public maxHealth: number

  constructor(
    scene: Game,
    x: number,
    y: number,
    maxHealth: number,
    frame?: string,
  ) {
    super(scene, x, y, 'sheet', frame)
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.setData('health', maxHealth)
    this.maxHealth = maxHealth

    this.healthBar = new HealthBar(this.sceneRef, x, y, 40, 100, 6)
    this.shadow = new Shadow(this.sceneRef, x, y, 40, 4)
    this.healthBar.setPosition(x, y)
    this.shadow.setPosition(x, y)
    this.setDepth(this.body!.position.y)
  }

  public getHealth(): number {
    return this.getData('health') as number
  }

  public setHealth(amount: number): void {
    this.setData('health', amount)
    if (amount > 0) {
      this.healthBar.setAlpha(1)
      this.shadow.setAlpha(1)
    }
  }

  public takeDamage(amount: number): void {
    this.setHealth(this.getHealth() - amount)
    this.setTint(0xff6666)
    this.sceneRef.time.delayedCall(250, () => this.active && this.clearTint())
    this.healthBar.setValue((this.getHealth() / this.maxHealth) * 100)

    if (this.getHealth() <= 0) {
      this.healthBar.setAlpha(0)
      this.shadow.setAlpha(0)
      this.destroy()
    }
  }
}
