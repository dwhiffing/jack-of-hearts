import { Game } from '../scenes/Game'

export class Hud {
  protected sceneRef: Game

  constructor(scene: Game) {
    this.sceneRef = scene
  }
}
