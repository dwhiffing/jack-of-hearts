export class HealthBar extends Phaser.GameObjects.Graphics {
  private _width: number
  private _height: number
  private _fillHeight: number
  private _value: number
  private borderThickness: number

  public borderColor: number = 0x000000
  public fillColor: number = 0xff0000

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    initialValue: number = 100,
    height: number = 4,
  ) {
    super(scene)
    this.x = x
    this.y = y
    this._width = width
    this._height = height
    this._fillHeight = height - 2
    this._value = initialValue
    this.borderThickness = (this._height - this._fillHeight) / 2

    scene.add.existing(this)

    this.draw()
  }

  public setValue(newValue: number): void {
    this._value = Phaser.Math.Clamp(newValue, 0, 100)
    this.draw()
  }

  public getValue(): number {
    return this._value
  }

  public draw(): void {
    this.clear()

    this.fillStyle(this.borderColor, 1)
    this.fillRect(0, 0, this._width, this._height)

    const fillWidth =
      (this._width - 2 * this.borderThickness) * (this._value / 100)

    if (fillWidth > 0) {
      this.fillStyle(this.fillColor, 1)

      this.fillRect(
        this.borderThickness,
        this.borderThickness,
        fillWidth,
        this._fillHeight,
      )
    }
  }

  public setWidth(newWidth: number): void {
    this._width = newWidth
    this.draw()
  }
}
