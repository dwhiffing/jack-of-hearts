import * as React from 'react'
import { ReactElement } from 'react'
const { memo, useEffect, useRef, useState } = React

interface IconTintProps {
  fallback?: ReactElement
  src: string
  color: string
  maxWidth: number
  maxHeight: number
}

interface DimensionsI {
  width: number
  height: number
}

const TintImage: React.FunctionComponent<IconTintProps> = ({
  fallback = <span />,
  src,
  color,
  maxWidth,
  maxHeight,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [size, setSize] = useState<DimensionsI>({ width: 100, height: 100 })

  const _scaleImage = (
    srcWidth: number,
    srcHeight: number,
    maxWidth: number,
    maxHeight: number,
  ): DimensionsI => {
    if ((maxWidth && !maxHeight) || (!maxWidth && maxHeight))
      throw new Error(
        'If you are going to provide width, make sure to provide height as well',
      )

    if (!maxWidth && !maxHeight) return { width: srcWidth, height: srcHeight }
    const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)
    return { width: srcWidth * ratio, height: srcHeight * ratio }
  }

  useEffect(() => {
    const pic = new Image()
    pic.src = src

    pic.onload = () => {
      const { width, height } = _scaleImage(
        pic.width,
        pic.height,
        maxWidth,
        maxHeight,
      )
      setSize({ width, height })
    }
  }, [src, maxWidth, maxHeight])

  useEffect(() => {
    const { current: canvas } = canvasRef
    const tintCanvas = document.createElement('canvas')
    const tintCtx = tintCanvas.getContext('2d')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx || !tintCtx) return
    const { width, height } = size
    tintCtx.clearRect(0, 0, width, height)
    ctx.clearRect(0, 0, width, height)

    const pic = new Image()
    pic.src = src

    tintCanvas.width = width
    tintCanvas.height = height
    tintCtx.fillStyle = color
    tintCtx.fillRect(0, 0, width, height)
    tintCtx.globalCompositeOperation = 'destination-atop'
    ctx.imageSmoothingEnabled = false
    tintCtx.imageSmoothingEnabled = false
    tintCtx.drawImage(pic, 0, 0, width, height)
    ctx.globalAlpha = 1
    ctx.drawImage(tintCanvas, 0, 0, width, height)
  }, [size, color])

  return (
    <canvas
      ref={canvasRef}
      {...props}
      width={size.width}
      height={size.height}
    />
  )
}

export default memo(TintImage)
