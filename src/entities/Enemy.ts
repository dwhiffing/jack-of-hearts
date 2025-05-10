import { ENEMY_TYPES, EnemyTypeEnum } from '../constants'
import { Game } from '../scenes/Game'
import { EntityBase } from './EntityBase'

const SPEED = 70
export class Enemy extends EntityBase {
  moveSpeed = SPEED
  type: EnemyTypeEnum = 'skele'
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 2)
    this.setSize(8, 12).setScale(3).setCollideWorldBounds(false)
  }

  public spawn(
    type: EnemyTypeEnum = Phaser.Math.RND.pick(
      Object.keys(ENEMY_TYPES),
    ) as EnemyTypeEnum,
  ) {
    const { x, y } = getEnemySpawn(
      this.sceneRef.camera.width,
      this.sceneRef.camera.height,
    )
    this.setPosition(x, y).setActive(true).setVisible(true)

    const { offsetX, offsetY } = ENEMY_TYPES[type]
    this.type = type
    this.play(`${type}-walk`).setOffset(offsetX, offsetY)
    this.body.setEnable(true)
  }

  public destroy(fromScene?: boolean): void {
    if (!this.sceneRef.isEnding)
      this.sceneRef.emitter.explode(10, this.x, this.y)
    super.destroy(fromScene)
  }

  public takeDamage(amount: number): void {
    super.takeDamage(amount)
    if (!this.active) return
    this.moveSpeed = 0
    this.play(`${this.type}-stop`)
    this.sceneRef.time.delayedCall(1000, () => {
      this.moveSpeed = SPEED
    })
  }

  public moveTowards(target: { x: number; y: number }): void {
    if (this.active && this.body && this.sceneRef.physics && target) {
      this.sceneRef.physics.moveToObject(this, target, this.moveSpeed)
      if (this.moveSpeed > 0) {
        this.play(`${this.type}-walk`, true)
        const { offsetHealth, offsetShadow } = ENEMY_TYPES[this.type]
        this.healthBar.setPosition(this.x - 20, this.y + offsetHealth)
        this.shadow.setPosition(this.x, this.y + offsetShadow)
        this.setFlipX(this.body.velocity.x < 0)
        this.setDepth(this.body.position.y)
      }
    }
  }
}

const getEnemySpawn = (w = 0, h = 0) => {
  const edge = Phaser.Math.Between(0, 3)
  let x: number, y: number
  const offset = 24

  switch (edge) {
    case 0:
      x = Phaser.Math.Between(0, w)
      y = -offset
      break
    case 1:
      x = Phaser.Math.Between(0, w)
      y = h + offset
      break
    case 2:
      x = -offset
      y = Phaser.Math.Between(0, h)
      break
    case 3:
      x = w + offset
      y = Phaser.Math.Between(0, h)
      break
    default:
      x = 0
      y = 0
      break
  }
  return { x, y }
}
