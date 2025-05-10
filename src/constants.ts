export const CAMERA_FADE = 750
export type EnemyTypeEnum =
  | 'imp'
  | 'lizard'
  | 'skele'
  | 'goblin'
  | 'chort'
  | 'demon'
  | 'orc'
  | 'ogre'
  | 'wogol'
export type EnemyType = {
  key: string
  offsetX: number
  offsetY: number
  offsetHealth: number
  offsetShadow: number
}
export const ENEMY_TYPES: Record<EnemyTypeEnum, EnemyType> = {
  demon: {
    key: 'demon',
    offsetX: 12,
    offsetY: 24,
    offsetHealth: -40,
    offsetShadow: 55,
  },
  chort: {
    key: 'chort',
    offsetX: 4,
    offsetY: 13,
    offsetHealth: -30,
    offsetShadow: 36,
  },
  orc: {
    key: 'orc',
    offsetX: 4,
    offsetY: 11,
    offsetHealth: -30,
    offsetShadow: 35,
  },
  ogre: {
    key: 'ogre',
    offsetX: 12,
    offsetY: 24,
    offsetHealth: -40,
    offsetShadow: 55,
  },
  goblin: {
    key: 'goblin',
    offsetX: 4,
    offsetY: 8,
    offsetHealth: -35,
    offsetShadow: 25,
  },
  imp: {
    key: 'imp',
    offsetX: 4,
    offsetY: 8,
    offsetHealth: -35,
    offsetShadow: 25,
  },
  lizard: {
    key: 'lizard',
    offsetX: 4,
    offsetY: 18,
    offsetHealth: -28,
    offsetShadow: 42,
  },
  skele: {
    key: 'skele',
    offsetX: 4,
    offsetY: 6,
    offsetHealth: -35,
    offsetShadow: 25,
  },
  wogol: {
    key: 'wogol',
    offsetX: 4,
    offsetY: 13,
    offsetHealth: -25,
    offsetShadow: 35,
  },
}

export const ENEMY_ATTACK_TYPES = {
  explode: {
    attackDist: 50,
    attackDelay: 750,
    launchSpeed: 200,
    isExplode: true,
    damage: 5,
  },
  slash: {
    attackDist: 50,
    attackDelay: 750,
    launchSpeed: 0,
    isExplode: false,
    damage: 5,
  },
}
export const ENEMY_STATS = {
  demon: {
    key: 'demon',
    attackType: ENEMY_ATTACK_TYPES['explode'],
  },
  chort: {
    key: 'chort',
    attackType: ENEMY_ATTACK_TYPES['explode'],
  },
  orc: {
    key: 'orc',
    attackType: ENEMY_ATTACK_TYPES['explode'],
  },
  ogre: {
    key: 'ogre',
    attackType: ENEMY_ATTACK_TYPES['explode'],
  },
  goblin: {
    key: 'goblin',
    attackType: ENEMY_ATTACK_TYPES['explode'],
  },
  imp: {
    key: 'imp',
    attackType: ENEMY_ATTACK_TYPES['slash'],
  },
  lizard: {
    key: 'lizard',
    attackType: ENEMY_ATTACK_TYPES['slash'],
  },
  skele: {
    key: 'skele',
    attackType: ENEMY_ATTACK_TYPES['slash'],
  },
  wogol: {
    key: 'wogol',
    attackType: ENEMY_ATTACK_TYPES['slash'],
  },
}

export const ANIMS = [
  {
    prefix: 'knight_m_idle_anim_f',
    key: 'player-idle',
    start: 0,
    end: 3,
    frameRate: 5,
    repeat: -1,
  },
  {
    prefix: 'knight_m_run_anim_f',
    key: 'player-walk',
    start: 0,
    end: 3,
    frameRate: 10,
    repeat: -1,
  },
  {
    prefix: 'skelet_run_anim_f',
    key: 'skele-stop',
    start: 3,
    end: 3,
    frameRate: 2,
    repeat: -1,
  },
  {
    prefix: 'skelet_run_anim_f',
    key: 'skele-walk',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'skelet_idle_anim_f',
    key: 'skele-idle',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'lizard_m_run_anim_f',
    key: 'lizard-stop',
    start: 3,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'lizard_m_run_anim_f',
    key: 'lizard-walk',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'lizard_m_idle_anim_f',
    key: 'lizard-idle',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'imp_run_anim_f',
    key: 'imp-stop',
    start: 3,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'imp_run_anim_f',
    key: 'imp-walk',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'imp_idle_anim_f',
    key: 'imp-idle',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'goblin_run_anim_f',
    key: 'goblin-stop',
    start: 3,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'goblin_run_anim_f',
    key: 'goblin-walk',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'goblin_idle_anim_f',
    key: 'goblin-idle',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'ogre_run_anim_f',
    key: 'ogre-stop',
    start: 3,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'ogre_run_anim_f',
    key: 'ogre-walk',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'ogre_idle_anim_f',
    key: 'ogre-idle',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'orc_warrior_run_anim_f',
    key: 'orc-stop',
    start: 3,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'orc_warrior_run_anim_f',
    key: 'orc-walk',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'orc_warrior_idle_anim_f',
    key: 'orc-idle',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'chort_run_anim_f',
    key: 'chort-stop',
    start: 3,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'chort_run_anim_f',
    key: 'chort-walk',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'chort_idle_anim_f',
    key: 'chort-idle',
    start: 0,
    end: 3,
    frameRate: 4,
    repeat: -1,
  },
  {
    prefix: 'big_demon_run_anim_f',
    key: 'demon-stop',
    start: 3,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'big_demon_run_anim_f',
    key: 'demon-walk',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'big_demon_idle_anim_f',
    key: 'demon-idle',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'wogol_run_anim_f',
    key: 'wogol-stop',
    start: 3,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'wogol_run_anim_f',
    key: 'wogol-walk',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'wogol_idle_anim_f',
    key: 'wogol-idle',
    start: 0,
    end: 3,
    frameRate: 6,
    repeat: -1,
  },
  {
    prefix: 'Slash3_color4_frame',
    key: 'slash-1',
    start: 1,
    end: 9,
    frameRate: 30,
    repeat: 0,
  },
  {
    prefix: 'Slash_color4_frame',
    key: 'slash-2',
    start: 1,
    end: 4,
    frameRate: 10,
    repeat: 0,
  },
  {
    prefix: 'Slash_color4_frame',
    key: 'slash-3',
    start: 4,
    end: 9,
    frameRate: 20,
    repeat: 0,
  },
  {
    prefix: 'Slash2_color4_frame',
    key: 'slash-4',
    start: 1,
    end: 7,
    frameRate: 20,
    repeat: 0,
  },
]
