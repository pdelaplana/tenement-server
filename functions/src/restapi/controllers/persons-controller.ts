import * as express from 'express';
import { DeletePersonCommand, DeletePersonCommandPayload } from '../../application/commands/delete-person-command';
import { NewPersonCommand, NewPersonCommandPayload } from '../../application/commands/new-person-command';
import { UpdatePersonCommand, UpdatePersonCommandPayload } from '../../application/commands/update-person-command';
import { personDTO } from '../../application/dtos/person-dto';
import { GetPersonsQuery, GetPersonsQueryParams } from '../../application/queries/get-persons-query';
import { personRepository } from '../../dependency-factory';
import { authenticate } from '../middlewares/authenticate';
import { buildContext } from '../middlewares/build-context';

export const personsController = (db: FirebaseFirestore.Firestore ) => {
  const router = express.Router();

  router.get('/',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[GET] persons');
        try {
          const params: GetPersonsQueryParams = {
            id: request.query.id as string,
          };
          const query = new GetPersonsQuery(params, personRepository(db, request.context));
          const result = await query.execute();
          console.debug('[GET] developers', JSON.stringify(result));

          response.status(200).json(result?.map((person) => {
            return personDTO(person);
          }));
        } catch (error) {
          console.error('[GET] properties', error);
          response.status(500).send(error);
        }
      },
  );

  router.post('/',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[POST] persons');
        try {
          const payload: NewPersonCommandPayload = request.body;
          console.debug('payload', JSON.stringify(payload));
          const command = new NewPersonCommand(
              payload,
              personRepository(db, request.context)
          );
          const result = await command.dispatch();
          if (result === null) {
            throw new Error('Person not added');
          }

          response.status(200).json(personDTO(result.person));
        } catch (error) {
          console.error('[POST] persons', error);
          response.status(400).send( error );
        }
      }
  );

  router.put('/',
      authenticate(),
      buildContext(db),
      async (request, response) => {
        console.info('[PUT] persons');
        try {
          const payload: UpdatePersonCommandPayload = request.body;
          const command = new UpdatePersonCommand(
              payload,
              personRepository(db, request.context));
          const result = await command.dispatch();
          if (result === null) throw Error('Person not updated');

          response.status(200).json(personDTO(result.person));
        } catch (error) {
          console.error('[PUT] persons', JSON.stringify(error));
          response.status(400).send(error);
        }
      }
  );

  router.delete('/:id',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[DELETE] persons');
        try {
          const payload: DeletePersonCommandPayload = { id: request.params.id as string };
          const command = new DeletePersonCommand(payload, personRepository(db, request.context));
          const result = await command.dispatch();
          response.status(200).json(result);
        } catch (error) {
          console.error('[DELETE] persons', error);
          response.status(500).send(error);
        }
      },
  );

  return router;
};
