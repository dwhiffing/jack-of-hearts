import { Scene, Cameras, Physics } from 'phaser'
import { Player } from '../entities/Player'
import { Core } from '../entities/Core'
import { Enemy } from '../entities/Enemy'
import { Hud } from '../entities/Hud'
import { CAMERA_FADE, PRIMARY_CORE, effects } from '../constants'
import { CoreStats, Effects } from '../types'
import { EnemySpawner } from '../entities/EnemySpawner'
import { Emitter } from '../entities/Emitter'
import { CoreSpawner } from '../entities/CoreSpawner'
import { getEffectValue } from '../utils'
import { Floor } from '../entities/Floor'

export class Game extends Scene {
  public player!: Player
  public hud!: Hud
  public enemySpawner!: EnemySpawner
  public coreSpawner!: CoreSpawner
  public emitter!: Emitter
  public floor!: Floor
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
    this.floor = new Floor(this)
    this.player = new Player(this, w / 2, h / 2 + 120)

    this.cores = this.physics.add.group({
      classType: Core,
      runChildUpdate: false,
    })
    this.coreSpawner = new CoreSpawner(this)
    this.coreSpawner.spawn(PRIMARY_CORE, w / 2, h / 2, true)
    this.updateEffects()

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

    this.physics.add.overlap(
      this.player,
      this.enemies,
      // @ts-ignore
      this.playerEnemyCollide,
    )
    this.physics.add.collider(this.enemies, this.enemies)
    this.cameras.main.fadeFrom(CAMERA_FADE, 0, 0, 0)
    this.game.events.on('start-level', this.enemySpawner.nextLevel)
    this.game.events.on('spawn-core', (stats: CoreStats) => {
      this.coreSpawner.spawn(stats)
      this.updateEffects()
    })

    this.input.keyboard!.on('keydown-M', () => {
      this.game.sound.setMute(!this.game.sound.mute)
    })
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

  playerEnemyCollide = (player: Player, enemy: Enemy) =>
    player.takeDamage(enemy, true)

  triggerGameOver(): void {
    this.isGameOver = true
    this.cameras.main.fade(CAMERA_FADE, 0, 0, 0, true, (_: any, p: number) => {
      if (p === 1) this.scene.start('Menu')
    })
  }

  get effects() {
    return this.data.get('effects') as Effects
  }

  setEffect = (key: keyof Effects, value: number) => {
    this.data.set('effects', { ...this.effects, [key]: value })
  }

  updateEffects = () => {
    this.data.set('effects', { ...effects })
    const cores = this.cores.getChildren() as Core[]

    cores.forEach((core) => {
      if (
        core.stats.left.effect === 'primary' ||
        core.stats.right.effect === 'primary'
      )
        return
      const currentValueLeft = this.effects[core.stats.left.effect]
      const currentValueRight = this.effects[core.stats.right.effect]
      this.setEffect(
        core.stats.left.effect,
        currentValueLeft + getEffectValue(core.stats.left, 'good'),
      )
      this.setEffect(
        core.stats.right.effect,
        currentValueRight + getEffectValue(core.stats.right, 'bad'),
      )
    })
  }

  playSound = (key: string, extra?: Phaser.Types.Sound.SoundConfig) => {
    if (document.hasFocus()) this.sound.play(key, extra)
  }
}
