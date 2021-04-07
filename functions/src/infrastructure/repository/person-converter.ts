
import { Identifier } from '../../domain/entities/identifier';
import { Person } from '../../domain/entities/person';

export const personConverter = (db: FirebaseFirestore.Firestore, organizationId?: string) => {
  return {
    toFirestore: async (person: Person): Promise<FirebaseFirestore.DocumentData> => {
      const { id, ...rest } = person;
      return {
        ...rest,
      };
    },

    fromFirestore: async (
        snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
    ): Promise<Person> => {
      const document = snapshot.data();

      if (!document) {
        throw new Error('No document data available');
      }

      const person = <Person>{
        id: new Identifier<string>(snapshot.id),
        ...document,
        birthDate: ('birthDate' in document) ? document.birthDate?.toDate() : null,
        // version: document.version,
        audit: {
          createdByUid: document.audit.createdByUid,
          createdDate: document.audit.createdDate.toDate(),
          lastUpdatedByUid: document.audit.lastUpdatedByUid,
          lastUpdatedDate: document.audit.lastUpdatedDate.toDate(),
        },
      };

      return person;
    },

  };
};
