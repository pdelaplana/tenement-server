import * as express from 'express';
import { DeleteUnitCommandPayload, DeleteUnitCommand } from '../../application/commands/delete-unit-command';
import { NewUnitCommand, NewUnitCommandPayload } from '../../application/commands/new-unit-command';
import { UpdateUnitCommand, UpdateUnitCommandPayload } from '../../application/commands/update-unit-command';
import { unitDTO } from '../../application/dtos/unit-dto';
import { GetUnitsQuery, GetUnitsQueryParams } from '../../application/queries/get-units-query';
import { unitRepository } from '../../dependency-factory';
import { authenticate } from '../middlewares/authenticate';
import { buildContext } from '../middlewares/build-context';

export const unitsController = (db: FirebaseFirestore.Firestore ) => {
  const router = express.Router({ mergeParams: true });

  router.post('/',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[POST] units');
        try {
          const propertyId = request.params.propertyId;
          const payload: NewUnitCommandPayload = request.body;
          const command = new NewUnitCommand(
              payload,
              unitRepository(db, request.context, propertyId)
          );
          const result = await command.dispatch();
          if (result === null) {
            throw new Error('Unit not added');
          }
          response.status(200).json(unitDTO(result.unit));
        } catch (error) {
          console.error('[POST] units', error.toString());
          response.status(400).send(error);
        }
      }
  );

  router.get('/',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[GET] units');
        try {
          const propertyId = request.params.propertyId;
          const params: GetUnitsQueryParams = {
            id: request.query.id as string,
          };
          const query = new GetUnitsQuery(params, unitRepository(db, request.context, propertyId));
          const result = await query.execute();
          console.debug('[GET] units', JSON.stringify(result));

          response.status(200).json(result?.map((unit) => {
            return unitDTO(unit);
          }
        ));
        } catch (error) {
          console.error('[GET] units', error);
          response.status(500).send(error);
        }
      },
  );

  router.delete('/:id',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[DELETE] units');
        try {
          const propertyId = request.params.propertyId;
          const payload: DeleteUnitCommandPayload = {
            id: request.params.id,
          };
          const command = new DeleteUnitCommand(payload, unitRepository(db, request.context, propertyId));
          const result = await command.dispatch();
          response.status(200).json(result);
        } catch (error) {
          console.error('[DELETE] units', error);
          response.status(500).send(error);
        }
      },
  );

  router.put('/',
      authenticate(),
      buildContext(db),
      async (request, response) => {
        console.info('[PUT] units');
        try {
          const propertyId = request.params.propertyId;
          const payload: UpdateUnitCommandPayload = request.body;
          const command = new UpdateUnitCommand(
              payload,
              unitRepository(db, request.context, propertyId)
          );
          const result = await command.dispatch();
          if (result === null) throw Error('Unit not updated');

          response.status(200).json(unitDTO(result.unit));
        } catch (error) {
          console.error('[PUT] units', JSON.stringify(error));
          response.status(400).send(error);
        }
      }
  );

  return router;
};
