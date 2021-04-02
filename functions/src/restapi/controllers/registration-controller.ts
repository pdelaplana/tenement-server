import * as express from 'express';

import { validationRules } from '../middlewares/validation-rules';
import { validate } from '../middlewares/validate';
import { organizationRepository, userService } from '../../dependency-factory';
import { RepositoryContext } from '../../application/repository/repository';
import { CompletedRegistrationEvent } from '../../domain/events/registration-events';
import { newRegistrationCommandHandler, NewRegistrationCommandPayload } from '../../application/commands/new-registration-command';
import { createCommand } from '../../application/commands/base-command';


/**
 * @swagger
 * tags:
 *   name: Registration
 *   description: New Registration
 */

export const registrationController = (db: FirebaseFirestore.Firestore) => {
  const server = express();

  /**
 * @swagger
 * path:
 *  /registration/:
 *    post:
 *      summary: Create a new organization and user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
  server.post('/',
      validate(validationRules.newRegistrationRequest),
      async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        console.info('[POST] registration');
        try {
          const dummyContext : RepositoryContext = {
            uid: '',
            organizationId: '',
          };
          const payload: NewRegistrationCommandPayload = request.body;
          const command = createCommand<NewRegistrationCommandPayload, CompletedRegistrationEvent>(
              payload,
              newRegistrationCommandHandler(
                  organizationRepository(db, dummyContext),
                  userService()
              )
          );
          const result = await command.dispatch();
          console.debug('Result', JSON.stringify(result));
          response.status(200).json(result);
        } catch (error) {
          console.error('[POST] registration', error);
          response.status(409).send(error);
        }
      }
  );


  return server;
};
