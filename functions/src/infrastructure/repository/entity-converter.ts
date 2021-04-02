import { Entity, entityBuilder } from '../../domain/entities/entity';


export const entityConverter = () => {
  return {
    toFirestore: async (entity: Entity) : Promise<FirebaseFirestore.DocumentData> => {
      const { id, ...rest } = entity;
      return rest;
    },
    fromFirestore: async (
        snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>,
    ): Promise<Entity> => {
      const data = snapshot.data()! as Entity;
      return entityBuilder<Entity>(snapshot.id, data);
    },
  };
};
