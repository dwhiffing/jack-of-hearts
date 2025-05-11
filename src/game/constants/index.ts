import { ILevel, CoreHalfStat, PlayerStats, Effects } from '../types'

export const CAMERA_FADE = 750

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
  playerAttackSize: 1,
  playerAttackStunDuration: 1,
  playerAttackRate: 1,
  playerSpeed: 1,
  playerDamage: 0,
  playerDamageMulti: 1,
  playerDashCooldown: 1,
  playerDashDist: 1,
  playerStunRecovery: 1,
}

export const LEVELS: ILevel[] = [
  { waves: [{ spawnRate: 1500, enemies: ['imp', 'imp', 'imp'] }] },
  { waves: [{ spawnRate: 1500, enemies: ['chort', 'chort', 'chort'] }] },
  { waves: [{ spawnRate: 1500, enemies: ['orc', 'orc'] }] },
  { waves: [{ spawnRate: 1500, enemies: ['ogre'] }] },
]

export const CORE_HALVES: Record<string, CoreHalfStat> = {
  red: { color: 0xff0000 },
  green: { color: 0x00ff00 },
  blue: { color: 0x0000ff },
  purple: { color: 0xff00ff },
  yellow: { color: 0xffff00 },
  cyan: { color: 0xff00ff },
}

export const PRIMARY_CORE = { left: CORE_HALVES.red, right: CORE_HALVES.red }
