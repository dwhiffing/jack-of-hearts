import { effectStats } from './constants'
import { CoreHalfStat, CoreStats } from './types'

export const createAnims = (
  anims: Phaser.Animations.AnimationManager,
  data: {
    start: number
    end: number
    frameRate: number
    repeat: number
    prefix: string
    key: string
  }[],
) => {
  data.forEach((data) => {
    const suffix = '.png'
    const frameOpts = {
      start: data.start,
      end: data.end,
      prefix: data.prefix,
      suffix,
    }
    const frames = anims.generateFrameNames('sheet', frameOpts)
    anims.create({
      key: data.key,
      frames,
      frameRate: data.frameRate,
      repeat: data.repeat,
    })
  })
}

export const getEffectValue = (
  coreHalf: CoreHalfStat,
  type: 'good' | 'bad',
) => {
  return effectStats[coreHalf.effect].ranges[type][coreHalf.rarity]
}

export const getEffectColor = (coreHalf: CoreHalfStat) => {
  return effectStats[coreHalf.effect].color
}

export function lerp(start: number, end: number, amount: number): number {
  return start * (1 - amount) + end * amount
}

export const getRarity = () =>
  Phaser.Math.RND?.weightedPick([0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2]) + 0

export const rollCores = (levelIndex: number) => {
  const keys =
    levelIndex <= 5
      ? [
          'playerDamage',
          'playerAttackSizeMulti',
          'playerAttackRateMulti',
          'enemySpeedMulti',
          'enemyDamageMulti',
          'playerSpeedMulti',
        ]
      : [
          'enemyHealthMulti',
          'enemySpeedMulti',
          'enemyDamageMulti',
          'enemyCount',
          'playerAttackSizeMulti',
          'playerAttackStunDurationMulti',
          'playerAttackRateMulti',
          'playerSpeedMulti',
          'playerDamage',
          'playerDamageMulti',
          'playerDashCooldownMulti',
          'playerDashDistMulti',
          'playerStunRecovery',
        ]
  const _effects = Phaser.Math.RND?.shuffle(keys).slice(0, 6) ?? []

  if (_effects.length === 0) return []

  const rarity1 = getRarity()
  const rarity2 = getRarity()
  const rarity3 = getRarity()

  const core1 = {
    left: { effect: _effects[0], rarity: rarity1 },
    right: { effect: _effects[3], rarity: rarity1 },
  }
  const core2 = {
    left: { effect: _effects[1], rarity: rarity2 },
    right: { effect: _effects[4], rarity: rarity2 },
  }
  const core3 = {
    left: { effect: _effects[2], rarity: rarity3 },
    right: { effect: _effects[5], rarity: rarity3 },
  }
  return [core1, core2, core3] as CoreStats[]
}
