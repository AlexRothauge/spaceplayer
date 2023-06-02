import React from 'react';
import styled from 'styled-components';
import healthPowerup from '../../assets/sprites/power-up-heart.png';
import energyPowerup from '../../assets/sprites/power-up-energy.png';
import shieldPowerup from '../../assets/sprites/power-up-shield.png';
import shootingPowerup from '../../assets/sprites/power-up-shooting.png';

const P = styled.p`
  padding-left: 25px;
  font-size: 20px;
  font-family: 'Bradly Hand', cursive;
`;

const ListItem = styled.li`
  font-size: 20px;
  margin-left: 25px;
  font-family: 'Bradly Hand', cursive;
`;

const Title = styled.h2`
  font-family: 'Bradly Hand', cursive;
  padding-left: 10px;
`;

const List = styled.ul`
  padding-left: 25px;
`;

export const Tutorial = () => {
  return (
    <div>
      <Title>Game Tutorial</Title>
      <P>
        <b>Move:</b> W-A-D or Arrow Keys
      </P>
      <P>
        <b>Shoot:</b> Space to shoot
      </P>
      <P>
        <b>Score:</b> Your Score increases by destroying astriods, killing enemys or other player
      </P>
      <P>
        <b>SP:</b> Every bullet costs 50 Shoot Power, SP generates over time{' '}
      </P>
      <P>
        <b>Powerups:</b>{' '}
      </P>
      <List>
        <ListItem>
          <img src={healthPowerup} width="30" height="30" /> restores 30 HP
        </ListItem>
        <ListItem>
          <img src={shieldPowerup} width="30" height="30" /> Gives you a shield for 5 Seconds which make you invincible
        </ListItem>
        <ListItem>
          <img src={shootingPowerup} width="30" height="30" /> Increases your shooting speed
        </ListItem>
        <ListItem>
          <img src={energyPowerup} width="30" height="30" /> restores 200 Shooting Power
        </ListItem>
      </List>
    </div>
  );
};
