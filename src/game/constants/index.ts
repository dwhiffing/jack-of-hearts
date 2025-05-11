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
  let enemyPool: EnemyTypeEnum[] = ['goblin', 'goblin', 'goblin']
  if (levelIndex > 1) {
    enemyPool.push('orc', 'orc')
  }
  if (levelIndex > 2) {
    enemyPool.push('ogre')
  }
  return Phaser.Math.RND.weightedPick(enemyPool)
}

const generateWave = (levelIndex: number): IWave => {
  const enemyCountMin = 2 + Math.floor(levelIndex / 2)
  const enemyCountMax = 3 + Math.floor(levelIndex / 2)
  const enemyCount = Phaser.Math.RND.between(enemyCountMin, enemyCountMax)
  const enemies = Array.from({ length: enemyCount }, () =>
    generateEnemy(levelIndex),
  )

  return { spawnRate: 500 - levelIndex * 100, enemies }
}

export const generateLevel = (levelIndex: number): ILevel => {
  const waveCount = 2 + levelIndex
  const waves = Array.from({ length: waveCount }, () =>
    generateWave(levelIndex),
  )
  return { waves, waveRate: 10000 }
}

export const playerStats: PlayerStats = {
  speed: 150,
  damage: 1,
  attackRate: 600,
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
    ranges: { good: [0, 0], bad: [0, 0] },
  },
  enemyHealthMulti: {
    label: 'Enemy Health',
    color: COLORS[1],
    ranges: { good: [-0.1, -0.5], bad: [0.1, 0.5] },
  },
  enemySpeedMulti: {
    label: 'Enemy Speed',
    color: COLORS[2],
    ranges: { good: [-0.1, -0.5], bad: [0.1, 0.5] },
  },
  enemyDamageMulti: {
    label: 'Enemy Damage',
    color: COLORS[3],
    ranges: { good: [-0.1, -0.5], bad: [0.1, 0.5] },
  },
  enemyCount: {
    label: 'Enemy Count',
    color: COLORS[4],
    ranges: { good: [-1, -5], bad: [1, 5] },
  },
  playerAttackSizeMulti: {
    label: 'Attack Size',
    color: COLORS[5],
    ranges: { good: [0.1, 0.5], bad: [-0.1, -0.5] },
  },
  playerAttackStunDurationMulti: {
    label: 'Attack Stun',
    color: COLORS[6],
    ranges: { good: [0.1, 0.5], bad: [-0.1, -0.5] },
  },
  playerAttackRateMulti: {
    label: 'Attack Speed',
    color: COLORS[7],
    ranges: { good: [-0.1, -0.5], bad: [0.1, 0.5] },
  },
  playerSpeedMulti: {
    label: 'Movement Speed',
    color: COLORS[8],
    ranges: { good: [0.1, 0.5], bad: [-0.1, -0.5] },
  },
  playerDamage: {
    label: 'Damage Base',
    color: COLORS[9],
    ranges: { good: [1, 5], bad: [-1, -5] },
  },
  playerDamageMulti: {
    label: 'Damage Multi',
    color: COLORS[10],
    ranges: { good: [0.1, 0.5], bad: [-0.1, -0.5] },
  },
  playerDashCooldownMulti: {
    label: 'Dash Cooldown',
    color: COLORS[11],
    ranges: { good: [-0.1, -0.5], bad: [0.1, 0.5] },
  },
  playerDashDistMulti: {
    label: 'Dash Distance',
    color: COLORS[12],
    ranges: { good: [0.1, 0.5], bad: [-0.1, -0.5] },
  },
  playerStunRecovery: {
    label: 'Stun Recovery',
    color: COLORS[13],
    ranges: { good: [0.1, 0.5], bad: [-0.1, -0.5] },
  },
}

export const PRIMARY_CORE = {
  left: { effect: 'primary', rarity: 1 },
  right: { effect: 'primary', rarity: 1 },
} as CoreStats
