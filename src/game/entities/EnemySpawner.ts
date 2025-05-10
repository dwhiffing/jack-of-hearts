import { Enemy } from './Enemy'
import { EnemyTypeEnum, LEVELS } from '../constants'
import { Game } from '../scenes/Game'

export class EnemySpawner {
  protected sceneRef: Game
  public waveIndex: number
  public levelIndex: number
  public levelEnded: boolean

  constructor(sceneRef: Game) {
    this.sceneRef = sceneRef
    this.waveIndex = 0
    this.levelIndex = 0
    this.levelEnded = false
  }

  getAllEnemiesDead = () =>
    this.sceneRef.enemies.getChildren().every((e) => e.getData('health') <= 0)

  nextLevel = (): void => {
    this.levelEnded = false
    this.levelIndex++
    this.waveIndex = 0
    this.nextWave()
  }

  nextWave = (): void => {
    const level = LEVELS[this.levelIndex]
    const wave = level?.waves[this.waveIndex++]
    if (level && wave) {
      wave.enemies.forEach(this.spawnEnemy)
      this.sceneRef.time.delayedCall(5000, this.nextWave)
    }
  }

  spawnEnemy = (enemyKey: EnemyTypeEnum): void => {
    const enemy = this.sceneRef.enemies.get() as Enemy | null
    enemy?.spawn(enemyKey)
  }

  update(): void {
    if (!this.levelEnded && this.getAllEnemiesDead()) {
      this.levelEnded = true
      this.sceneRef.game.events.emit('show-modal')
    }
  }
}
