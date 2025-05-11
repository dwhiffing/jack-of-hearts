import { Enemy } from './Enemy'
import { LEVELS } from '../constants'
import { EnemyTypeEnum } from '../types'
import { Game } from '../scenes/Game'

export class EnemySpawner {
  protected sceneRef: Game
  public waveIndex: number
  public levelIndex: number
  public levelEnded: boolean
  public allEnemiesSpawned: boolean

  constructor(sceneRef: Game) {
    this.sceneRef = sceneRef
    this.waveIndex = 0
    this.levelIndex = 0
    this.levelEnded = false
    this.allEnemiesSpawned = false
  }

  getAllEnemiesDead = () =>
    this.allEnemiesSpawned &&
    this.sceneRef.enemies.getChildren().every((e) => e.getData('health') <= 0)

  hasHasNextLevel = () => this.levelIndex < LEVELS.length - 1

  nextLevel = (): void => {
    this.levelEnded = false
    this.levelIndex++
    this.waveIndex = 0
    this.nextWave()
  }

  nextWave = async () => {
    const level = LEVELS[this.levelIndex]
    const wave = level?.waves[this.waveIndex++]
    if (level && wave) {
      this.allEnemiesSpawned = false
      wave.enemies.forEach((type, i) => {
        this.sceneRef.time.delayedCall(wave.spawnRate * i, () => {
          this.spawnEnemy(type)
          if (i === wave.enemies.length - 1) this.allEnemiesSpawned = true
        })
      })

      this.sceneRef.time.delayedCall(5000, this.nextWave)
    }
  }

  spawnEnemy = (enemyKey: EnemyTypeEnum): void => {
    const enemy = this.sceneRef.enemies.get() as Enemy | null
    enemy?.spawn(enemyKey)
  }

  update(): void {
    if (
      !this.levelEnded &&
      this.getAllEnemiesDead() &&
      this.hasHasNextLevel()
    ) {
      this.levelEnded = true
      this.sceneRef.time.delayedCall(750, () => {
        this.sceneRef.game.events.emit('show-modal')
      })
    }
  }
}
