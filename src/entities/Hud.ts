import { GameObjects } from 'phaser'
import { Game } from '../scenes/Game'

export class Hud {
  protected sceneRef: Game
  coreHealthText!: GameObjects.Text

  constructor(scene: Game) {
    this.sceneRef = scene
    this.coreHealthText = this.sceneRef.add.text(
      15,
      15,
      `Core: ${this.sceneRef.core.getHealth()}`,
      { fontSize: 18, stroke: '#000000', strokeThickness: 4 },
    )
  }
}
