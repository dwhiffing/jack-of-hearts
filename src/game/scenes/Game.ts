import { Scene, Cameras, Physics } from 'phaser'
import { Player } from '../entities/Player'
import { Core } from '../entities/Core'
import { Enemy } from '../entities/Enemy'
import { Hud } from '../entities/Hud'
import { CAMERA_FADE } from '../constants'
import { EnemySpawner } from '../entities/EnemySpawner'
import { Emitter } from '../entities/Emitter'

export class Game extends Scene {
  public player!: Player
  public core!: Core
  public hud!: Hud
  public spawner!: EnemySpawner
  public emitter!: Emitter
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
    this.core = new Core(this, w / 2, h / 2)
    this.player = new Player(this, w / 2, h / 2 + 120)
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: false,
    })

    this.waveIndex = 0
    this.inShop = false
    this.levelIndex = 0
    this.hud = new Hud(this)
    this.spawner = new EnemySpawner(this)
    this.spawner.nextWave()
    this.emitter = new Emitter(this)

    this.physics.add.collider(this.enemies, this.enemies)
    this.cameras.main.fadeFrom(CAMERA_FADE, 0, 0, 0)
    this.game.events.on('start-level', this.spawner.nextLevel)
  }

  update(_time: number, _delta: number): void {
    const enemies = this.enemies.getChildren() as Enemy[]
    enemies.forEach((enemy) => enemy.update())

    this.player.update(enemies)
    this.core.update()
    this.spawner.update()
  }

  triggerGameOver(): void {
    this.isGameOver = true
    this.cameras.main.fade(CAMERA_FADE, 0, 0, 0, true, (_: any, p: number) => {
      if (p === 1) this.scene.start('Menu')
    })
  }
}
