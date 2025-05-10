import { Physics, Math as PhaserMath, Input } from 'phaser'
import { Game } from '../scenes/Game'
import { Enemy } from '../entities/Enemy'
import { Core } from './Core'
import { Shadow } from './Shadow'
import { Slash } from './Slash'

const PLAYER_SPEED = 220

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
  private keySpace: Input.Keyboard.Key

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
    this.keyW = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.W)
    this.keyA = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.A)
    this.keyS = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.S)
    this.keyD = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.D)
    this.keySpace = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE)
  }

  public update(enemies: Enemy[]): void {
    this.handleMovement()
    this.handleAttack(enemies)
    this.slashEffect.setDepth(this.depth + 1)
  }

  private handleMovement(): void {
    if (!this.body) return

    if (this.carriedCore) {
      this.carriedCore.setPosition(this.x, this.y - 30)
      this.carriedCore.setDepth(this.y + 20)
    }

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
      this.shadow.setPosition(this.x, this.y + 44)
      this._lastAngle = currentMovement.clone()
      this.setFlipX(currentMovement.x < 0)
      this.play('player-walk', true)
    } else {
      this.play('player-idle', true)
    }

    this.setDepth(this.y)
    this.shadow.setDepth(this.depth - 0.1)
  }

  private handleAttack(enemies: Enemy[]): void {
    if (!Input.Keyboard.JustDown(this.keySpace) || !this._canAttack) return

    if (
      !this.carriedCore &&
      this.sceneRef.core &&
      PhaserMath.Distance.BetweenPoints(this, this.sceneRef.core) < 35
    ) {
      this.carriedCore = this.sceneRef.core
      this.carriedCore.shadow.setAlpha(0)
      return
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
      this._lastAngle && (this._lastAngle.x !== 0 || this._lastAngle.y !== 0)
        ? this._lastAngle.clone()
        : new PhaserMath.Vector2(this.flipX ? -1 : 1, 0)

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
