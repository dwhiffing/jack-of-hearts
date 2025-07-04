import { Enemy } from './Enemy'
import { EnemyTypeEnum, ILevel } from '../types'
import { Game } from '../scenes/Game'
import { generateLevel } from '../constants'

export class EnemySpawner {
  protected sceneRef: Game
  public waveIndex: number
  public levelIndex: number
  public levelEnded: boolean
  public allEnemiesSpawned: boolean
  level: ILevel

  constructor(sceneRef: Game) {
    this.sceneRef = sceneRef
    this.waveIndex = 0
    this.levelIndex = 0
    // @ts-ignore
    window.levelIndex = this.levelIndex
    this.levelEnded = false
    this.allEnemiesSpawned = false
  }

  getAllEnemiesDead = () =>
    this.allEnemiesSpawned &&
    this.waveIndex >= this.level.waves.length &&
    this.sceneRef.enemies
      .getChildren()
      .every((e) => e.getData('health') <= 0) &&
    !this.sceneRef.isGameOver

  nextLevel = (): void => {
    this.levelEnded = false
    this.sceneRef.player.setVelocity(0)
    this.levelIndex++
    // @ts-ignore
    window.levelIndex = this.levelIndex
    this.waveIndex = 0
    this.nextWave()
  }

  nextWave = async () => {
    this.level = generateLevel(
      this.levelIndex,
      this.sceneRef.effects.enemyCount,
    )
    const wave = this.level?.waves[this.waveIndex++]
    if (this.level && wave) {
      this.allEnemiesSpawned = false
      this.sceneRef.playSound('enemy-spawn', { volume: 0.7, rate: 0.7 })
      wave.enemies.forEach((type, i) => {
        this.sceneRef.time.delayedCall(wave.spawnRate * i, () => {
          this.spawnEnemy(type)
          if (i === wave.enemies.length - 1) this.allEnemiesSpawned = true
        })
      })

      this.sceneRef.time.delayedCall(this.level.waveRate, this.nextWave)
    }
  }

  spawnEnemy = (enemyKey: EnemyTypeEnum): void => {
    const enemy = this.sceneRef.enemies.get() as Enemy | null
    enemy?.spawn(enemyKey)
  }

  update(): void {
    if (!this.levelEnded && this.getAllEnemiesDead()) {
      this.levelEnded = true
      this.sceneRef.time.delayedCall(750, () => {
        this.sceneRef.playSound('level-complete', { volume: 0.7 })
        this.sceneRef.game.events.emit('show-modal')
      })
    }
  }
}
