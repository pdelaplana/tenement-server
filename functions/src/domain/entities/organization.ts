import { Entity } from './entity';
import { Property } from './property';
import { Unit } from './unit';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Organization:
 *          type: object
 *          required:
 *              - name
 *              - version
 *        properties:
 *          id:
 *              type: string
 *          name:
 *              type: string
 *          audit:
 *              type: object
 *          version:
 *              type: number
 *              format: email
 *              description: Email for the user, needs to be unique.
 *        example:
 *           id: xxxxxx
 *           name: xxxxxx
 *           version: 1
 */
export interface Organization extends Entity {
  name: string;
  properties?: Property[];
  units?: Unit[];
}

