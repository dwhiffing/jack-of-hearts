import { useLayoutEffect, useRef, useState } from 'react'
import StartGame from './game/main'
import { Game } from 'phaser'
import { CoreStats } from './game/constants'
import { CoreModal } from './CoreModal'

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

  const onClose = (stats?: CoreStats) => {
    setOpen(false)
    game.current?.events.emit('spawn-core', stats)
    setTimeout(() => {
      game.current?.events.emit('start-level')
    }, 750)
  }

  return (
    <div
      id="app"
      className="flex-col flex overflow-hidden w-full h-screen justify-center items-center text-white"
    >
      <div id="game-container"></div>
      <CoreModal isOpen={open} onClose={onClose} />
    </div>
  )
}

export default App
