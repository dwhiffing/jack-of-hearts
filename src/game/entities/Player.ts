import { Physics, Math as PhaserMath, Input } from 'phaser'
import { Game } from '../scenes/Game'
import { Enemy } from '../entities/Enemy'
import { Core } from './Core'
import { Shadow } from './Shadow'
import { Slash } from './Slash'
import { playerStats } from '../constants'

export class Player extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  private _lastAngle: PhaserMath.Vector2
  private _canAttack: boolean
  private _canMove: boolean
  public carriedCore?: Core
  public shadow: Shadow
  private slashEffect: Slash
  private moveSpeed: number

  private keyW: Input.Keyboard.Key
  private keyA: Input.Keyboard.Key
  private keyS: Input.Keyboard.Key
  private keyD: Input.Keyboard.Key
  private attackKey: Input.Keyboard.Key
  private dashKey: Input.Keyboard.Key
  private isDashing: boolean = false
  private isStunned: boolean = false
  private canDash: boolean = true

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'sheet')
    this.sceneRef = scene
    this.moveSpeed = this.stats.speed
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.play('player-idle')
      .setSize(8, 8)
      .setOffset(4, 20)
      .setCollideWorldBounds(true)
      .setScale(3)
      .setDamping(true)
      .setDrag(0.1, 0.1)

    this._lastAngle = new PhaserMath.Vector2(1, 0)
    this._canAttack = true
    this._canMove = true
    this.slashEffect = new Slash(this.sceneRef, this.x, this.y, 1)
    this.shadow = new Shadow(this.sceneRef, x, y, 40, 4)

    if (!scene.input || !scene.input.keyboard) {
      throw new Error('Keyboard input system is not available.')
    }
    this.keyW = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.UP)
    this.keyA = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.LEFT)
    this.keyS = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.DOWN)
    this.keyD = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.RIGHT)
    this.attackKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.Z)
    this.dashKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.X)
  }

  public update(enemies: Enemy[]): void {
    this.handlePlayerInput(enemies)
    this.updateAttachedItemsAndDepth()
  }

  public takeDamage(enemy: Enemy, isCollision = false) {
    if (this.isDashing || this.isStunned || enemy.getHealth() === 0) return

    const amount =
      (isCollision
        ? enemy.stats.attackType.damage
        : enemy.stats.collideDamage) * this.sceneRef.effects.enemyDamageMulti

    this.sceneRef.playSound('player-hit')
    if (this.carriedCore) {
      this.carriedCore.takeDamage(amount)
    }
    this.sceneRef.physics.moveToObject(
      this,
      enemy ?? this,
      -(enemy.stats.stunSpeed * (1 / this.sceneRef.effects.playerStunRecovery)),
    )

    this.setAlpha(0.5)
    this.isStunned = true
    this.sceneRef.time.delayedCall(
      enemy.stats.stunDuration * (1 / this.sceneRef.effects.playerStunRecovery),
      () => {
        this.setAlpha(1)
        this.isStunned = false
      },
    )
  }

  private handlePlayerInput(enemies: Enemy[]): void {
    if (!this.body || this.isStunned || this.sceneRef.enemySpawner.levelEnded)
      return

    if (this.isDashing) {
      this.play('player-walk', true)
      return
    }

    if (
      Input.Keyboard.JustDown(this.dashKey) &&
      this.canDash &&
      this._canMove
    ) {
      this.startDash()
      return
    }

    this.handleWASDMovement()
    this.handleAttack(enemies)
  }

  private startDash(): void {
    if (!this.body) return

    this.isDashing = true
    this.canDash = false
    this.sceneRef.playSound('dodge', { volume: 1, rate: 1.5 })

    const dashDirection = this._lastAngle.clone()
    if (dashDirection.lengthSq() === 0) {
      dashDirection.x = this.flipX ? -1 : 1
      dashDirection.y = 0
    }
    dashDirection.normalize()

    const dur = this.stats.dashDuration
    const cooldown =
      this.stats.dashCooldown * this.sceneRef.effects.playerDashCooldownMulti
    const dashSpeed =
      (this.stats.dashDistance / (dur / 1000)) *
      this.sceneRef.effects.playerDashDistMulti
    this.setVelocity(dashDirection.x * dashSpeed, dashDirection.y * dashSpeed)

    if (dashDirection.x !== 0) this.setFlipX(dashDirection.x < 0)
    this.play('player-walk', true)
    this.scene.time.delayedCall(dur, this.stopDash)
    this.scene.time.delayedCall(cooldown, () => (this.canDash = true))
  }

  private stopDash = (): void => {
    this.isDashing = false
    if (this.body && this.active) this.setVelocity(0, 0)
  }

  private handleWASDMovement(): void {
    if (!this.body || this.isDashing || !this._canMove) return

    this.setVelocity(0)
    const currentMovement: PhaserMath.Vector2 = new PhaserMath.Vector2(0, 0)

    if (this.keyW.isDown) currentMovement.y = -1
    else if (this.keyS.isDown) currentMovement.y = 1

    if (this.keyA.isDown) currentMovement.x = -1
    else if (this.keyD.isDown) currentMovement.x = 1

    if (currentMovement.length() > 0 && this.moveSpeed > 0) {
      currentMovement.normalize()

      const speed =
        (this.carriedCore ? this.moveSpeed / 4 : this.moveSpeed) *
        this.sceneRef.effects.playerSpeedMulti
      this.setVelocity(currentMovement.x * speed, currentMovement.y * speed)
      this._lastAngle = currentMovement.clone()
      if (currentMovement.x !== 0) this.setFlipX(currentMovement.x < 0)

      this.play('player-walk', true)
    } else {
      this.play('player-idle', true)
    }
  }

  private updateAttachedItemsAndDepth(): void {
    this.shadow.setPosition(this.x, this.y + 44)
    this.setDepth(this.y)
    this.shadow.setDepth(this.depth - 0.1)
    this.slashEffect.setDepth(this.depth + 1)
  }

  private handleAttack(enemies: Enemy[]): void {
    if (
      !Input.Keyboard.JustDown(this.attackKey) ||
      !this._canAttack ||
      this.isDashing
    ) {
      return
    }

    if (!this.carriedCore) {
      const cores = this.sceneRef.cores.getChildren() as Core[]
      cores.forEach((core) => {
        if (
          !this.carriedCore &&
          core &&
          PhaserMath.Distance.BetweenPoints(this, core) < 35
        ) {
          this.carriedCore = core
          this.carriedCore.shadow.setAlpha(0)
          return
        }
      })
      if (this.carriedCore) {
        this.sceneRef.playSound('pickup-item', { volume: 0.7 })
        return
      }
    }

    if (this.carriedCore) {
      this.carriedCore.setPosition(this.x, this.y)
      this.carriedCore.shadow.setAlpha(1)
      this.carriedCore = undefined
      this.sceneRef.playSound('drop-item', { volume: 0.7 })
      return
    }

    this.sceneRef.playSound('player-attack', { volume: 0.7 })

    this._canAttack = false
    this._canMove = false
    this.setVelocity(0, 0)
    this.play('player-idle')
    const attackPos = new PhaserMath.Vector2(this.x, this.y)
    const angle =
      this._lastAngle.x !== 0 || this._lastAngle.y !== 0
        ? this._lastAngle.clone()
        : new PhaserMath.Vector2(this.flipX ? -1 : 1, 0)
    angle.normalize()

    const rad =
      this.stats.attackRadius * this.sceneRef.effects.playerAttackSizeMulti
    this.slashEffect.performAttack(attackPos, angle, rad)

    enemies.forEach((enemy) => {
      if (!enemy.active || !enemy.body || !enemy.takeDamage) return

      if (this.slashEffect.isTargetHit(enemy.body, attackPos, angle, rad)) {
        enemy.takeDamage(
          Math.max(
            1,
            (this.stats.damage + this.sceneRef.effects.playerDamage) *
              this.sceneRef.effects.playerDamageMulti,
          ),
        )
      }
    })

    this.sceneRef.time.delayedCall(
      this.stats.attackRate * this.sceneRef.effects.playerAttackRateMulti * 0.5,
      () => {
        this._canMove = true
      },
    )

    this.sceneRef.time.delayedCall(
      this.stats.attackRate * this.sceneRef.effects.playerAttackRateMulti,
      () => {
        this._canAttack = true
        this.slashEffect.cleanup()
      },
    )
  }

  get stats() {
    return playerStats
  }
}
