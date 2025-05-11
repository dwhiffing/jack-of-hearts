import {
  ILevel,
  PlayerStats,
  Effects,
  CoreStats,
  EnemyTypeEnum,
  IWave,
} from '../types'
export const CAMERA_FADE = 750
export const MAX_RARITY = 5

const generateEnemy = (levelIndex: number): EnemyTypeEnum => {
  let enemyPool: EnemyTypeEnum[] = [
    'goblin',
    'goblin',
    'goblin',
    'goblin',
    'goblin',
    'goblin',
  ]
  if (levelIndex > 4) {
    enemyPool.push('orc', 'orc', 'orc')
  }
  if (levelIndex > 8) {
    enemyPool.push('ogre')
  }
  return Phaser.Math.RND.weightedPick(enemyPool)
}

const generateWave = (levelIndex: number, _enemyCount: number): IWave => {
  const enemyCount = getEnemyCount(levelIndex) + _enemyCount
  const enemies = Array.from({ length: Math.max(1, enemyCount) }, () =>
    generateEnemy(levelIndex),
  )

  return { spawnRate: 2000, enemies }
}

export const generateLevel = (
  levelIndex: number,
  enemyCount: number,
): ILevel => {
  const waves = Array.from({ length: getWaveCount(levelIndex) }, () =>
    generateWave(levelIndex, enemyCount),
  )
  return { waves, waveRate: 6500 }
}

const getEnemyCount = (levelIndex: number) => {
  if (levelIndex < 5) {
    return 3
  } else if (levelIndex >= 5) {
    return 4
  } else if (levelIndex >= 10) {
    return 5
  } else {
    return 6
  }
}

const getWaveCount = (levelIndex: number) => {
  if (levelIndex === 0) {
    return 1
  } else if (levelIndex <= 2) {
    return 2
  } else if (levelIndex <= 4) {
    return 3
  } else if (levelIndex <= 6) {
    return 4
  } else if (levelIndex <= 8) {
    return 5
  } else {
    return 6
  }
}

export const playerStats: PlayerStats = {
  speed: 150,
  damage: 1,
  attackRate: 750,
  attackRadius: 35,
  dashDistance: 150,
  dashDuration: 300,
  dashCooldown: 1500,
}

export const effects: Effects = {
  enemyHealthMulti: 1,
  enemySpeedMulti: 1,
  enemyDamageMulti: 1,
  enemyCount: 0,
  playerAttackSizeMulti: 1,
  playerAttackStunDurationMulti: 1,
  playerAttackRateMulti: 1,
  playerSpeedMulti: 1,
  playerDamage: 0,
  playerDamageMulti: 1,
  playerDashCooldownMulti: 1,
  playerDashDistMulti: 1,
  playerStunRecovery: 1,
}

const COLORS = [
  0xff0044, 0x3e2731, 0x262b44, 0x181425, 0x68386c, 0xb55088, 0xf6757a,
  0x124e89, 0x0099db, 0x2ce8f5, 0xffffff, 0xf77622, 0xfeae34, 0xfee761,
  0x63c74d, 0x3e8948, 0x265c42,
]

export const effectStats: Record<
  string,
  { label: string; color: number; ranges: { good: number[]; bad: number[] } }
> = {
  primary: {
    label: 'Primary',
    color: COLORS[0],
    ranges: { good: [0, 0, 0], bad: [0, 0, 0] },
  },
  enemyHealthMulti: {
    label: 'Enemy Health',
    color: COLORS[1],
    ranges: { good: [-0.1, -0.2, -0.3], bad: [0.1, 0.2, 0.3] },
  },
  enemySpeedMulti: {
    label: 'Enemy Speed',
    color: COLORS[2],
    ranges: { good: [-0.1, -0.2, -0.3], bad: [0.1, 0.2, 0.3] },
  },
  enemyDamageMulti: {
    label: 'Enemy Damage',
    color: COLORS[3],
    ranges: { good: [-0.1, -0.2, -0.3], bad: [0.1, 0.2, 0.3] },
  },
  enemyCount: {
    label: 'Enemy Count',
    color: COLORS[4],
    ranges: { good: [-1, -2, -3], bad: [1, 2, 3] },
  },
  playerAttackSizeMulti: {
    label: 'Attack Size',
    color: COLORS[5],
    ranges: { good: [0.1, 0.2, 0.3], bad: [-0.1, -0.2, -0.3] },
  },
  playerAttackStunDurationMulti: {
    label: 'Attack Stun',
    color: COLORS[6],
    ranges: { good: [0.1, 0.2, 0.3], bad: [-0.1, -0.2, -0.3] },
  },
  playerAttackRateMulti: {
    label: 'Attack Speed',
    color: COLORS[7],
    ranges: { good: [-0.1, -0.2, -0.3], bad: [0.1, 0.2, 0.3] },
  },
  playerSpeedMulti: {
    label: 'Movement Speed',
    color: COLORS[8],
    ranges: { good: [0.1, 0.2, 0.3], bad: [-0.1, -0.2, -0.3] },
  },
  playerDamage: {
    label: 'Damage Base',
    color: COLORS[9],
    ranges: { good: [1, 2, 3], bad: [-1, -2, -3] },
  },
  playerDamageMulti: {
    label: 'Damage Multi',
    color: COLORS[10],
    ranges: { good: [0.1, 0.2, 0.3], bad: [-0.1, -0.2, -0.3] },
  },
  playerDashCooldownMulti: {
    label: 'Dash Cooldown',
    color: COLORS[11],
    ranges: { good: [-0.1, -0.2, -0.3], bad: [0.1, 0.2, 0.3] },
  },
  playerDashDistMulti: {
    label: 'Dash Distance',
    color: COLORS[12],
    ranges: { good: [0.1, 0.2, 0.3], bad: [-0.1, -0.2, -0.3] },
  },
  playerStunRecovery: {
    label: 'Stun Recovery',
    color: COLORS[13],
    ranges: { good: [0.1, 0.2, 0.3], bad: [-0.1, -0.2, -0.3] },
  },
}

export const PRIMARY_CORE = {
  left: { effect: 'primary', rarity: 1 },
  right: { effect: 'primary', rarity: 1 },
} as CoreStats
