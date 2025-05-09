import { Game } from '../scenes/Game'
import { EntityBase } from './EntityBase'

export class Core extends EntityBase {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'ui_heart_full.png')

    this.setSize(10, 4)
      .setOffset(1.5, 6)
      .setScale(4)
      .setImmovable(true)
      .setData('health', 100)
  }

  public takeDamage(amount: number): void {
    super.takeDamage(amount)
    this.sceneRef.hud.coreHealthText?.setText(
      `Core Health: ${this.getHealth()}`,
    )
  }

  public destroy(fromScene?: boolean): void {
    this.sceneRef.triggerGameOver()
    super.destroy(fromScene)
  }
}
