export class Shadow extends Phaser.GameObjects.Graphics {
  private _width: number
  private _height: number
  public fillColor: number = 0x000000

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number = 4,
  ) {
    super(scene)
    this.x = x
    this.y = y
    this._width = width
    this._height = height

    scene.add.existing(this)
    this.draw()
  }

  public draw(): void {
    this.clear()
    this.fillStyle(this.fillColor, 0.2)
    this.fillEllipse(0, 0, this._width / 1, this._height / 1)
  }

  public setWidth(newWidth: number): void {
    this._width = newWidth
    this.draw()
  }
}
