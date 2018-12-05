// import express from 'express';
import {inject, injectable} from 'inversify';
import SocketServer, {Socket} from 'socket.io';
import {Server} from 'http';

import {DI_TYPES} from '../utility/di.symbols';
import {Express} from 'express';
import {IGameBoardFactory} from '../domain/game-board-factory.interface';
import {INewGameCommand, NewGameCommand} from '../domain/commands/new-game-command.value';
import {transformAndValidateSync} from 'class-transformer-validator';
import {IGameBoard} from '../domain/game-board.interface';
import {IMakeMoveCommand} from '../domain/commands/make-move-command.value';
import {ErrorCode} from '../domain/events/error-code.enum';

@injectable()
export class MinesweeperApp
{
   constructor(
      @inject(DI_TYPES.Express) private readonly app: Express,
      @inject(DI_TYPES.GameBoardFactory) private readonly gameFactory: IGameBoardFactory
   ) {}

   run(): void
   {
      // this.app.use(session({
      //    secret: '343ji43j4n3jn4jk3n',
      //    resave: true,
      //    saveUninitialized: false
      // }));

      // this.app.get('/game', (_req, _res, _next) => {
         // req.session
      // })

      const server = new Server(this.app);
      const io = SocketServer(server);

      server.listen(8000);

      this.app.get('/', function (_req, res, _next) {
         res.sendFile(__dirname + '/index.html');
      });

      const gameNs = io.of('minesweeper');
      gameNs.on('connection', (_socket: Socket) => {
         let game: IGameBoard | undefined = undefined;

         gameNs.on('createGame', (cid: string, data: INewGameCommand) => {
            console.log(data);
            const command: NewGameCommand = transformAndValidateSync(NewGameCommand, data);
            try {
               game = this.gameFactory.createBoard(
                  command.xSize, command.ySize, command.mineCount);
               gameNs.emit('gameCreated', cid)
            } catch (err) {
               gameNs.emit('error', cid, err);
            }
         });

         gameNs.on('makeMove', (cid: string, data: IMakeMoveCommand) => {
            console.log(data);
            if (! game) {
               gameNs.emit(
                  'error', cid,
                  {errorCode: ErrorCode.NO_GAME_ACTIVE, message: 'Start a game before moving'}
               );
            } else {
               try {
                  const result = game.makeMove(data.moveId, data.xCell, data.yCell);
                  gameNs.emit('moveMade', cid, result);
               } catch (err) {
                  gameNs.emit('error', cid, err);
               }
            }
         })
      });
   }
}
