const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Death',
};

export interface UserInfo {
  userName: string;
  score: number;
  highScore: number;
}

export class DeathScene extends Phaser.Scene {
  private score: number = 0;
  private highScore: number = 0;
  private userName: string = '';
  constructor() {
    super(sceneConfig);
  }

  public init(data: UserInfo) {
    this.score = data.score;
    this.userName = data.userName;
    this.highScore = data.highScore;
  }

  public create() {
    const font = 'Courier';
    // font size in px
    const fontSizeTitle = 64;
    const fontTitle = `${fontSizeTitle.toString(10)}px ${font}`;
    this.add.text(0, 0, 'You Died!', {
      align: 'center',
      font: fontTitle,
      color: '#ff0000',
      padding: { top: this.game.canvas.height / 3 - 64 },
      fixedWidth: this.game.canvas.width,
    });

    const fontSizeScore = 64;
    const fontScore = `${fontSizeScore.toString(10)}px ${font}`;
    this.add.text(0, 0, `score: ${this.score}`, {
      align: 'center',
      font: fontScore,
      color: '#ff0000',
      padding: { top: this.game.canvas.height / 2 - 96 },
      fixedWidth: this.game.canvas.width,
    });

    const fontSizeNewHigh = 32;
    const fontNewHigh = `${fontSizeNewHigh.toString(10)}px ${font}`;
    if (this.score > this.highScore) {
      this.add.text(0, 0, `new HighScore`, {
        align: 'center',
        font: fontNewHigh,
        color: '#00ff00',
        padding: { top: this.game.canvas.height / 2 - 32 },
        fixedWidth: this.game.canvas.width,
      });
    }

    const buttonDistanceTop = this.game.canvas.height / 2 + 32;
    const buttonDistanceSide = this.game.canvas.width / 3;
    const width = this.game.canvas.width;
    // font size in px
    const fontSizeButtons = 32;
    const fontButtons = `${fontSizeButtons.toString(10)}px ${font}`;
    // these values are tested i couldn't find a way to get the texts actual width while using fixedwidth in style
    const textWidthRespawn = 190;
    const textWidthHome = 75;

    const buttonHome = this.add.text(0, 0, 'Home', {
      align: 'left',
      font: fontButtons,
      color: '#ffffff',
      padding: { top: buttonDistanceTop, left: buttonDistanceSide },
      fixedWidth: width,
    });

    const buttonRespawn = this.add.text(0, 0, 'Play Again', {
      align: 'right',
      font: fontButtons,
      color: '#ffffff',
      padding: { top: buttonDistanceTop, right: buttonDistanceSide },
      fixedWidth: width,
    });
    // i had to make this more complicated than needed because i didnt want to have hardcoded positions for the text
    // because of the padding and the fixedwidth the whole screen would have been clickable so i had to define the
    // Area with hitArea

    buttonHome
      .setInteractive({
        useHandCursor: true,
        hitArea: new Phaser.Geom.Rectangle(buttonDistanceSide, buttonDistanceTop, textWidthHome, fontSizeButtons),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      })
      .on('pointerdown', () => {
        const url: string = window.location.href;
        const splitted = url.split('/');
        window.localStorage.setItem('enableTheme', 'true');
        window.location.replace(`${splitted[0]}//${splitted[2]}/`);
      });

    buttonRespawn
      .setInteractive({
        useHandCursor: true,
        hitArea: new Phaser.Geom.Rectangle(width - (buttonDistanceSide + textWidthRespawn), buttonDistanceTop, textWidthRespawn, fontSizeButtons),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      })
      .on('pointerdown', () => {
        console.log('respawn');
        window.location.replace(window.location.href);
      });
  }
}
