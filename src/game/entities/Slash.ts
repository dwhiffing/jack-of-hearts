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
    radius = 60,
    range = 10,
  ): void {
    this.debugGraphics.clear()
    this.debugGraphics.fillStyle(0xffff99, DEBUG_ALPHA)

    this.slashSprite.setAlpha(1)
    this.slashSprite.play(`slash-${this.index}`, true)
    this.sceneRef.time.delayedCall(340, () => this.slashSprite.setAlpha(0))

    const dir = attackDirection.clone().normalize()

    const spriteOffsetX = dir.x * (SLASH_BASE_OFFSET + range)
    const spriteOffsetY = dir.y * (SLASH_BASE_OFFSET + range)

    this.slashSprite.setPosition(
      playerPosition.x + spriteOffsetX,
      playerPosition.y + SLASH_Y_OFFSET + spriteOffsetY,
    )

    const angleInRadians = dir.angle()
    let angleInDegrees = PhaserMath.RadToDeg(angleInRadians)
    angleInDegrees += SLASH_ANGLE_OFFSET
    const f = radius / 40
    this.slashSprite.setAngle(angleInDegrees).setScale(f)
    const offset = 10 + range + f * 20

    const x = playerPosition.x + dir.x * offset
    const y = playerPosition.y + SLASH_Y_OFFSET + dir.y * offset
    this.debugGraphics.arc(x, y, 5 + radius, 0, 360)
    this.debugGraphics.fillPath()
    this.debugGraphics.setDepth(ATTACK_SPRITE_DEPTH - 1)
  }

  public isTargetHit(
    target: Phaser.Physics.Arcade.Body,
    attackerPosition: PhaserMath.Vector2,
    attackDirection: PhaserMath.Vector2,
    radius = 60,
    range = 10,
  ): boolean {
    const f = radius / 40
    const offset = 10 + range + f * 20
    const x = attackerPosition.x + attackDirection.x * offset
    const y = attackerPosition.y + SLASH_Y_OFFSET + attackDirection.y * offset

    // @ts-ignore
    return this.sceneRef.physics.overlapCirc(x, y, 5 + radius).includes(target)
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
