import { CoreStats } from '../constants'
import { Game } from '../scenes/Game'
import { Core } from './Core'

export class CoreSpawner {
  protected sceneRef: Game

  constructor(sceneRef: Game) {
    this.sceneRef = sceneRef
  }

  spawn = (
    stats: CoreStats,
    _x?: number,
    _y?: number,
    isPrimary = false,
  ): void => {
    const { width: w, height: h } = this.sceneRef.cameras.main
    const core = this.sceneRef.cores.get() as Core | null
    const x = _x ?? Phaser.Math.RND.between(30, w - 30)
    const y = _y ?? Phaser.Math.RND.between(30, h - 30)
    core?.spawn(x, y, isPrimary, stats)
  }

  update(): void {}
}
