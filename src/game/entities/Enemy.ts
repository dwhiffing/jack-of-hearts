import { ENEMY_TYPES, ENEMY_STATS } from '../constants/enemies'
import { EnemyTypeEnum } from '../types'
import { Game } from '../scenes/Game'
import { Core } from './Core'
import { EntityBase } from './EntityBase'
import { Player } from './Player'

export class Enemy extends EntityBase {
  type: EnemyTypeEnum = 'skele'
  isAttacking = false
  isDying = false
  moveMulti: number

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y)
    this.setScale(3).setCollideWorldBounds(false)
  }

  public spawn(
    type: EnemyTypeEnum = Phaser.Math.RND.pick(
      Object.keys(ENEMY_TYPES),
    ) as EnemyTypeEnum,
  ) {
    const { width, height } = this.sceneRef.camera
    const { x, y } = getEnemySpawn(width, height)
    this.setPosition(x, y).setActive(true).setVisible(true)

    this.type = type
    const { offsetX, offsetY, sizeX, sizeY } = this.spriteType
    this.moveMulti = 1
    this.isDying = false
    this.alpha = 1
    this.setMaxHealth(
      Math.round(this.stats.health * this.sceneRef.effects.enemyHealthMulti),
    )
    this.play(`${type}-walk`).setSize(sizeX, sizeY).setOffset(offsetX, offsetY)
    this.body.setEnable(true)
  }

  public update(): void {
    if (
      !this.active ||
      !this.body ||
      !this.sceneRef.physics ||
      !this.target ||
      this.isDying
    )
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
    const { launchSpeed, attackDist, attackDelay, isExplode } =
      this.stats.attackType

    if (this.isAttacking) return

    this.isAttacking = true
    this.body.setVelocity(0, 0)
    this.setPushable(false)
    this.play(`${this.type}-idle`)

    // when complete, check if still alive, apply damage and reset
    this.sceneRef.time.delayedCall(attackDelay, () => {
      const dist = Phaser.Math.Distance.BetweenPoints(this, target)
      if (!this.body || !target.body) return

      this.isAttacking = false
      this.setPushable(true)

      if (this.getHealth() <= 0 || dist > attackDist) return

      this.sceneRef.physics.moveToObject(target, this, -launchSpeed)
      target.takeDamage(this)
      if (isExplode) this.takeDamage(9999)
    })
  }

  public moveTowards(target: Core | Player): void {
    const speed =
      this.stats.speed * this.moveMulti * this.sceneRef.effects.enemySpeedMulti
    this.sceneRef.physics.moveToObject(this, target, speed)
    if (speed > 0) {
      this.play(`${this.type}-walk`, true)
      this.setFlipX(this.body.velocity.x < 0)

      const { offsetX, offsetY } = this.spriteType

      this.setOffset(offsetX + (this.body.velocity.x < 0 ? -2 : 0), offsetY)
      this.setDepth(this.body.position.y)
    }
  }

  public takeDamage(amount: number | Enemy): void {
    if (this.isDying || typeof amount !== 'number') return

    super.takeDamage(amount)
    if (!this.active) return

    if (this.getHealth() > 0)
      this.sceneRef.playSound('enemy-hit', { volume: 2 })

    this.moveMulti = 0
    this.sceneRef.time.delayedCall(
      350 * this.sceneRef.effects.playerAttackStunDurationMulti,
      () => (this.moveMulti = 1),
    )
    this.play(`${this.type}-stop`)
  }

  public destroy(fromScene?: boolean): void {
    if (this.isDying) return

    this.sceneRef.playSound('enemy-destroyed', { volume: 0.6 })
    this.isDying = true
    this.setVelocity(0)
    if (!this.sceneRef.isGameOver) this.sceneRef.emitter.explode(this.x, this.y)
    this.sceneRef.tweens.add({
      targets: [this],
      alpha: 0,
      duration: 500,
      onComplete: () => super.destroy(fromScene),
    })
  }

  get target() {
    return this.sceneRef.player.carriedCore
      ? this.sceneRef.player
      : this.closestCore
  }

  get closestCore() {
    const cores = this.sceneRef.cores.getChildren() as Core[]
    return cores.sort((a, b) => {
      const aDist = Phaser.Math.Distance.BetweenPoints(this, a)
      const bDist = Phaser.Math.Distance.BetweenPoints(this, b)
      return aDist - bDist
    })[0]
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
