import { useState } from 'react'
import { Modal } from './Modal'
import { CORE_HALVES, CoreStats } from './game/constants'

export function CoreModal(props: {
  isOpen: boolean
  onClose: (stats?: CoreStats) => void
}) {
  const [badIndex, setBadIndex] = useState(-1)
  const [goodIndex, setGoodIndex] = useState(-1)

  const setIndex = (type: 'good' | 'bad', index: number) => {
    if (type === 'good') {
      setGoodIndex(index)
    } else {
      setBadIndex(index)
    }
  }

  const goodOptions = [CORE_HALVES.blue, CORE_HALVES.green, CORE_HALVES.purple]
  const badOptions = [CORE_HALVES.cyan, CORE_HALVES.yellow, CORE_HALVES.red]
  const stats = { left: goodOptions[goodIndex], right: badOptions[badIndex] }

  return (
    <Modal isOpen={props.isOpen} onClose={() => props.onClose()}>
      <div className="text-black flex h-full gap-2 flex-1 flex-col justify-center items-center">
        <p>Good: {stats.left?.color}</p>
        <p>Bad: {stats.right?.color}</p>

        <div className="flex justify-center items-center gap-4">
          {goodOptions.map((option, i) => (
            <CoreButton
              key={i}
              isActive={goodIndex === i}
              onClick={() => setIndex('good', i)}
            >
              {`Good Half ${i + 1}`}
            </CoreButton>
          ))}
        </div>
        <div className="flex justify-center items-center gap-4">
          {badOptions.map((option, i) => (
            <CoreButton
              key={i}
              isActive={badIndex === i}
              onClick={() => setIndex('bad', i)}
            >
              {`Bad Half ${i + 1}`}
            </CoreButton>
          ))}
        </div>
        <button onClick={() => props.onClose(stats)}>Submit</button>
      </div>
    </Modal>
  )
}

const CoreButton = (props: {
  isActive: boolean
  onClick: () => void
  children: string
}) => {
  return (
    <button
      className={`border-2 ${
        props.isActive ? 'border-black' : 'border-transparent'
      }`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
