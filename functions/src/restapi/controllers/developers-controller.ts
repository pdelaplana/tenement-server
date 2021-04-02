import * as express from 'express';
import { DeleteDeveloperCommand, DeleteDeveloperCommandPayload } from '../../application/commands/delete-developer-command';
import { NewDeveloperCommand, NewDeveloperCommandPayload } from '../../application/commands/new-developer-command';
import { UpdateDeveloperCommand, UpdateDeveloperCommandPayload } from '../../application/commands/update-developer-command';
import { developerDTO } from '../../application/dtos/developer-dto';
import { GetDevelopersQuery, GetDevelopersQueryParams } from '../../application/queries/get-developers-query';
import { developerRepository } from '../../dependency-factory';
import { authenticate } from '../middlewares/authenticate';
import { buildContext } from '../middlewares/build-context';

export const developersController = (db: FirebaseFirestore.Firestore ) => {
  const server = express();

  server.get('/',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[GET] developers');
        try {
          const params: GetDevelopersQueryParams = {
            id: request.query.id as string,
          };
          const query = new GetDevelopersQuery(params, developerRepository(db, request.context));
          const result = await query.execute();
          console.debug('[GET] developers', JSON.stringify(result));

          response.status(200).json(result?.map((developer) => {
            return developerDTO(developer);
          }
    ));
        } catch (error) {
          console.error('[GET] properties', error);
          response.status(500).send(error);
        }
      },
  );

  server.post('/',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[POST] developers');
        try {
          const payload: NewDeveloperCommandPayload = request.body;
          console.debug('payload', JSON.stringify(payload));
          const command = new NewDeveloperCommand(
              payload,
              developerRepository(db, request.context)
          );
          const result = await command.dispatch();
          if (result === null) {
            throw new Error('Developer not added');
          }

          response.status(200).json(developerDTO(result.developer));
        } catch (error) {
          console.error('[POST] developers', error);
          response.status(400).send( error );
        }
      }
  );

  server.put('/',
      authenticate(),
      buildContext(db),
      async (request, response) => {
        console.info('[PUT] developers');
        try {
          const payload: UpdateDeveloperCommandPayload = request.body;
          const command = new UpdateDeveloperCommand(
              payload,
              developerRepository(db, request.context));
          const result = await command.dispatch();
          if (result === null) throw Error('Developer not updated');

          response.status(200).json(developerDTO(result.developer));
        } catch (error) {
          console.error('[PUT] developers', JSON.stringify(error));
          response.status(400).send(error);
        }
      }
  );

  server.delete('/:id',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[DELETE] developers');
        try {
          const payload: DeleteDeveloperCommandPayload = { id: request.params.id as string };
          const command = new DeleteDeveloperCommand(payload, developerRepository(db, request.context));
          const result = await command.dispatch();
          response.status(200).json(result);
        } catch (error) {
          console.error('[DELETE] developers', error);
          response.status(500).send(error);
        }
      },
  );

  return server;
};
