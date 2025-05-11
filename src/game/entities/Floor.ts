import { Scene } from 'phaser'

export class Floor {
  public sceneRef: Scene

  constructor(scene: Scene) {
    this.sceneRef = scene

    const map = this.sceneRef.make.tilemap({
      data: getFloorData(),
      tileWidth: 16,
      tileHeight: 16,
    })
    const tiles = map.addTilesetImage('tilesv1', 'tiles', 16, 16)!
    map.createLayer(0, tiles, 0, 0)?.setScale(2)
  }
}

const getFloorData = () => {
  const data = [
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
    new Array(25).fill(0).map(getTile),
  ]
  return data
}

const getTile = () => Phaser.Math.RND.weightedPick(TILES)
const TILES = [
  0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0,
  0, 0, 0, 2, 2, 2, 2, 2, 2, 1, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 3, 5, 6, 7,
]
