import * as express from 'express';
import * as cors from 'cors';

import { homeController } from './controllers/home-controller';
import { registrationController } from './controllers/registration-controller';
import { organizationController } from './controllers/organization-controller';
import { propertiesController } from './controllers/properties-controller';
import { developersController } from './controllers/developers-controller';
import { unitsController } from './controllers/units-controller';


export const restApi = (db: FirebaseFirestore.Firestore) => {
  const main = express();

  // main.use(cors({origin:true}));
  main.use(cors());

  main.use(express.json());
  main.use(express.urlencoded({ extended: false }));

  // routes
  main.use('/v1/home', homeController(db));
  // main.use('/v1/docs', SwaggerController());
  main.use('/v1/registration', registrationController(db));
  main.use('/v1/organizations', organizationController(db));
  main.use('/v1/properties', propertiesController(db));
  main.use('/v1/developers', developersController(db));
  main.use('/v1/properties/:propertyId/units', unitsController(db));


  return main;
};


