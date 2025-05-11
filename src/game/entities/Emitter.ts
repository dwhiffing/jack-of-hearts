import { Game } from '../scenes/Game'

export class Emitter {
  protected sceneRef!: Game
  public emitter!: Phaser.GameObjects.Particles.ParticleEmitter

  constructor(sceneRef: Game) {
    this.sceneRef = sceneRef
    this.emitter = this.sceneRef.add
      .particles(0, 0, 'sheet', {
        x: 0,
        y: 0,
        lifespan: { min: 400, max: 500 },
        speed: 120,
        frame: 'particle.png',
        alpha: { start: 1, end: 0 },
        scale: 2,
        tint: 0x00ff00,
        angle: { start: 0, end: 360, steps: 10 },
      })
      .stop()
  }

  explode(x: number, y: number) {
    this.emitter.explode(10, x, y)
  }
}
