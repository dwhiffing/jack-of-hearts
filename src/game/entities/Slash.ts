import { GameObjects, Math as PhaserMath } from 'phaser'
import { Game } from '../scenes/Game'

const ATTACK_ARC_ANGLE: number = Math.PI / 1.3
const ATTACK_RADIUS: number = 90
const ATTACK_SPRITE_OFFSET_DISTANCE = 25
const ATTACK_SPRITE_BASE_Y_OFFSET = 20
const ATTACK_SPRITE_ANGLE_OFFSET_DEGREES = 60
const ATTACK_SPRITE_DEPTH = 99999
const DEBUG_GRAPHICS_Y_OFFSET = 20
const DEBUG_ALPHA = 0

export class Slash {
  protected sceneRef: Game
  private slashSprite: GameObjects.Sprite
  private debugGraphics: GameObjects.Graphics
  public index: number

  constructor(scene: Game, x: number, y: number, index: number) {
    this.sceneRef = scene

    this.slashSprite = scene.add
      .sprite(x, y, 'slash-1')
      .setScale(1.5)
      .setAlpha(0)
      .setDepth(ATTACK_SPRITE_DEPTH)
    this.index = index
    this.debugGraphics = scene.add.graphics()
  }

  public performAttack(
    playerPosition: PhaserMath.Vector2,
    attackDirection: PhaserMath.Vector2,
  ): void {
    this.debugGraphics.clear()
    this.debugGraphics.fillStyle(0xffff99, DEBUG_ALPHA)

    this.slashSprite.setAlpha(1)
    this.slashSprite.play(`slash-${this.index}`, true)

    const normalizedDirection = attackDirection.clone().normalize()

    const spriteOffsetX = normalizedDirection.x * ATTACK_SPRITE_OFFSET_DISTANCE
    const spriteOffsetY = normalizedDirection.y * ATTACK_SPRITE_OFFSET_DISTANCE

    this.slashSprite.setPosition(
      playerPosition.x + spriteOffsetX,
      playerPosition.y + ATTACK_SPRITE_BASE_Y_OFFSET + spriteOffsetY,
    )

    const angleInRadians = normalizedDirection.angle()
    let angleInDegrees = PhaserMath.RadToDeg(angleInRadians)
    angleInDegrees += ATTACK_SPRITE_ANGLE_OFFSET_DEGREES
    this.slashSprite.setAngle(angleInDegrees)

    const baseAngle = attackDirection.angle()
    const startAngle = baseAngle - ATTACK_ARC_ANGLE / 2
    const endAngle = baseAngle + ATTACK_ARC_ANGLE / 2

    this.debugGraphics.slice(
      playerPosition.x,
      playerPosition.y + DEBUG_GRAPHICS_Y_OFFSET,
      ATTACK_RADIUS,
      startAngle,
      endAngle,
      false,
    )
    this.debugGraphics.fillPath()
    this.debugGraphics.setDepth(ATTACK_SPRITE_DEPTH - 1)
  }

  public isTargetHit(
    targetPosition: PhaserMath.Vector2,
    attackerPosition: PhaserMath.Vector2,
    attackDirection: PhaserMath.Vector2,
  ): boolean {
    const vecToTarget = new PhaserMath.Vector2(
      targetPosition.x - attackerPosition.x,
      targetPosition.y - (attackerPosition.y + DEBUG_GRAPHICS_Y_OFFSET),
    )

    if (vecToTarget.length() > ATTACK_RADIUS) {
      return false
    }

    const baseAngle = attackDirection.angle()
    const angleToTarget = vecToTarget.angle()
    const diffAngle = PhaserMath.Angle.Wrap(angleToTarget - baseAngle)

    return Math.abs(diffAngle) <= ATTACK_ARC_ANGLE / 2
  }

  public cleanup(): void {
    this.debugGraphics.clear()
    this.slashSprite.setAlpha(0)
  }

  public setDepth(depth: number): void {
    this.slashSprite.setDepth(depth)
    this.debugGraphics.setDepth(depth - 1 > 0 ? depth - 1 : 0)
  }
}
