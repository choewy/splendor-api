import { DefaultEventsMap, RemoteSocket, Socket } from 'socket.io';

import { GameSocketData } from './class/game-socket-data';

export type GameSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, GameSocketData>;
export type GameRemoteSocket = RemoteSocket<DefaultEventsMap, GameSocketData>;
