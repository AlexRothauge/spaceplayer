import { getGameWidth, getGameHeight } from '../helpers';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Boot',
};

/**
 * The initial scene that loads all necessary assets to the game and displays a loading bar.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super(sceneConfig);
  }

  public preload(): void {
    const halfWidth = getGameWidth(this) * 0.5;
    const halfHeight = getGameHeight(this) * 0.5;

    const progressBarHeight = 100;
    const progressBarWidth = 400;

    const progressBarContainer = this.add.rectangle(halfWidth, halfHeight, progressBarWidth, progressBarHeight, 0x000000);
    const progressBar = this.add.rectangle(halfWidth + 20 - progressBarContainer.width * 0.5, halfHeight, 10, progressBarHeight - 20, 0x888888);

    const loadingText = this.add.text(halfWidth - 75, halfHeight - 100, 'Loading...').setFontSize(24);
    const percentText = this.add.text(halfWidth - 25, halfHeight, '0%').setFontSize(24);
    const assetText = this.add.text(halfWidth - 25, halfHeight + 100, '').setFontSize(24);

    this.load.on('progress', (value: number) => {
      progressBar.width = (progressBarWidth - 30) * value;

      const percent = value * 100;
      percentText.setText(`${percent}%`);
    });

    this.load.on('complete', () => {
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      progressBar.destroy();
      progressBarContainer.destroy();

      this.scene.start('Game');
    });

    this.loadAssets();
  }

  /**
   * All assets that need to be loaded by the game (sprites, images, animations, tiles, music, etc)
   * should be added to this method. Once loaded in, the loader will keep track of them, indepedent of which scene
   * is currently active, so they can be accessed anywhere.
   */
  private loadAssets() {
    // Load assets
    this.load.image('ship', 'assets/sprites/8bit-spaceship.png');
    this.load.image('asteroid', 'assets/sprites/asteroid-brown.png');
    this.load.image('bullet', 'assets/sprites/phaser-bullet.png');
    this.load.image('bullet', 'assets/sprites/phaser-bullet.png');

    this.load.image('background1', 'assets/sprites/star-background.png');
    this.load.image('background2', 'assets/sprites/star-background-galaxy.jpg');
    this.load.image('background3', 'assets/sprites/moon.jpg');
    this.load.image('jellyEnemy', 'assets/sprites/jellyEnemy.png');
    this.load.image('powerUpHeart', 'assets/sprites/power-up-heart.png');
    this.load.image('powerUpShield', 'assets/sprites/power-up-shield.png');
    this.load.image('powerUpShooting', 'assets/sprites/power-up-shooting.png');
    this.load.image('powerUpEnergy', 'assets/sprites/power-up-energy.png');
    this.load.image('shield', 'assets/sprites/shield.png');

    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');

    this.load.spritesheet('fog', 'assets/sprites/fog.png', {
      frameWidth: 256,
      frameHeight: 256,
    });

    this.load.spritesheet('astExplosion', 'assets/sprites/asteroidExplosion.png', {
      frameWidth: 123,
      frameHeight: 114,
    });
    this.load.spritesheet('shipExplosionAnimation', 'assets/sprites/ship_explosion.png', {
      frameWidth: 96,
      frameHeight: 93,
    });

    this.load.spritesheet('jellyfishDied', 'assets/sprites/jelly_fish_died.png', { frameWidth: 100, frameHeight: 100 });
    // Load audio
    this.load.audio('backgroundSound', 'assets/sounds/396231__romariogrande.mp3');
    this.load.audio('shot', 'assets/sounds/421704_bolkmar_sfx-laser-shoot-02.mp3');
    this.load.audio('asteroidExplosion', 'assets/sounds/435414_v-ktor_explosion11.mp3');
    this.load.audio('jellyfishDiedSound', 'assets/sounds/448258__awhhhyeah__yoshi.mp3');
    this.load.audio('shipExplosion', 'assets/sounds/399303__deleted-user-5405837__explosion-012.mp3');
    this.load.audio('gameOver', 'assets/sounds/113988__kastenfrosch__verloren.mp3');
    this.load.audio('gameOverMusic', 'assets/sounds/110216__cheesepuff__sad-song.mp3');
  }
}
