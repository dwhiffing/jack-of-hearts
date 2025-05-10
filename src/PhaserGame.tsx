import { forwardRef, useLayoutEffect, useRef } from 'react'
import StartGame from './game/main'
import { Game } from 'phaser'

export const PhaserGame = forwardRef(function PhaserGame(_props, ref) {
  const game = useRef<Game | undefined>(undefined)

  useLayoutEffect(() => {
    if (game.current === undefined) {
      game.current = StartGame('game-container')

      if (ref !== null) {
        ref.current = { game: game.current, scene: null }
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true)
        game.current = undefined
      }
    }
  }, [ref])

  // useEffect(() => {
  //   // EventBus.on('current-scene-ready', (currentScene) => {

  //   // })

  //   return () => {
  //     // EventBus.removeListener('current-scene-ready')
  //   }
  // }, [])

  return <div id="game-container"></div>
})
