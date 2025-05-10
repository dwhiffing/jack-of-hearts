import { Physics, Math as PhaserMath, Input } from 'phaser'
import { Game } from '../scenes/Game'
import { Enemy } from '../entities/Enemy'
import { Core } from './Core'
import { Shadow } from './Shadow'
import { Slash } from './Slash'

const PLAYER_SPEED = 220
const DASH_DISTANCE = 150
const DASH_DURATION = 200
const DASH_COOLDOWN = 700

export class Player extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  private _lastAngle: PhaserMath.Vector2
  private _canAttack: boolean
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
  private canDash: boolean = true

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'sheet')
    this.sceneRef = scene
    this.moveSpeed = PLAYER_SPEED
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.play('player-idle')
      .setSize(8, 8)
      .setOffset(4, 20)
      .setCollideWorldBounds(true)
      .setScale(3)

    this._lastAngle = new PhaserMath.Vector2(1, 0)
    this._canAttack = true
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

  public takeDamage(amount: number) {
    if (this.carriedCore) {
      this.carriedCore.takeDamage(amount)
    }
  }

  private handlePlayerInput(enemies: Enemy[]): void {
    if (!this.body) return

    if (this.isDashing) {
      this.play('player-walk', true)
      return
    }

    if (
      Input.Keyboard.JustDown(this.dashKey) &&
      this.canDash &&
      this._canAttack
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

    const dashDirection = this._lastAngle.clone()
    if (dashDirection.lengthSq() === 0) {
      dashDirection.x = this.flipX ? -1 : 1
      dashDirection.y = 0
    }
    dashDirection.normalize()

    const dashSpeed = DASH_DISTANCE / (DASH_DURATION / 1000)
    this.setVelocity(dashDirection.x * dashSpeed, dashDirection.y * dashSpeed)

    if (dashDirection.x !== 0) this.setFlipX(dashDirection.x < 0)
    this.play('player-walk', true)
    this.scene.time.delayedCall(DASH_DURATION, this.stopDash)
    this.scene.time.delayedCall(DASH_COOLDOWN, () => (this.canDash = true))
  }

  private stopDash = (): void => {
    this.isDashing = false
    if (this.body && this.active) this.setVelocity(0, 0)
  }

  private handleWASDMovement(): void {
    if (!this.body || this.isDashing) return

    this.setVelocity(0)
    const currentMovement: PhaserMath.Vector2 = new PhaserMath.Vector2(0, 0)

    if (this.keyW.isDown) currentMovement.y = -1
    else if (this.keyS.isDown) currentMovement.y = 1

    if (this.keyA.isDown) currentMovement.x = -1
    else if (this.keyD.isDown) currentMovement.x = 1

    if (currentMovement.length() > 0 && this.moveSpeed > 0) {
      currentMovement.normalize()

      const speed = this.carriedCore ? this.moveSpeed / 4 : this.moveSpeed
      this.setVelocity(currentMovement.x * speed, currentMovement.y * speed)
      this._lastAngle = currentMovement.clone()
      if (currentMovement.x !== 0) this.setFlipX(currentMovement.x < 0)

      this.play('player-walk', true)
    } else {
      this.play('player-idle', true)
    }
  }

  private updateAttachedItemsAndDepth(): void {
    if (this.carriedCore) {
      this.carriedCore.setPosition(this.x, this.y - 30)
      this.carriedCore.setDepth(this.y + 20)
    }

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
      if (this.carriedCore) return
    }

    if (this.carriedCore) {
      this.carriedCore.setPosition(this.x, this.y)
      this.carriedCore.shadow.setAlpha(1)
      this.carriedCore = undefined
      return
    }

    this._canAttack = false
    this.moveSpeed = 0
    const attackPos = new PhaserMath.Vector2(this.x, this.y)
    const angle =
      this._lastAngle.x !== 0 || this._lastAngle.y !== 0
        ? this._lastAngle.clone()
        : new PhaserMath.Vector2(this.flipX ? -1 : 1, 0)
    angle.normalize()

    this.slashEffect.performAttack(attackPos, angle)

    enemies.forEach((enemy) => {
      if (!enemy.active || !enemy.body || !enemy.takeDamage) return

      const enemyPos = new PhaserMath.Vector2(enemy.x, enemy.y)
      if (this.slashEffect.isTargetHit(enemyPos, attackPos, angle)) {
        enemy.takeDamage(1)
      }
    })

    this.sceneRef.time.delayedCall(350, () => {
      this._canAttack = true
      this.moveSpeed = PLAYER_SPEED
      this.slashEffect.cleanup()
    })
  }
}
