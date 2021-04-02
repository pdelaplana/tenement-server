import { Entity } from '../../domain/entities/entity';

export interface DataConverter<T extends Entity> {
  toFirestore : (entity:T) => Promise<FirebaseFirestore.DocumentData>,
  fromFirestore: (snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) => Promise<T>
}
