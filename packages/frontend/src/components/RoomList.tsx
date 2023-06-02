import React from 'react';
import styled from 'styled-components';

export const FlexRowName = styled.div`
  width: 45%;
  font-size: 1rem;
  white-space: nowrap;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: left;
  padding: 0.5em 0.5em;
  margin: 0;
  color: ${(props) => props.theme.colors.createdRooms};
`;

export const FlexRowPlayers = styled.div`
  width: 55%;
  font-size: 1rem;
  white-space: nowrap;
  overflow-y: auto;
  overflow-x: auto;
  text-align: left;
  padding: 0.5em 0.5em;
  margin: 0;
  color: ${(props) => props.theme.colors.createdRooms};
`;

export const FlexRowButton = styled.div`
  width: 5%;
  font-size: 1rem;
  white-space: wrap;
  text-align: right;
  padding: 1em 1em;
  margin: 0;
`;

export const RoomItemStyle = styled.div`
  display: flex;
  flex-flow: row wrap;
  border-left: solid 1px;
  transition: 0.5s;
  border-top: solid 1px;
  border-right: solid 1px;
  border-bottom: solid 1px;
  width: 32%;
  height: 49%;
  margin: 1px;
  &:hover,
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const RoomContainer = styled.div`
  display: flex;
  opacity: 0.5;
  flex-flow: row wrap;
  justify-content: flex-start;
  flex-grow: 1;
  width: 100%;
  overflow: auto;
  ${RoomItemStyle}:nth-child(even) {
    background: white;
  }
  ${RoomItemStyle}:nth-child(odd) {
    background: grey;
  }
`;

export type RoomItemProps = {
  roomid: string;
  clients: number;
  maxClients: number;
  maxAstroids: number;
  maxEnemys: number;
  map: number;
};

function joinOrNot(clients: number, maxClients: number, roomid: string) {
  if (clients < maxClients) {
    return <a href={`/game?g=${roomid}`}>Join</a>;
  }
  return <p>Full!</p>;
}

const returnMapName = (mapId: number) => {
  const id: number = mapId;

  if (id === 1) {
    return 'Retro';
  }
  if (id === 2) {
    return 'Galaxy';
  }
  if (id === 3) {
    return 'Moon';
  }
};

export const RoomItem: React.FC<RoomItemProps> = ({ roomid, clients, maxClients, maxAstroids, maxEnemys, map }) => {
  return (
    <RoomItemStyle
      css={`
        &:hover,
        &:focus {
          transform: translateY(-2px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
      `}
    >
      <FlexRowName>{roomid}</FlexRowName>
      <FlexRowPlayers>
        <p>
          {clients}/{maxClients}
        </p>
        <p>maxAstroids: {maxAstroids}</p>
        <p>maxEnemys: {maxEnemys}</p>
        <p>Map: {returnMapName(map)}</p>
      </FlexRowPlayers>
      <FlexRowButton>{joinOrNot(clients, maxClients, roomid)}</FlexRowButton>
    </RoomItemStyle>
  );
};
