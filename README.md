# spaceplayer

## Developer Names:

- Alex Rothauge
- Redwan Obid
- Jann Karsten
- John Fleischhacker
- Dominik Robin Esser

## Deployment

The current state of Master in running on [spaceplayer.ga](http://spaceplayer.ga). We Deployed our Application using Google Cloud. There we have a simple e2-standard Virtual Machine with ubuntu running. On this we basically performed the same steps as described in **local dev Setup**. We have no automatic deployment via git ci.

## local dev setup

To make the project running you want to perform the following steps:
Create environment file, you can Change the values if you want so,
but it is not necessary

- `cp ./infra/env_vars/.env.example ./infra/env_vars/.env`

#### Install npm packages for backend and frontend

- `docker-compose run backend npm install`
- `docker-compose run frontend npm install`

#### Start containers

- `docker-compose up` / `docker-compose up -d`

#### Sync database schema

- `docker-compose exec backend npm run typeorm schema:sync`

_the application should now be up and running, you can access the frontend via `localhost:3000/`, the backend API is running on `localhost:4000/api` and the game Server is running on `localhost:5000`._

#### Run backend tests

- `docker-compose exec backend npm run test`

#### Run frontend tests

- `docker-compose exec frontend npm run test`

#### Run End To End tests

- `cd .\packages\cypress\`
- `npm install`
- `npm run cypress`

## 🕹️ Playing

Want to play right away? You can play the game by following (and sharing) this link https://spaceplayer.ga

**Game principles**

1. Every player is positioned randomly on the map
2. You can increase your score by shooting Astroids, Jellyfish or taking down other player
3. There is a chance to drop one of 4 different Powerups while shooting Astroids or Jellyfish
4. Every shoot costs 50 Shooting Power which is regenarated over time
5. You lose HP by colliding with Astroids, Jellyfish or getting Shot

You can see a very small amount of gameplay below:

![Alt Text](https://media.giphy.com/media/6cyZDIEmTigNSrDOj1/giphy.gif)

**Movements**

- Move: <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> or <kbd>↑</kbd> <kbd>←</kbd> <kbd>→</kbd>.
- Shoot: <kbd>Space</kbd>

**Powerups**

- ![](https://i.postimg.cc/8Chx0b5Y/packages-frontend-assets-sprites-power-up-energy.png) Restores 200 Shooting Power
- ![](https://i.postimg.cc/nz2gHcqY/packages-frontend-assets-sprites-power-up-heart.png) Restores 30 HP
- ![](https://i.postimg.cc/brvMdcTX/packages-frontend-assets-sprites-power-up-shield.png) Gives you a shield for 5 Seconds which makes you invincible
- ![](https://i.postimg.cc/NMBZqr2j/packages-frontend-assets-sprites-power-up-shooting.png) Increases your shooting speed for a short time

## API-Endpoints

- **All URIs are relative to** http://localhost:${Port}/api (_the Port you define in the [.env-file](https://code.fbi.h-da.de/istdoesse/spaceplayer/-/blob/master/infra/env_vars/.env.example)_)
- **All endpoints require authorization.**

| Method           | HTTP request        | Description                                          |
| ---------------- | ------------------- | ---------------------------------------------------- |
| **getUser**      | **GET**/user        | Return a certain user                                |
| **patchUser**    | **PATCH**/user      | Updates a certain user                               |
| **registerUser** | **POST**/user       | Create a user                                        |
| **loginUser**    | **POST**/user/token | Return a valid token if the user is authorized       |
| **getAllUsers**  | **GET**/user/users  | Return the first 8 users ordered by their high score |

## Frontend

This is a list of all the functions the frontend provides.

|        Feature         |                                                           How to use                                                            |                                                                                                                                            Description                                                                                                                                             |
| :--------------------: | :-----------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    Play as a guest     |                           Enter a User Name and Click the "Go to play" button at the mid of the page                            |                                   If you play as a guest you get immediately into the game page where you can create or join a game room. While you are playing as a guest you are not able to see the Highscore-List. This is only provided for registred users                                   |
| Register a new account |                       Go to the register formular. Enter your user name and password and click "Register"                       |                                                                                                           In this formular you can register a new accout with a user name and a password                                                                                                           |
| Login to your account  |                          Go to the login formular. Enter your user name and password and click "Login"                          |                                                                                        In this formular you can login to your existing account. If the account does not exist you will get an error message                                                                                        |
|      Switch Theme      |                                    Click the Dark/Light Theme Button at the top left corner                                     |                                                                          With this button you can swith between two themes. A Dark Theme and a Light Theme. The user Interface colors get updated according to the Theme.                                                                          |
|     Highscore-List     |                                    Login to your registred account to see the Highscore List                                    |                                                            The Highscore-List displays the Top 10 Highscores of all registred Users. If you are playing as a guest you can't submit you highscore and you can't see the Highscore-List                                                             |
|    Create Game Room    |      Enter "Max Clients", "Max Astroids", "Max Enemys" and choose a map from the select and click the button "Create Room"      | In this formular you can configure and create a new game room. You can limit the count of players who can join the room, define how many astriods and enemys should be in the game and choose one between three maps. If you are creating a new gane room you will automatically joining this room |
|     Join Game Room     | On the right of the page you can see existing rooms. If a room is existing click the "Join" button in the card to join the room |                                                                       You can join every room you see on your Homepage which is not full. By clicking the join room button you are joining the room and the game will start.                                                                       |
|         Logout         |                             click the "Logout" button on the top left corner below the Theme Button                             |                                                                                            Returns you to the formular where you can either play as a guest, register or login to you existing account                                                                                             |

## Sound sources

- Background music
  [https://freesound.org/people/Romariogrande/sounds/396231/](https://freesound.org/people/Romariogrande/sounds/396231/)

- Shot
  [https://freesound.org/people/bolkmar/sounds/421704/](https://freesound.org/people/bolkmar/sounds/421704/)

- Gameover
  [https://freesound.org/people/Kastenfrosch/sounds/113988/](https://freesound.org/people/Kastenfrosch/sounds/113988/)<br>
  [https://freesound.org/people/cheesepuff/sounds/110216/](https://freesound.org/people/cheesepuff/sounds/110216/)

- Asteroid explosion
  [https://freesound.org/people/V-ktor/sounds/435414/](https://freesound.org/people/V-ktor/sounds/435414/)

- Ship explosion
  [https://freesound.org/people/deleted_user_5405837/sounds/399303/](https://freesound.org/people/deleted_user_5405837/sounds/399303/)

- Jellyfish
  [https://freesound.org/people/awhhhyeah/sounds/448258/](https://freesound.org/people/awhhhyeah/sounds/448258/)

## Animation sources

- Jellyfish
  [https://www.gamedevmarket.net/asset/space-shooter-1-5280/](https://www.gamedevmarket.net/asset/space-shooter-1-5280/)

- Jellyfish died
  [https://www.pngjoy.com/preview/p4s0b1t5b8t3x1_green-explosion-damage-effect-sprite-sheet-png-download/](https://www.pngjoy.com/preview/p4s0b1t5b8t3x1_green-explosion-damage-effect-sprite-sheet-png-download/)

- Ship
  [https://www.clipartkey.com/view/iRhiwi_8-bit-spaceship-png-8-bit-spaceship-sprites/](https://www.clipartkey.com/view/iRhiwi_8-bit-spaceship-png-8-bit-spaceship-sprites/)

- Ship explosion
  [https://www.pngwing.com/en/free-png-plgdq](https://www.pngwing.com/en/free-png-plgdq)

- Asteroid
  [https://opengameart.org/content/brown-asteroid](https://opengameart.org/content/brown-asteroid)

- Asteroid explosion
  [https://www.pngitem.com/middle/hbhxbwb_explosion-sprite-sheet-free-hd-png-download/](https://www.pngitem.com/middle/hbhxbwb_explosion-sprite-sheet-free-hd-png-download/)

- Fog boundary
  [https://imgbin.com/png/G0JdRDez/particle-system-texture-mapping-animation-2d-computer-graphics-png](https://imgbin.com/png/G0JdRDez/particle-system-texture-mapping-animation-2d-computer-graphics-png)

- Background: Retro
  [https://8bitweapon.com/8-bit-weapon-bits-with-byte-background-png/](https://8bitweapon.com/8-bit-weapon-bits-with-byte-background-png/)

- Background: Galaxy
  [https://www.freepik.com/free-photo/3d-render-solar-system-background-with-colourful-nebula_10167213.htm](https://www.freepik.com/free-photo/3d-render-solar-system-background-with-colourful-nebula_10167213.htm)

- Background: Moon
  [https://www.freepik.com/free-photo/fictional-space-background-with-meteorites_1857790.htm](https://www.freepik.com/free-photo/fictional-space-background-with-meteorites_1857790.htm)
