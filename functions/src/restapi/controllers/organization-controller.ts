import * as express from 'express';

import { authenticate } from '../middlewares/authenticate';
import { buildContext } from '../middlewares/build-context';
import { GetOrganizationQueryParams, GetOrganizationQuery } from '../../application/queries/get-organization-query';
import { organizationRepository } from '../../dependency-factory';
import { DeleteOrganizationCommand, DeleteOrganizationCommandPayload } from '../../application/commands/delete-organization-command';
import { UpdateOrganizationCommand, UpdateOrganizationCommandPayload } from '../../application/commands/update-organization-command';
import { organizationDTO } from '../../application/dtos/organization-dto';


export const organizationController = (db: FirebaseFirestore.Firestore ) => {
  const server = express();

  server.get('/',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[GET] organization');
        try {
          const params: GetOrganizationQueryParams = {
            id: request.query.id as string,
          };
          const query = new GetOrganizationQuery(params, organizationRepository(db, request.context));
          const result = await query.execute();
          response.status(200).json(result?.map((organization) => {
            return organizationDTO(organization);
          }
          ));
        } catch (error) {
          console.error('[GET] registration', error);
          response.status(500).send(error);
        }
      },
  );

  server.delete('/:id',
      authenticate(),
      buildContext(db),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[DELETE] organization');
        try {
          const payload: DeleteOrganizationCommandPayload = {
            id: request.params.id,
          };
          const command = new DeleteOrganizationCommand(payload, organizationRepository(db, request.context));
          await command.dispatch();
          response.status(200);
        } catch (error) {
          console.error('[DELETE] organization', error);
          response.status(500).send(error);
        }
      },
  );

  server.put('/:id',
      authenticate(),
      buildContext(db),
      async (request, response) => {
        console.info('[PUT] organizations');
        try {
          const payload: UpdateOrganizationCommandPayload = request.body;
          // const handler = updateOrganizationCommandHandler(organizationRepository(db, request.context));
          // const command = createCommand<UpdateOrganizationCommandPayload, OrganizationUpdatedEvent>(
          //    payload, handler
          // );
          // const result = await command.dispatch();
          const command = new UpdateOrganizationCommand(
              payload,
              organizationRepository(db, request.context)
          );
          const result = await command.dispatch();
          if (result?.organization) {
            response.status(200).json(organizationDTO(result.organization));
          } else {
            throw new Error('Organization not updated');
          }
        } catch (error) {
          console.error('[PUT] organizations', error);
          response.status(400).send(error);
        }
      }
  );

  return server;
};
