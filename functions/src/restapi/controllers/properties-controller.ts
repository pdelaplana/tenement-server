import * as express from 'express';
import { DeletePropertyCommand, DeletePropertyCommandPayload } from '../../application/commands/delete-property-command';
import { NewPropertyCommand, NewPropertyCommandPayload } from '../../application/commands/new-property-command';
import { UpdatePropertyCommand, UpdatePropertyCommandPayload } from '../../application/commands/update-property-command';
import { propertyDTO } from '../../application/dtos/property-dto';
import { GetPropertiesQuery, GetPropertiesQueryParams } from '../../application/queries/get-properties-query';
import { developerRepository, propertyRepository } from '../../dependency-factory';
import { authenticate } from '../middlewares/authenticate';
import { buildContext } from '../middlewares/build-context';
// import { validate } from '../middlewares/validate';
// import { validationRules } from '../middlewares/validation-rules';

export const propertiesController = (db: FirebaseFirestore.Firestore ) => {
  const server = express();

  server.post('/',
      authenticate(),
      buildContext(db),
      // validate(validationRules.newPropertyCommand),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[POST] properties');
        try {
          const payload: NewPropertyCommandPayload = request.body;
          console.debug('payload', JSON.stringify(payload));
          const command = new NewPropertyCommand(
              payload,
              propertyRepository(db, request.context),
              developerRepository(db, request.context)
          );
          const result = await command.dispatch();
          if (result === null) {
            throw new Error('Property not added');
          }
          response.status(200).json(propertyDTO(result.property));
        } catch (error) {
          console.error('[POST] properties', error.toString());
          response.status(400).send(error);
        }
      }
  );

  server.get('/',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[GET] properties');
        try {
          const params: GetPropertiesQueryParams = {
            id: request.query.id as string,
          };
          const query = new GetPropertiesQuery(params, propertyRepository(db, request.context));
          const result = await query.execute();
          console.debug('[GET] properties', JSON.stringify(result));

          response.status(200).json(result?.map((property) => {
            return propertyDTO(property);
          }
        ));
        } catch (error) {
          console.error('[GET] properties', error);
          response.status(500).send(error);
        }
      },
  );

  server.delete('/',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[DELETE] property');
        try {
          const payload: DeletePropertyCommandPayload = request.body;
          const command = new DeletePropertyCommand(payload, propertyRepository(db, request.context));
          await command.dispatch();
          response.status(200);
        } catch (error) {
          console.error('[DELETE] organization', error);
          response.status(500).send(error);
        }
      },
  );

  server.put('/',
      authenticate(),
      buildContext(db),
      async (request, response) => {
        console.info('[PUT] properties');
        try {
          const payload: UpdatePropertyCommandPayload = request.body;
          const command = new UpdatePropertyCommand(
              payload,
              propertyRepository(db, request.context),
              developerRepository(db, request.context));
          const result = await command.dispatch();
          if (result === null) throw Error('Property not updated');

          response.status(200).json(propertyDTO(result.property));
        } catch (error) {
          console.error('[PUT] properties', JSON.stringify(error));
          response.status(400).send(error);
        }
      }
  );

  return server;
};
