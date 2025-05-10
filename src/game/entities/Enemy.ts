import { ENEMY_TYPES, ENEMY_STATS, EnemyTypeEnum } from '../constants'
import { Game } from '../scenes/Game'
import { Core } from './Core'
import { EntityBase } from './EntityBase'
import { Player } from './Player'

export class Enemy extends EntityBase {
  type: EnemyTypeEnum = 'skele'
  isAttacking = false
  moveMulti: number

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 2)
    this.setSize(8, 8).setScale(3).setCollideWorldBounds(false)
  }

  public spawn(
    type: EnemyTypeEnum = Phaser.Math.RND.pick(
      Object.keys(ENEMY_TYPES),
    ) as EnemyTypeEnum,
  ) {
    const { width, height } = this.sceneRef.camera
    const { x, y } = getEnemySpawn(width, height)
    this.setPosition(x, y).setActive(true).setVisible(true)

    const { offsetX, offsetY } = this.spriteType
    this.type = type
    this.moveMulti = 1
    this.play(`${type}-walk`).setOffset(offsetX, offsetY)
    this.body.setEnable(true)
  }

  public update(): void {
    if (!this.active || !this.body || !this.sceneRef.physics || !this.target)
      return

    const dist = Phaser.Math.Distance.BetweenPoints(this, this.target)
    if (dist < this.stats.attackType.attackDist) {
      this.attack(this.target)
    } else if (!this.isAttacking) {
      this.moveTowards(this.target)
    }

    const { offsetHealth, offsetShadow } = ENEMY_TYPES[this.type]
    this.healthBar.setPosition(this.x - 20, this.y + offsetHealth)
    this.shadow.setPosition(this.x, this.y + offsetShadow)
  }

  public attack(target: Core | Player) {
    const { launchSpeed, attackDist, attackDelay, isExplode, damage } =
      this.stats.attackType

    if (this.isAttacking) return

    this.isAttacking = true
    this.body.setVelocity(0, 0).setImmovable(true)
    this.play(`${this.type}-idle`)

    // when complete, check if still alive, apply damage and reset
    this.sceneRef.time.delayedCall(attackDelay, () => {
      const dist = Phaser.Math.Distance.BetweenPoints(this, target)
      if (!this.body || !target.body) return

      this.isAttacking = false
      this.body.setImmovable(false)

      if (this.getHealth() <= 0 || dist > attackDist) return

      this.sceneRef.physics.moveToObject(target, this, -launchSpeed)
      target.takeDamage(damage)
      if (isExplode) this.takeDamage(9999)
    })
  }

  public moveTowards(target: Core | Player): void {
    const speed = this.stats.speed * this.moveMulti
    this.sceneRef.physics.moveToObject(this, target, speed)
    if (speed > 0) {
      this.play(`${this.type}-walk`, true)
      this.setFlipX(this.body.velocity.x < 0)
      this.setDepth(this.body.position.y)
    }
  }

  public takeDamage(amount: number): void {
    super.takeDamage(amount)
    if (!this.active) return

    this.moveMulti = 0
    this.sceneRef.time.delayedCall(1000, () => (this.moveMulti = 1))
    this.play(`${this.type}-stop`)
  }

  public destroy(fromScene?: boolean): void {
    if (!this.sceneRef.isGameOver) this.sceneRef.emitter.explode(this.x, this.y)
    super.destroy(fromScene)
  }

  get target() {
    return this.sceneRef.player.carriedCore
      ? this.sceneRef.player
      : this.sceneRef.core
  }

  get spriteType() {
    return ENEMY_TYPES[this.type]
  }

  get stats() {
    return ENEMY_STATS[this.type]
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
