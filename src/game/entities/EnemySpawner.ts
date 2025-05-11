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
    this.levelEnded = false
    this.allEnemiesSpawned = false
  }

  getAllEnemiesDead = () =>
    this.allEnemiesSpawned &&
    this.waveIndex >= this.level.waves.length &&
    this.sceneRef.enemies.getChildren().every((e) => e.getData('health') <= 0)

  nextLevel = (): void => {
    this.levelEnded = false
    this.levelIndex++
    this.waveIndex = 0
    this.nextWave()
  }

  nextWave = async () => {
    this.level = generateLevel(this.levelIndex)
    const wave = this.level?.waves[this.waveIndex++]
    if (this.level && wave) {
      this.allEnemiesSpawned = false
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
        this.sceneRef.game.events.emit('show-modal')
      })
    }
  }
}
