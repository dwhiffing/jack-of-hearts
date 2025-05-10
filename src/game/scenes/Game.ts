import { Scene, Cameras, Physics } from 'phaser'
import { Player } from '../entities/Player'
import { Core } from '../entities/Core'
import { Enemy } from '../entities/Enemy'
import { Hud } from '../entities/Hud'
import { CAMERA_FADE, CoreStats, PRIMARY_CORE } from '../constants'
import { EnemySpawner } from '../entities/EnemySpawner'
import { Emitter } from '../entities/Emitter'
import { CoreSpawner } from '../entities/CoreSpawner'

export class Game extends Scene {
  public player!: Player
  public hud!: Hud
  public enemySpawner!: EnemySpawner
  public coreSpawner!: CoreSpawner
  public emitter!: Emitter
  public cores!: Physics.Arcade.Group
  public enemies!: Physics.Arcade.Group
  public camera!: Cameras.Scene2D.Camera
  public isGameOver: boolean
  public waveIndex: number
  public levelIndex: number
  public inShop: boolean

  constructor() {
    super('Game')
  }

  create(): void {
    this.camera = this.cameras.main
    const { width: w, height: h } = this.camera

    this.isGameOver = false
    this.player = new Player(this, w / 2, h / 2 + 120)

    this.cores = this.physics.add.group({
      classType: Core,
      runChildUpdate: false,
    })
    this.coreSpawner = new CoreSpawner(this)
    this.coreSpawner.spawn(PRIMARY_CORE, w / 2, h / 2, true)

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: false,
    })
    this.enemySpawner = new EnemySpawner(this)
    this.enemySpawner.nextWave()

    this.waveIndex = 0
    this.inShop = false
    this.levelIndex = 0
    this.hud = new Hud(this)
    this.emitter = new Emitter(this)

    this.physics.add.collider(this.enemies, this.enemies)
    this.cameras.main.fadeFrom(CAMERA_FADE, 0, 0, 0)
    this.game.events.on('start-level', this.enemySpawner.nextLevel)
    this.game.events.on('spawn-core', (stats: CoreStats) =>
      this.coreSpawner.spawn(stats),
    )
  }

  update(_time: number, _delta: number): void {
    const enemies = this.enemies.getChildren() as Enemy[]
    enemies.forEach((enemy) => enemy.update())
    this.enemySpawner.update()

    const cores = this.cores.getChildren() as Core[]
    cores.forEach((core) => core.update())
    this.coreSpawner.update()

    this.player.update(enemies)
  }

  triggerGameOver(): void {
    this.isGameOver = true
    this.cameras.main.fade(CAMERA_FADE, 0, 0, 0, true, (_: any, p: number) => {
      if (p === 1) this.scene.start('Menu')
    })
  }
}
