import { ENEMY_TYPES, ENEMY_STATS, EnemyTypeEnum } from '../constants'
import { Game } from '../scenes/Game'
import { Core } from './Core'
import { EntityBase } from './EntityBase'
import { Player } from './Player'

const SPEED = 70
export class Enemy extends EntityBase {
  moveSpeed = SPEED
  type: EnemyTypeEnum = 'skele'
  canAttack = true
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 2)
    this.setSize(8, 8).setScale(3).setCollideWorldBounds(false)
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

  public update(target: Core | Player): void {
    if (!this.active || !this.body || !this.sceneRef.physics || !target) return

    const dist = Phaser.Math.Distance.BetweenPoints(this, target)
    if (dist < ENEMY_STATS[this.type].attackType.attackDist) {
      this.attack(target)
    } else if (this.canAttack) {
      this.moveTowards(target)
    }
  }

  public attack(target: Core | Player) {
    const { launchSpeed, attackDist, attackDelay, isExplode, damage } =
      ENEMY_STATS[this.type].attackType

    this.body.setVelocity(0, 0)

    if (this.canAttack) {
      this.canAttack = false
      this.body.setImmovable(true)
      this.play(`${this.type}-idle`)

      // when complete, check if still alive, apply damage and reset
      this.sceneRef.time.delayedCall(attackDelay, () => {
        const dist = Phaser.Math.Distance.BetweenPoints(this, target)
        if (!this.body || !target.body) return

        this.canAttack = true
        this.body.setImmovable(false)

        if (this.getHealth() <= 0 || dist > attackDist) return

        this.sceneRef.physics.moveToObject(target, this, -launchSpeed)
        target.takeDamage(damage)
        if (isExplode) this.takeDamage(9999)
      })
    }
  }

  public moveTowards(target: Core | Player): void {
    this.sceneRef.physics.moveToObject(this, target, this.moveSpeed)
    if (this.moveSpeed > 0) {
      this.play(`${this.type}-walk`, true)
      this.setFlipX(this.body.velocity.x < 0)
      this.setDepth(this.body.position.y)
    }

    const { offsetHealth, offsetShadow } = ENEMY_TYPES[this.type]
    this.healthBar.setPosition(this.x - 20, this.y + offsetHealth)
    this.shadow.setPosition(this.x, this.y + offsetShadow)
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
