import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/Button';
import * as Colyseus from 'colyseus.js';
import { MapSchema } from '@colyseus/schema';
export type MyOptionType = { label: string; value: string };
import { RoomItem, RoomContainer } from '../../components/RoomList';
import { InputNumber } from '../../components/Input/InputNumber';
import { Layout } from '../../components/Layout';
import { authContext } from '../../contexts/AuthenticationContext';
import { Select } from '../../components/Input/Select';

export type User = {
  userName: string;
  highScore: number;
};
const Mask = styled.div`
  border-radius: 8px;
  padding: 20px 16px;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.075);
  background-color: ${(props) => props.theme.colors.inputBackgroundColor};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  min-height: 384px;
  width: 370px;
  line-height: 25.2px;
`;
const MaskHolder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: inherit;
  margin: 5px;
`;
const RoomMask = styled.div`
  border-radius: 8px;
  padding: 20px 16px;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.075);
  background-color: ${(props) => props.theme.colors.inputBackgroundColor};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  height: 500px;
  width: 630px;
  line-height: 25.2px;
`;
const RoomMaskHolder = styled.div`
  display: flex;

  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-height: inherit;
  margin: 5px;
`;
const LogoHolder = styled.div`
  color: ${(props) => props.theme.colors.fontColor};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 25px;
`;

const PlayerName = styled.p`
  font-size: 18px;
  color: ${(props) => props.theme.colors.fontColor};
  letter-spacing: 0.5px;
  text-align: center;
  font-family: 'Bradly Hand', cursive;
  flex: 1;
`;

export const UsersTable = styled.table`
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  box-shadow: 0 0.125em 0.25em 0 ${(props) => props.theme.colors.shadowColor};
`;
export const UserRow = styled.tr`
  nth-child(even) {
    background-color: ${(props) => props.theme.colors.backgroundColor};
  }
`;
export const UserHeadRow = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
`;
export const UserTD = styled.td`
  border: 1px solid #dddddd;
  text-align: left;
  padding: 12px;
  color: ${(props) => props.theme.colors.fontColor};
  &:hover {
    background-color: #ddd;
  }
`;

export const HeaderH2 = styled.h2`
  font-family: 'Bradly Hand', cursive;
  color: ${(props) => props.theme.colors.fontColor};
`;

export type colyGameRoom = {
  roomId: string;
  clients: number;
  maxClients: number;
  maxAstroids: number;
  maxEnemys: number;
  map: number;
};

type State = {
  players: MapSchema;
  // clients: number;
  maxClients: number;
  maxAstroids: number;
  maxEnemys: number;
  map: number;
};

export const HomePage = () => {
  window.document.title = 'Home Page';
  const [availableRooms, setAvailableRooms] = useState<colyGameRoom[]>([]);
  const [gameMap, setGameMap] = React.useState(1);
  const [client] = useState(new Colyseus.Client(`ws://${process.env.BACKEND_HOST}:5000`));
  const [mainRoomLobby] = useState(client.joinOrCreate('my_room'));
  const { token } = useContext(authContext);
  const [users, setUsers] = useState<User[]>([]);
  const fetchUsers = async () => {
    const usersRequest = await fetch('/api/user/users', {
      headers: { 'content-type': 'application/json', authorization: token! },
    });
    console.log(usersRequest);
    if (usersRequest.status === 200) {
      const usersJSON = await usersRequest.json();
      setUsers(usersJSON.data);
    }
  };
  useEffect(() => {
    callAllRooms();
    if (token) {
      fetchUsers();
    }
    getValuesFromLocalStorage();
    const interval = setInterval(() => {
      location.reload();
    }, 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  mainRoomLobby.then((room) => {
    // tslint:disable-next-line:ter-prefer-arrow-callback
    room.onMessage('rooms', (message: any) => {
      const jsonData = JSON.parse(message);
      const availableRoomscoly: colyGameRoom[] = [];
      const temp: MapSchema<colyGameRoom> = new MapSchema<colyGameRoom>(jsonData);
      temp.forEach((value: colyGameRoom, key: string) => {
        const newRoom: colyGameRoom = {
          roomId: key,
          clients: value.clients,
          maxClients: value.maxClients,
          maxAstroids: value.maxAstroids,
          maxEnemys: value.maxEnemys,
          map: value.map,
        };
        availableRoomscoly.push(newRoom);
      });
      setAvailableRooms(availableRoomscoly);
    });
  });

  const userName = window.localStorage.getItem('userName');

  const [fieldValuemaxClients, setfieldValuemaxClients] = useState<number>(32);
  const [fieldValuemaxAstroids, setfieldValuemaxAstroids] = useState<number>(20);
  const [fieldValuemaxEnemys, setfieldValuemaxEnemys] = useState<number>(10);
  useEffect(() => {
    if (fieldValuemaxClients > 32) {
      window.localStorage.setItem('maxClients', '32');
    } else {
      window.localStorage.setItem('maxClients', (fieldValuemaxClients as unknown) as string);
    }
  }, [fieldValuemaxClients]);
  useEffect(() => {
    if (fieldValuemaxAstroids > 100) {
      window.localStorage.setItem('maxAstroids', '100');
    } else {
      window.localStorage.setItem('maxAstroids', (fieldValuemaxAstroids as unknown) as string);
    }
  }, [fieldValuemaxAstroids]);
  useEffect(() => {
    if (fieldValuemaxEnemys > 50) {
      window.localStorage.setItem('maxEnemys', '50');
    } else {
      window.localStorage.setItem('maxEnemys', (fieldValuemaxEnemys as unknown) as string);
    }
  }, [fieldValuemaxEnemys]);
  useEffect(() => {
    window.localStorage.setItem('mypId', (gameMap as unknown) as string);
  }, [gameMap]);

  const callAllRooms = () => {
    mainRoomLobby.then((room) => {
      room.send('allrooms', '');
    });
  };

  const routeToGamePage = (groomID: string) => {
    window.location.href = `/game?g=${groomID}`;
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mainRoomLobby.then((lobbyroom) => {
      const gameroom: Promise<Colyseus.Room<State>> = client.create('game_room', {
        maxClients: fieldValuemaxClients,
        maxAstroids: fieldValuemaxAstroids,
        maxEnemys: fieldValuemaxEnemys,
        map: gameMap,
      });
      gameroom.then((groom) => {
        lobbyroom.send('created', {
          roomid: groom.id,
          maxClients: fieldValuemaxClients,
          maxAstroids: fieldValuemaxAstroids,
          maxEnemys: fieldValuemaxEnemys,
          map: gameMap,
        });
        routeToGamePage(groom.id);
      });
    });
  };

  const getValuesFromLocalStorage = () => {
    const mapId = window.localStorage.getItem('mypId');
    const maxValueClients = window.localStorage.getItem('maxClients');
    const maxValueAsteroids = window.localStorage.getItem('maxAstroids');
    const maxValueEnemys = window.localStorage.getItem('maxEnemys');
    if (mapId) {
      setGameMap(parseInt(mapId, 10));
    }
    if (maxValueClients) {
      setfieldValuemaxClients(parseInt(maxValueClients, 10));
    }
    if (maxValueAsteroids) {
      setfieldValuemaxAstroids(parseInt(maxValueAsteroids, 10));
    }
    if (maxValueEnemys) {
      setfieldValuemaxEnemys(parseInt(maxValueEnemys, 10));
    }
  };

  const changedFieldmaxClients = (e: ChangeEvent<HTMLInputElement>) => {
    setfieldValuemaxClients(parseInt(e.target.value, 10));
  };
  const changedFieldmaxAstroids = (e: ChangeEvent<HTMLInputElement>) => {
    setfieldValuemaxAstroids(parseInt(e.target.value, 10));
  };
  const changedFieldmaxEnemys = (e: ChangeEvent<HTMLInputElement>) => {
    setfieldValuemaxEnemys(parseInt(e.target.value, 10));
  };

  const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGameMap(+event.target.value); // '+' Converts string to Number
  };

  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {token && (
          <MaskHolder>
            <Mask>
              <HeaderH2>Highscore-Liste</HeaderH2>
              <UsersTable>
                <UserRow>
                  <UserHeadRow>Name</UserHeadRow>
                  <UserHeadRow>Score</UserHeadRow>
                </UserRow>
                {users.map((user) => (
                  <UserRow key={`${user.userName}row`}>
                    <UserTD key={`${user.userName}column`}>{user.userName}</UserTD>
                    <UserTD key={`${user.highScore}column`}>{user.highScore}</UserTD>
                  </UserRow>
                ))}
              </UsersTable>
            </Mask>
          </MaskHolder>
        )}
        <MaskHolder>
          <Mask>
            <LogoHolder>
              <Logo />
            </LogoHolder>

            <div id="rooms">
              <PlayerName>Hello {userName}</PlayerName>
              <HeaderH2>Game Setup</HeaderH2>
              <form onSubmit={onSubmitForm}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <InputNumber
                    id="inputmaxClients"
                    label="Max Clients:"
                    min="1"
                    max="32"
                    type="number"
                    value={fieldValuemaxClients}
                    onChange={changedFieldmaxClients}
                  />
                  <InputNumber
                    id="inputmaxAstroids"
                    label="Max Astroids:"
                    min="0"
                    max="100"
                    type="number"
                    value={fieldValuemaxAstroids}
                    onChange={changedFieldmaxAstroids}
                  />
                  <InputNumber
                    id="inputmaxEnemys"
                    label="Max Enemys:"
                    min="0"
                    max="50"
                    type="number"
                    value={fieldValuemaxEnemys}
                    onChange={changedFieldmaxEnemys}
                  />

                  <Select name="map" value={gameMap} onChange={handleMapChange}>
                    <option value={1}>Map: Retro</option>
                    <option value={2}>Map: Galaxy</option>
                    <option value={3}>Map: Moon</option>
                  </Select>
                </div>

                <Button type="submit">Create Room</Button>
              </form>
            </div>
          </Mask>
        </MaskHolder>
        <RoomMaskHolder>
          <RoomMask>
            <HeaderH2>Existing Rooms: {availableRooms.length}</HeaderH2>

            <RoomContainer>
              {availableRooms.map((room) => {
                return (
                  <RoomItem
                    key={room.roomId}
                    roomid={room.roomId}
                    clients={room.clients}
                    maxClients={room.maxClients}
                    maxAstroids={room.maxAstroids}
                    maxEnemys={room.maxEnemys}
                    map={room.map}
                  />
                );
              })}
            </RoomContainer>
          </RoomMask>
        </RoomMaskHolder>
      </div>
    </Layout>
  );
};
