import { Scene, Cameras, Physics } from 'phaser'
import { Player } from '../entities/Player'
import { Core } from '../entities/Core'
import { Enemy } from '../entities/Enemy'
import { Hud } from '../entities/Hud'
import { CAMERA_FADE, LEVELS } from '../constants'

export class Game extends Scene {
  public player!: Player
  public core!: Core
  public enemies!: Physics.Arcade.Group
  public camera!: Cameras.Scene2D.Camera
  public hud!: Hud
  public emitter!: Phaser.GameObjects.Particles.ParticleEmitter
  public isEnding: boolean
  public waveIndex: number
  public levelIndex: number

  constructor() {
    super('Game')
  }

  create(): void {
    this.camera = this.cameras.main
    const { width: w, height: h } = this.camera

    this.isEnding = false
    this.core = new Core(this, w / 2, h / 2)
    this.player = new Player(this, w / 2, h / 2 + 120)
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: false,
    })

    this.waveIndex = 0
    this.levelIndex = 0
    this.hud = new Hud(this)

    this.emitter = this.add
      .particles(0, 0, 'sheet', {
        x: w / 2,
        y: h / 2,
        lifespan: 400,
        speed: 120,
        frame: 'ui_heart_full.png',
        alpha: { start: 1, end: 0 },
        angle: { start: 0, end: 360, steps: 10 },
      })
      .stop()

    this.physics.add.collider(this.enemies, this.enemies)
    this.spawnWave()
    this.cameras.main.fadeFrom(CAMERA_FADE, 0, 0, 0)
  }

  update(_time: number, _delta: number): void {
    const enemies = this.enemies.getChildren() as Enemy[]
    this.player.update(enemies)
    enemies.forEach((enemy) =>
      enemy.update(this.player.carriedCore ? this.player : this.core),
    )
    this.core.update()
    if (this.enemies.getChildren().every((e) => e.getData('health') <= 0)) {
      this.levelIndex++
      this.waveIndex = 0
      this.time.delayedCall(2000, this.spawnWave)
    }
  }

  spawnWave = (): void => {
    const level = LEVELS[this.levelIndex]
    if (this.waveIndex < level.waves.length) {
      const wave = level.waves[this.waveIndex++]
      wave.enemies.forEach((enemyKey) => {
        const enemy = this.enemies.get() as Enemy | null
        enemy?.spawn(enemyKey)
      })
      this.time.delayedCall(5000, this.spawnWave)
    }
  }

  triggerGameOver(): void {
    this.isEnding = true
    this.cameras.main.fade(CAMERA_FADE, 0, 0, 0, true, (_: any, p: number) => {
      if (p === 1) this.scene.start('Menu')
    })
  }
}
