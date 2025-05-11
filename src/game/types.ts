export type EnemyTypeEnum =
  | 'goblin'
  | 'orc'
  | 'ogre'
  | 'imp'
  | 'demon'
  | 'chort'
  | 'skele'
  | 'lizard'
  | 'shaman'
export type PlayerStats = {
  speed: number
  damage: number
  attackRate: number
  attackRadius: number
  dashDistance: number
  dashDuration: number
  dashCooldown: number
}

export type Effects = {
  enemyHealthMulti: number
  enemySpeedMulti: number
  enemyDamageMulti: number
  enemyCount: number
  playerAttackSizeMulti: number
  playerAttackRateMulti: number
  playerSpeedMulti: number
  playerDamage: number
  playerDamageMulti: number
  playerDashCooldownMulti: number
  playerDashDistMulti: number
  playerStunRecovery: number
  playerAttackStunDurationMulti: number
}

export type EnemyType = {
  key: string
  offsetX: number
  offsetY: number
  sizeX: number
  sizeY: number
  offsetHealth: number
  offsetShadow: number
}
export type CoreHalfStat = {
  effect: keyof Effects | 'primary'
  rarity: number
}
export type CoreStats = {
  left: CoreHalfStat
  right: CoreHalfStat
}
export type EnemyAttackType = {
  attackDist: number
  attackDelay: number
  launchSpeed: number
  isExplode: boolean
  damage: number
}
export type EnemyStats = {
  key: string
  attackType: EnemyAttackType
  speed: number
  health: number
  collideDamage: number
  stunDuration: number
  stunSpeed: number
}

export type IWave = {
  enemies: EnemyTypeEnum[]
  spawnRate: number
}
export type ILevel = {
  waves: IWave[]
  waveRate: number
}
