import { Game } from '../scenes/Game'
import { EntityBase } from './EntityBase'

export class Enemy extends EntityBase {
  moveSpeed = 50
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y)
    this.setSize(8, 12).setOffset(4, 2).setScale(3).setCollideWorldBounds(false)
  }

  public spawn() {
    const { x, y } = getEnemySpawn(
      this.sceneRef.camera.width,
      this.sceneRef.camera.height,
    )
    this.setPosition(x, y).setActive(true).setVisible(true).setData('health', 2)
    this.play('skele-walk')
    this.body.setEnable(true)
  }

  public destroy(fromScene?: boolean): void {
    this.sceneRef.emitter.explode(10, this.x, this.y)
    super.destroy(fromScene)
  }

  public takeDamage(amount: number): void {
    super.takeDamage(amount)
    if (!this.active) return
    this.moveSpeed = 0
    this.play('skele-idle')
    this.sceneRef.time.delayedCall(1000, () => {
      this.moveSpeed = 50
    })
  }

  public moveTowards(target: { x: number; y: number }): void {
    if (this.active && this.body && this.sceneRef.physics && target) {
      this.sceneRef.physics.moveToObject(this, target, this.moveSpeed)
      if (this.moveSpeed > 0) {
        this.play('skele-walk', true)
        this.setFlipX(this.body.velocity.x < 0)
        this.setDepth(this.body.position.y)
      }
    }
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
