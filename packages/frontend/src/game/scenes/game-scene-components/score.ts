import { GameScene } from '../game-scene';

export const createScore = (gamescene: GameScene) => {
  // tslint:disable-next-line:prefer-template
  gamescene.scoreGameObject = gamescene.add
    .text(
      30,
      30,
      // tslint:disable-next-line:prefer-template
      (`Score: ${gamescene.score}` as unknown) as string,
    )
    .setScrollFactor(0);
  if (gamescene.highScore !== -1) {
    gamescene.highScoreGameObject = gamescene.add.text(30, 10, (`Highscore: ${gamescene.highScore}` as unknown) as string).setScrollFactor(0);
  }
};

export const uploadScore = (name: string, score: number, gamescene: GameScene) => {
  const guestMode = `${localStorage.getItem('GuestCheck')}`;
  const jwtToken = `${localStorage.getItem('auth-token')}`;
  if (guestMode !== 'true' && gamescene.score > gamescene.highScore) {
    // update highscore in localstorage
    localStorage.setItem('highScore', gamescene.score.toString(10));
    gamescene.gameRoom.then((room) => {
      room.send('setHighScore', jwtToken);
      room.onMessage('updatedHS', () => {
        room.leave();
      });
    });
  }
  // leave the room so the ship is removed in everyone's game
  gamescene.gameRoom.then((room) => {
    room.leave();
  });
};
