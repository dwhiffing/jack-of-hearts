import { GameObjects, Math as PhaserMath } from 'phaser'
import { Game } from '../scenes/Game'

const SLASH_BASE_OFFSET = 25
const SLASH_Y_OFFSET = 20
const SLASH_ANGLE_OFFSET = 60
const ATTACK_SPRITE_DEPTH = 99999
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

    const dir = attackDirection.clone().normalize()

    const spriteOffsetX = dir.x * SLASH_BASE_OFFSET
    const spriteOffsetY = dir.y * SLASH_BASE_OFFSET

    this.slashSprite.setPosition(
      playerPosition.x + spriteOffsetX,
      playerPosition.y + SLASH_Y_OFFSET + spriteOffsetY,
    )

    const angleInRadians = dir.angle()
    let angleInDegrees = PhaserMath.RadToDeg(angleInRadians)
    angleInDegrees += SLASH_ANGLE_OFFSET
    this.slashSprite.setAngle(angleInDegrees)

    this.debugGraphics.arc(
      playerPosition.x + dir.x * 40,
      playerPosition.y + SLASH_Y_OFFSET + dir.y * 40,
      60,
      0,
      360,
    )
    this.debugGraphics.fillPath()
    this.debugGraphics.setDepth(ATTACK_SPRITE_DEPTH - 1)
  }

  public isTargetHit(
    targetPosition: PhaserMath.Vector2,
    attackerPosition: PhaserMath.Vector2,
    attackDirection: PhaserMath.Vector2,
  ): boolean {
    const circle = new Phaser.Geom.Circle(
      attackerPosition.x + attackDirection.x * 40,
      attackerPosition.y + SLASH_Y_OFFSET + attackDirection.y * 40,
      60,
    )
    return Phaser.Geom.Circle.ContainsPoint(circle, targetPosition)
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
