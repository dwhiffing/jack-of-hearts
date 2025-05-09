export const createAnims = (
  anims: Phaser.Animations.AnimationManager,
  data: {
    start: number
    end: number
    frameRate: number
    repeat: number
    prefix: string
    key: string
  }[],
) => {
  data.forEach((data) => {
    const suffix = '.png'
    const frameOpts = {
      start: data.start,
      end: data.end,
      prefix: data.prefix,
      suffix,
    }
    const frames = anims.generateFrameNames('sheet', frameOpts)
    anims.create({
      key: data.key,
      frames,
      frameRate: data.frameRate,
      repeat: data.repeat,
    })
  })
}
