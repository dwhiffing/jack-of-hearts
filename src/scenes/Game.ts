import {
  Scene,
  Cameras,
  GameObjects,
  Input,
  Math as PhaserMath,
  Physics,
  Time,
  Types,
} from 'phaser'

// --- Constants ---
const SCREEN_WIDTH: number = 800
const SCREEN_HEIGHT: number = 600

const PLAYER_SPEED: number = 220
const PLAYER_SIZE: number = 16 // Radius of the player's visual circle
const PLAYER_ATTACK_RANGE: number = 80 // How far the melee attack reaches
const PLAYER_ATTACK_ARC_ANGLE: number = Math.PI / 1.8 // Approx 100 degrees arc
const PLAYER_ATTACK_DURATION: number = 150 // How long the attack visual stays (ms)
const PLAYER_ATTACK_COOLDOWN: number = 400 // Time between attacks (ms)
const PLAYER_ATTACK_DAMAGE: number = 10

const ENEMY_SPEED: number = 75
const ENEMY_SIZE: number = 12 // Radius of the enemy's visual circle
const ENEMY_HEALTH_INITIAL: number = 30
const ENEMY_SPAWN_INTERVAL: number = 1800 // Time between enemy spawns (ms)
const ENEMY_DAMAGE_TO_CORE: number = 10

const CORE_VISUAL_SIZE: number = 30 // Half-width/height for the core's square visual
const CORE_HEALTH_INITIAL: number = 100

// --- Global Variables for UI Elements ---
// These are declared globally so they can be accessed by various functions,
// particularly update functions and event handlers.
let coreHealthText: GameObjects.Text | undefined
let gameOverText: GameObjects.Text | undefined
let instructionsText: GameObjects.Text | undefined

// --- Custom Interfaces for Game Objects with Data ---
interface HealthData {
  health: number
}

interface GameObjectWithHealth extends Physics.Arcade.Sprite, HealthData {}
// A more generic way if you have various custom data, but less type-safe for specific properties
// interface CustomSprite extends Physics.Arcade.Sprite {
//   getData(key: string): any;
//   setData(key: string, value: any): this;
// }

export class Game extends Scene {
  // --- Scene Properties ---
  public player!: GameObjectWithHealth // Using definite assignment assertion
  public core!: GameObjectWithHealth
  public enemies!: Physics.Arcade.Group

  // Input keys
  private keyW!: Input.Keyboard.Key
  private keyA!: Input.Keyboard.Key
  private keyS!: Input.Keyboard.Key
  private keyD!: Input.Keyboard.Key
  private keySpace!: Input.Keyboard.Key

  private lastPlayerDirection: PhaserMath.Vector2
  private canAttack: boolean
  private attackGraphics!: GameObjects.Graphics // For visualizing the player's attack arc

  // Phaser Scene properties that are commonly used
  public camera!: Cameras.Scene2D.Camera // Added based on user's original snippet
  // public background!: GameObjects.Image; // Not used in provided logic, but was in original snippet
  // public msg_text!: GameObjects.Text; // Not used in provided logic, but was in original snippet

  constructor() {
    super('Game')
    // --- Scene Properties ---
    // Initialization will happen in create(), so we use definite assignment assertions above for some.
    // this.player = null; // Handled by definite assignment
    // this.core = null; // Handled by definite assignment
    // this.enemies = null; // Handled by definite assignment

    // this.keyW = null; // Handled by definite assignment
    // this.keyA = null; // Handled by definite assignment
    // this.keyS = null; // Handled by definite assignment
    // this.keyD = null; // Handled by definite assignment
    // this.keySpace = null; // Handled by definite assignment

    this.lastPlayerDirection = new PhaserMath.Vector2(1, 0) // Default facing right
    this.canAttack = true
    // this.attackGraphics = null; // Handled by definite assignment
  }

  preload(): void {
    // No external assets are loaded for this simple prototype.
    // We generate textures from graphics primitives in create().

    // Generate player texture (a blue circle)
    const playerGraphics: GameObjects.Graphics = this.make.graphics({
      fillStyle: { color: 0x66ccff },
    }) // Light Blue
    playerGraphics.fillCircle(PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE)
    playerGraphics.generateTexture(
      'playerTexture',
      PLAYER_SIZE * 2,
      PLAYER_SIZE * 2,
    )
    playerGraphics.destroy() // Clean up the graphics object after texture generation

    // Generate core texture (a green square)
    const coreGraphics: GameObjects.Graphics = this.make.graphics({
      fillStyle: { color: 0x33ff99 },
    }) // Bright Green
    coreGraphics.fillRect(
      -CORE_VISUAL_SIZE,
      -CORE_VISUAL_SIZE,
      CORE_VISUAL_SIZE * 2,
      CORE_VISUAL_SIZE * 2,
    )
    coreGraphics.generateTexture(
      'coreTexture',
      CORE_VISUAL_SIZE * 2,
      CORE_VISUAL_SIZE * 2,
    )
    coreGraphics.destroy()

    // Generate enemy texture (a red circle)
    const enemyGraphics: GameObjects.Graphics = this.make.graphics({
      fillStyle: { color: 0xff6666 },
    }) // Light Red
    enemyGraphics.fillCircle(ENEMY_SIZE, ENEMY_SIZE, ENEMY_SIZE)
    enemyGraphics.generateTexture(
      'enemyTexture',
      ENEMY_SIZE * 2,
      ENEMY_SIZE * 2,
    )
    enemyGraphics.destroy()
  }

  create(): void {
    this.camera = this.cameras.main // Initialize camera if it's going to be used

    // --- Initialize Core ---
    this.core = this.physics.add.sprite(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2,
      'coreTexture',
    ) as GameObjectWithHealth
    this.core.setCircle(CORE_VISUAL_SIZE) // Physics body as a circle for better interaction
    this.core.setImmovable(true) // Core doesn't move when hit
    this.core.setData('health', CORE_HEALTH_INITIAL) // Store health on the core object

    // --- Initialize Player ---
    this.player = this.physics.add.sprite(
      SCREEN_WIDTH / 2,
      SCREEN_HEIGHT / 2 + 120,
      'playerTexture',
    ) as GameObjectWithHealth
    this.player.play('player')
    this.player.setCircle(PLAYER_SIZE) // Circular physics body
    this.player.setCollideWorldBounds(true) // Player cannot leave screen boundaries
    this.player.setData('health', Infinity) // Player doesn't take damage in this version, but good practice

    // --- Initialize Attack Graphics ---
    // This graphics object will be used to draw the player's attack arc visualization
    this.attackGraphics = this.add.graphics()

    // --- Initialize Enemies Group ---
    // Using a physics group for enemies allows for efficient collision checks and updates
    const enemyGroupConfig: Types.Physics.Arcade.PhysicsGroupConfig = {
      runChildUpdate: false, // We'll manually update enemies or use physics.moveToObject
      // If you need to set classType for stronger typing with setData/getData:
      // classType: Phaser.Physics.Arcade.Sprite // or your custom Enemy class that extends Sprite
    }
    this.enemies = this.physics.add.group(enemyGroupConfig)

    // --- Setup Input ---
    // Assign keyboard keys for player actions
    this.keyW = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.W)
    this.keyA = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.A)
    this.keyS = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.S)
    this.keyD = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.D)
    this.keySpace = this.input.keyboard!.addKey(Input.Keyboard.KeyCodes.SPACE)

    // --- UI Text Elements ---
    coreHealthText = this.add.text(
      15,
      15,
      `Core Health: ${this.core.getData('health')}`,
      { fontSize: '22px', color: '#e0e0e0', fontStyle: 'bold' },
    )
    instructionsText = this.add
      .text(SCREEN_WIDTH - 15, 15, 'WASD: Move | Space: Attack', {
        fontSize: '16px',
        color: '#cccccc',
      })
      .setOrigin(1, 0)
    gameOverText = this.add
      .text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2, 'GAME OVER', {
        fontSize: '56px',
        color: '#ff4444',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5) // Center the text
      .setVisible(false) // Initially hidden until game over condition is met

    // --- Setup Physics Collisions ---
    // Define what happens when an enemy overlaps with the core
    this.physics.add.overlap(
      this.enemies,
      this.core,
      this.enemyHitCore, // Type assertion for the callback
      undefined, // processCallback, not used here
      this,
    )

    // --- Enemy Spawner Timer ---
    // Periodically calls the spawnEnemy method to create new enemies
    this.time.addEvent({
      delay: ENEMY_SPAWN_INTERVAL,
      callback: this.spawnEnemy,
      callbackScope: this, // Ensures 'this' inside spawnEnemy refers to the GameScene
      loop: true,
    })
    this.spawnEnemy() // Spawn one enemy at the start of the game
  }

  update(_time: number, _delta: number): void {
    // The main game loop, called every frame.
    // 'time' is the current time, 'delta' is the time since the last frame.

    // If game over, do nothing further in the update loop
    if (gameOverText && gameOverText.visible) {
      // Check if gameOverText is defined
      return
    }

    this.handlePlayerMovement()
    this.handlePlayerAttack()
    this.updateEnemiesDirection() // Ensure enemies keep tracking the core

    // Update core health display on screen
    if (coreHealthText && this.core.getData('health') !== undefined) {
      // Check if coreHealthText is defined
      coreHealthText.setText(`Core Health: ${this.core.getData('health')}`)
    }

    // Check for game over condition (core health depleted)
    if (this.core.getData('health') <= 0) {
      this.triggerGameOver()
    }
  }

  handlePlayerMovement(): void {
    if (!this.player || !this.player.body) return // Guard clause

    this.player.setVelocity(0) // Reset player velocity each frame to stop movement if no keys are pressed
    let currentMovement: PhaserMath.Vector2 = new PhaserMath.Vector2(0, 0) // Vector to store movement direction

    // Check WASD keys for movement input
    if (this.keyW?.isDown) {
      currentMovement.y = -1
    } // Move up
    else if (this.keyS?.isDown) {
      currentMovement.y = 1
    } // Move down
    if (this.keyA?.isDown) {
      currentMovement.x = -1
    } // Move left
    else if (this.keyD?.isDown) {
      currentMovement.x = 1
    } // Move right

    // If there's movement input, normalize the vector (for consistent diagonal speed) and apply speed
    if (currentMovement.length() > 0) {
      currentMovement.normalize()
      this.player.setVelocity(
        currentMovement.x * PLAYER_SPEED,
        currentMovement.y * PLAYER_SPEED,
      )
      this.lastPlayerDirection = currentMovement.clone() // Store this direction for aiming attacks
    }
  }

  handlePlayerAttack(): void {
    if (!this.player) return // Guard clause

    // Check if spacebar is just pressed and attack is not on cooldown
    if (
      this.keySpace &&
      Input.Keyboard.JustDown(this.keySpace) &&
      this.canAttack
    ) {
      this.canAttack = false // Set attack on cooldown
      this.attackGraphics.clear() // Clear previous attack visualization
      this.attackGraphics.fillStyle(0xffff99, 0.4) // Semi-transparent yellow for attack arc

      const playerPos: PhaserMath.Vector2 = new PhaserMath.Vector2(
        this.player.x,
        this.player.y,
      )
      // Calculate start and end angles for the attack arc based on player's last facing direction
      const baseAngle: number = this.lastPlayerDirection.angle() // Angle of the last movement direction
      const startAngle: number = baseAngle - PLAYER_ATTACK_ARC_ANGLE / 2
      const endAngle: number = baseAngle + PLAYER_ATTACK_ARC_ANGLE / 2

      // Draw the arc for visualization
      this.attackGraphics.slice(
        playerPos.x,
        playerPos.y,
        PLAYER_ATTACK_RANGE,
        startAngle,
        endAngle,
        false, // anticlockwise
      )
      this.attackGraphics.fillPath()

      // Iterate through active enemies to check for hits
      this.enemies.getChildren().forEach((enemyGO: GameObjects.GameObject) => {
        const enemy = enemyGO as GameObjectWithHealth // Cast to our interface
        if (!enemy.active || !enemy.body) return // Skip inactive/destroyed enemies or enemies without body

        const vecToEnemy: PhaserMath.Vector2 = new PhaserMath.Vector2(
          enemy.x - this.player.x,
          enemy.y - this.player.y,
        )
        const distToEnemy: number = vecToEnemy.length()

        // Check if enemy is within attack range
        if (distToEnemy <= PLAYER_ATTACK_RANGE) {
          const angleToEnemy: number = vecToEnemy.angle()
          // Check if enemy is within the attack arc using angular comparison
          let diffAngle: number = PhaserMath.Angle.Wrap(
            angleToEnemy - baseAngle,
          ) // Normalize angle difference
          if (Math.abs(diffAngle) <= PLAYER_ATTACK_ARC_ANGLE / 2) {
            this.damageEnemy(enemy, PLAYER_ATTACK_DAMAGE)
          }
        }
      })

      // Clear attack visual after a short duration
      this.time.delayedCall(
        PLAYER_ATTACK_DURATION,
        () => {
          if (this.attackGraphics) this.attackGraphics.clear()
        },
        [], // args
        this,
      )

      // Reset attack cooldown after specified time
      this.time.delayedCall(
        PLAYER_ATTACK_COOLDOWN,
        () => {
          this.canAttack = true
        },
        [], // args
        this,
      )
    }
  }

  damageEnemy(enemy: GameObjectWithHealth, amount: number): void {
    // Reduce enemy health
    let health: number =
      (enemy.getData('health') as number) || ENEMY_HEALTH_INITIAL // Get current health or default if not set
    health -= amount
    enemy.setData('health', health)

    // Visual feedback for hit enemy (tint red briefly)
    enemy.setTint(0xff0000) // Tint red
    this.time.delayedCall(
      100,
      () => {
        if (enemy.active) enemy.clearTint() // Clear tint if enemy is still active (not destroyed)
      },
      [], // args
      this,
    )

    if (health <= 0) {
      enemy.destroy() // Destroy enemy if health is depleted
    }
  }

  spawnEnemy(): void {
    // Do not spawn new enemies if the game is already over
    if (gameOverText && gameOverText.visible) return // Check if gameOverText is defined

    // Determine spawn position (randomly from one of the four screen edges)
    const edge: number = PhaserMath.Between(0, 3) // 0: top, 1: bottom, 2: left, 3: right
    let x: number, y: number
    const offset: number = ENEMY_SIZE * 2 // Spawn slightly off-screen to avoid popping in

    switch (edge) {
      case 0: // Top edge
        x = PhaserMath.Between(0, SCREEN_WIDTH)
        y = -offset
        break
      case 1: // Bottom edge
        x = PhaserMath.Between(0, SCREEN_WIDTH)
        y = SCREEN_HEIGHT + offset
        break
      case 2: // Left edge
        x = -offset
        y = PhaserMath.Between(0, SCREEN_HEIGHT)
        break
      case 3: // Right edge
        x = SCREEN_WIDTH + offset
        y = PhaserMath.Between(0, SCREEN_HEIGHT)
        break
      default: // Should not happen
        x = 0
        y = 0
        break
    }

    const enemy = this.enemies.create(
      x,
      y,
      'enemyTexture',
    ) as GameObjectWithHealth
    if (!enemy) return // Guard if creation failed

    enemy.setCircle(ENEMY_SIZE) // Circular physics body
    enemy.setCollideWorldBounds(false) // Allow spawning outside and moving in
    enemy.setData('health', ENEMY_HEALTH_INITIAL) // Set initial health

    // Make enemy move towards the core object
    if (this.core && enemy.body) {
      // Ensure core and enemy body exist
      this.physics.moveToObject(enemy, this.core, ENEMY_SPEED)
    }
  }

  updateEnemiesDirection(): void {
    // This function ensures enemies continue to move towards the core.
    this.enemies.getChildren().forEach((enemyGO: GameObjects.GameObject) => {
      const enemy = enemyGO as GameObjectWithHealth
      if (enemy.active && enemy.body) {
        // Ensure enemy is active and has a body
        // Check if the enemy has a body and if it's moving, to avoid errors if it was just destroyed
        // Also ensure this.core is available.
        if (
          this.core &&
          (enemy.body.velocity.x !== 0 || enemy.body.velocity.y !== 0)
        ) {
          this.physics.moveToObject(enemy, this.core, ENEMY_SPEED)
        }
      }
    })
  }

  enemyHitCore(core: unknown, enemy: unknown): void {
    const coreSprite = core as GameObjectWithHealth // Cast to our specific type
    const enemySprite = enemy as GameObjectWithHealth

    // Callback function for when an enemy overlaps/collides with the core.
    if (!enemySprite.active || !coreSprite.active) return // Safety check

    const currentCoreHealth: number =
      (coreSprite.getData('health') as number) || 0
    coreSprite.setData('health', currentCoreHealth - ENEMY_DAMAGE_TO_CORE) // Reduce core health

    // Visual feedback for core taking damage (brief tint)
    coreSprite.setTint(0xff6666) // Tint light red
    this.time.delayedCall(
      150,
      () => {
        if (coreSprite.active) coreSprite.clearTint() // Clear tint if core is still active
      },
      [], // args
      this,
    )

    enemySprite.destroy() // Enemy is destroyed upon hitting the core

    // Check again for game over, as core health might drop to 0 here
    if (coreSprite.getData('health') <= 0) {
      this.triggerGameOver()
    }
  }

  triggerGameOver(): void {
    // Handles the game over state.
    if (gameOverText && gameOverText.visible) return // Prevent multiple calls and check if defined

    if (gameOverText) gameOverText.setVisible(true) // Display the "GAME OVER" message
    this.physics.pause() // Stop all physics interactions and movement in the scene

    if (this.player && this.player.body) {
      // Check if player and its body exist
      this.player.setVelocity(0) // Stop player explicitly
    }

    // Disable player input (optional, as physics pause largely handles preventing movement)
    if (this.input && this.input.keyboard) {
      this.input.keyboard.enabled = false
    }

    // Stop the enemy spawner timer event to prevent new enemies from spawning
    // Find the specific event. This is a bit brittle. A better way is to store the TimerEvent instance.

    // const spawnerEvent = this.time.events.find(
    //   (event: Time.TimerEvent) => event.callback === this.spawnEnemy,
    // )
    // if (spawnerEvent) {
    //   spawnerEvent.remove(false) // Remove the timer event
    // }

    if (instructionsText) instructionsText.setVisible(false) // Hide instructions on game over
  }
}
