import { RepositoryContext } from './application/repository/repository';
import { Entity } from './domain/entities/entity';
import { FireStoreRepository } from './infrastructure/repository/firestore-repository';
import { FirebaseUserService } from './infrastructure/auth/firebase-user-service';
import { Organization } from './domain/entities/organization';
import { Property } from './domain/entities/property';
import { propertyConverter } from './infrastructure/repository/property-converter';
import { Developer } from './domain/entities/developer';
import { Unit } from './domain/entities/unit';

export const userService = () => new FirebaseUserService();

export const repository =
  <T extends Entity>(db: FirebaseFirestore.Firestore, context: RepositoryContext, collectionName: string) =>
    new FireStoreRepository<T>(context, db, collectionName);

export const organizationRepository = (db: FirebaseFirestore.Firestore, context: RepositoryContext) =>
  new FireStoreRepository<Organization>(context, db, 'organizations');

export const propertyRepository = (db: FirebaseFirestore.Firestore, context: RepositoryContext) =>
  new FireStoreRepository<Property>(context, db, 'properties', `organizations/${context.organizationId}`,
      propertyConverter(db, context.organizationId));

export const developerRepository = (db: FirebaseFirestore.Firestore, context: RepositoryContext) =>
  new FireStoreRepository<Developer>(context, db, 'developers', `organizations/${context.organizationId}`);

export const unitRepository = (db: FirebaseFirestore.Firestore, context: RepositoryContext, propertyId: string) =>
  new FireStoreRepository<Unit>(context, db, 'units',
      `organizations/${context.organizationId}/properties/${propertyId}`);

export class RepositoryFactory {
  constructor(
    private db: FirebaseFirestore.Firestore,
    private repositoryContext: RepositoryContext = new RepositoryContext()
  ) {}

  get currentContext() {
    return this.repositoryContext;
  }
  set currentContext(value:RepositoryContext) {
    this.repositoryContext = value;
  }

  mount <R>(Repository: { new(context: RepositoryContext, db: FirebaseFirestore.Firestore): R}) {
    return new Repository(this.currentContext, this.db);
  }

  static create(db: FirebaseFirestore.Firestore) {
    return new RepositoryFactory(db);
  }
}

