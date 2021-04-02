import { QueryParameter, RepositoryContext, Repository } from '../../application/repository/repository';
import { Entity, entityBuilder } from '../../domain/entities/entity';
import * as firestore from '@google-cloud/firestore';
import { Identifier } from '../../domain/entities/identifier';
import { DataConverter } from './data-converter';


export class FireStoreRepository<T extends Entity> implements Repository<T> {
  context: RepositoryContext;

  private db: FirebaseFirestore.Firestore;
  private collection: FirebaseFirestore.CollectionReference;

  private converter?: DataConverter<T>;

  private async tryConvertFromFirestore(snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>): Promise<T> {
    if (this.converter) {
      return await this.converter.fromFirestore(snapshot);
    } else {
      const data = snapshot.data()! as Entity;
      return entityBuilder<T>(snapshot.id, data);
    }
  }

  private async tryConvertToFirestore(entity:T): Promise< FirebaseFirestore.DocumentData> {
    if (this.converter) {
      return this.converter.toFirestore(entity);
    } else {
      const { id, ...rest } = entity;
      return rest;
    }
  }

  constructor(
      context: RepositoryContext,
      db: FirebaseFirestore.Firestore,
      collectionName: string,
      path?: string,
      converter?: DataConverter<T>
  ) {
    this.db = db;
    this.context = context;

    if (path) {
      this.collection = this.db.doc(path).collection(collectionName);
    } else {
      this.collection = this.db.collection(collectionName);
    }

    this.converter = converter;
  }

  async get(id: string) : Promise<T> {
    try {
      const snapshot = await this.collection.doc(id).get();
      return await this.tryConvertFromFirestore(snapshot);
    } catch (error) {
      console.error('firebaseRepository.get(...)', JSON.stringify(error));
      throw error;
    }
  }

  async add(entity: T, newId?: string | undefined) : Promise<T> {
    try {
      let data = null;
      let { id } = entity;
      data = await this.tryConvertToFirestore(entity);

      const audit = {
        createdByUid: this.context.uid,
        createdDate: new Date(),
        lastUpdatedByUid: this.context.uid,
        lastUpdatedDate: new Date(),
      };

      data = { ...data, audit };


      if (newId) {
        await this.collection.doc(newId).set(data);
        id = new Identifier<string>(newId);
      } else {
        const reference = await this.collection.add(data);
        id = new Identifier<string>(reference.id);
      }
      const snapshot = await this.collection.doc(id.toString()).get();
      data = await this.tryConvertFromFirestore(snapshot);
      return data as T;
    } catch (error) {
      console.error('firestoreRepository.update(...)', JSON.stringify(error));
      throw error;
    }
  }

  async update(entity: T): Promise<T> {
    try {
      const { id } = entity;
      if (!id?.hasValue()) throw new Error('id not provided');
      let data = null;

      data = await this.tryConvertToFirestore(entity);
      if (data.audit) {
        data.audit.lastUpdatedByUid = this.context.uid;
        data.audit.lastUpdatedDate = new Date();
      }

      /*
      if (this.converter) {
        data = this.converter.toFirestore(entity);
      } else {
        const { id, ...rest } = entity;
        if (rest.audit) {
          rest.audit.lastUpdatedByUid = this.context.uid;
          rest.audit.lastUpdatedDate = new Date();
        }
        data = { ...rest, audit: rest.audit };
      }
      */
      await this.collection.doc(id!.toString()).set(data);

      const snapshot = await this.collection.doc(id.toString()).get();
      data = await this.tryConvertFromFirestore(snapshot);

      return data as T;
    } catch (error) {
      console.error('firestoreRepository.update(...)', error);
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      console.debug('firestoreRepository.delete(...) - id', id);
      await this.collection.doc(id).delete();
      console.debug('firestoreRepository.delete(...) - deleted', id);
      return true;
    } catch (error) {
      console.error('firestoreRepository.delete(...)', error.toString());
      throw error;
    }
  }

  async query(queryParams: QueryParameter[]): Promise<T[]> {
    try {
      console.debug('firestoreRepository.query(...) - params', JSON.stringify(queryParams));

      let query = this.collection;
      queryParams.forEach((param)=> {
        if (param.name == 'id') {
          query = query.where(firestore.FieldPath.documentId(), param.operator, param.value) as FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
        } else {
          query = query.where(param.name, param.operator, param.value) as FirebaseFirestore.CollectionReference<FirebaseFirestore.DocumentData>;
        }
      });


      const result = await query.get();
      const list: T[] = [];

      console.debug('firestoreRepository.query(...) - result', JSON.stringify(result));

      for (const reference of result.docs) {
        const data = await this.tryConvertFromFirestore(reference);
        console.debug('firestoreRepository.query(...) - data', JSON.stringify(data));
        list.push(data);
      }

      return list;
    } catch (error) {
      console.error('firestoreRepository.query(...)', JSON.stringify(error));
      throw error;
    }
  }
}
