import { useRef } from 'react'
import { PhaserGame } from './PhaserGame'

function App() {
  //  References to the PhaserGame component (game and scene are exposed)
  const phaserRef = useRef(undefined)

  return (
    <div
      id="app"
      className="flex-col flex overflow-hidden w-full h-screen justify-center items-center text-white"
    >
      <div>
        <PhaserGame ref={phaserRef} />
      </div>
      <div>
        <div>hello</div>
      </div>
    </div>
  )
}

export default App
