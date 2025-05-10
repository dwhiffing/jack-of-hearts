import { useLayoutEffect, useRef, useState } from 'react'
import { CoreModal } from './CoreModal'
import StartGame from './game/main'
import { Game } from 'phaser'
import { CORE_HALVES } from './game/constants'

function App() {
  const [open, setOpen] = useState(false)

  const game = useRef<Game | undefined>(undefined)

  useLayoutEffect(() => {
    if (game.current === undefined) {
      game.current = StartGame('game-container')
      game.current.events.on('show-modal', () => setOpen(true))
    }

    return () => {
      if (game.current) {
        game.current.destroy(true)
        game.current = undefined
      }
    }
  }, [])

  const onClose = () => {
    setOpen(false)
    game.current?.events.emit('spawn-core', {
      left: CORE_HALVES.green,
      right: CORE_HALVES.blue,
    })
    setTimeout(() => {
      game.current?.events.emit('start-level')
    }, 750)
  }

  return (
    <div
      id="app"
      className="flex-col flex overflow-hidden w-full h-screen justify-center items-center text-white"
    >
      <div>
        <div id="game-container"></div>
      </div>
      <div>
        <CoreModal isOpen={open} onClose={onClose}>
          <div className="text-black flex h-full gap-2 flex-1 justify-center items-center">
            <button onClick={onClose}>Add core 1</button>
            <button onClick={onClose}>Add core 2</button>
            <button onClick={onClose}>Add core 3</button>
          </div>
        </CoreModal>
      </div>
    </div>
  )
}

export default App
