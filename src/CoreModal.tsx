import { useEffect, useState } from 'react'
import { Modal } from './Modal'
import { effectStats } from './game/constants'
import { CoreHalfStat, CoreStats } from './game/types'
import TintImage from './TintImage'
import { getEffectColor, getEffectValue, rollCores } from './game/utils'
import { Game } from 'phaser'

export function CoreModal(props: {
  isOpen: boolean
  onClose: (stats?: CoreStats) => void
  game?: Game
}) {
  const [index, setIndex] = useState(-1)
  const [cores, setCores] = useState<CoreStats[]>([])

  useEffect(() => {
    if (props.isOpen) {
      setCores(rollCores())
      setIndex(-1)
    }
  }, [props.isOpen])
  const selectedCore = cores[index]

  return (
    <Modal isOpen={props.isOpen} onClose={() => props.onClose()}>
      <div className="text-black flex h-full gap-2 flex-1 flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center gap-8">
          {cores.map((core, i) => (
            <CoreButton
              key={i}
              core={core}
              isActive={index === i}
              onClick={() => {
                props.game?.sound.play('click')
                setIndex(i)
              }}
            >
              {`Core ${i + 1}`}
            </CoreButton>
          ))}
        </div>

        <button
          className="w-full"
          onClick={() => {
            if (index === -1) {
              props.game?.sound.play('click-disabled')
            } else {
              props.game?.sound.play('click')

              props.onClose(selectedCore)
            }
          }}
        >
          Submit
        </button>
        <button className="w-full" onClick={() => setCores(rollCores)}>
          Re-roll
        </button>
      </div>
    </Modal>
  )
}

const CoreButton = (props: {
  core: CoreStats
  isActive: boolean
  onClick: () => void
  children: string
}) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex gap-4 items-center">
        <CoreHalf half={props.core.left} type="good" />
        <CoreImage core={props.core} />
        <CoreHalf half={props.core.right} type="bad" />
      </div>
      <button
        className={`w-32 border-2 ${
          props.isActive ? 'border-black' : 'border-transparent'
        }`}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  )
}

const CoreImage = (props: { core: CoreStats }) => {
  const width = 80
  return (
    <div className="relative" style={{ width, height: width }}>
      <img
        src="assets/ui_heart_empty.png"
        className="absolute"
        style={{ width: width }}
      />
      <div className="absolute left-0 z-10" style={{ width: width }}>
        <TintImage
          src="assets/ui_heart_half_left.png"
          color={`#${getEffectColor(props.core.left).toString(16)}`}
          maxWidth={width}
          maxHeight={width}
        />
      </div>
      <div className="absolute left-0 z-10" style={{ width: width }}>
        <TintImage
          src="assets/ui_heart_half_right.png"
          color={`#${getEffectColor(props.core.right).toString(16)}`}
          maxWidth={width}
          maxHeight={width}
        />
      </div>
    </div>
  )
}

const CoreHalf = (props: { half: CoreHalfStat; type: 'good' | 'bad' }) => {
  const value = getEffectValue(props.half, props.type)

  const isInt = value % 1 === 0
  const percentage = `${value > 0 ? '+' : ''}${value * 100}%`
  const int = `${value > 0 ? '+' : ''}${value}`
  return (
    <div
      className="text-center"
      style={{ color: props.type === 'good' ? '#00ff00' : '#ff0000' }}
    >
      <p className="w-32 font-bold">{effectStats[props.half.effect].label}: </p>
      <p>{isInt ? int : percentage}</p>
    </div>
  )
}
