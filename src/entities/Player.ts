import { Physics, Math as PhaserMath, GameObjects, Input } from 'phaser'
import { Game } from '../scenes/Game'
import { Enemy } from '../entities/Enemy'
const PLAYER_ATTACK_ARC_ANGLE: number = Math.PI / 1.8

export class Player extends Physics.Arcade.Sprite {
  protected sceneRef: Game
  private _lastPlayerDirection: PhaserMath.Vector2
  private _canAttack: boolean
  private _attackGraphics: GameObjects.Graphics

  private keyW: Input.Keyboard.Key
  private keyA: Input.Keyboard.Key
  private keyS: Input.Keyboard.Key
  private keyD: Input.Keyboard.Key
  private keySpace: Input.Keyboard.Key

  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, 'sheet')
    this.sceneRef = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.play('player-idle')
      .setSize(8, 8)
      .setOffset(4, 20)
      .setCollideWorldBounds(true)
      .setScale(3)

    this._lastPlayerDirection = new PhaserMath.Vector2(1, 0)
    this._canAttack = true
    this._attackGraphics = scene.add.graphics()

    if (!scene.input || !scene.input.keyboard) {
      throw new Error('Keyboard missing')
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
  }

  private handleMovement(): void {
    if (!this.body) return

    this.setVelocity(0)
    const currentMovement: PhaserMath.Vector2 = new PhaserMath.Vector2(0, 0)

    if (this.keyW.isDown) currentMovement.y = -1
    else if (this.keyS.isDown) currentMovement.y = 1

    if (this.keyA.isDown) currentMovement.x = -1
    else if (this.keyD.isDown) currentMovement.x = 1

    if (currentMovement.length() > 0) {
      currentMovement.normalize()
      this.setVelocity(currentMovement.x * 220, currentMovement.y * 220)
      this._lastPlayerDirection = currentMovement.clone()
      this.setFlipX(currentMovement.x === -1)
      this.play('player-walk', true)
    } else {
      this.play('player-idle', true)
    }

    this.setDepth(this.body.position.y)
  }

  private handleAttack(enemies: Enemy[]): void {
    if (!Input.Keyboard.JustDown(this.keySpace) || !this._canAttack) return

    this._canAttack = false
    this._attackGraphics.clear()
    this._attackGraphics.fillStyle(0xffff99, 0.4)

    const playerPos = new PhaserMath.Vector2(this.x, this.y)
    const baseAngle = this._lastPlayerDirection.angle()
    const startAngle = baseAngle - PLAYER_ATTACK_ARC_ANGLE / 2
    const endAngle = baseAngle + PLAYER_ATTACK_ARC_ANGLE / 2

    this._attackGraphics.slice(
      playerPos.x,
      playerPos.y,
      120,
      startAngle,
      endAngle,
      false,
    )
    this._attackGraphics.fillPath()

    enemies.forEach((enemy) => {
      if (!enemy.active || !enemy.body || !enemy.takeDamage) return

      const vecToEnemy = new PhaserMath.Vector2(
        enemy.x - this.x,
        enemy.y - this.y,
      )

      if (vecToEnemy.length() > 120) return

      const diffAngle = PhaserMath.Angle.Wrap(vecToEnemy.angle() - baseAngle)
      if (Math.abs(diffAngle) <= PLAYER_ATTACK_ARC_ANGLE / 2) {
        enemy.takeDamage(1)
      }
    })

    this.sceneRef.time.delayedCall(350, () => {
      this._canAttack = true
      this._attackGraphics?.clear()
    })
  }
}
