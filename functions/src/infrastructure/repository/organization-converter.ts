import { Organization } from '../../domain/entities/organization';

// import * as firestore from '@google-cloud/firestore';
import { Identifier } from '../../domain/entities/identifier';

export const organizationConverter = {
  toFirestore(organization: Organization): FirebaseFirestore.DocumentData {
    return {
      name: organization.name,
      audit: organization.audit,
      version: organization.version,
    };
  },

  fromFirestore(
      snapshot: FirebaseFirestore.QueryDocumentSnapshot,
      // options: FirebaseFirestore.SnapshotOptions
  ): Organization {
    const data = snapshot.data()!;
    return <Organization>{
      id: new Identifier<string>(snapshot.id),
      name: data.name,
      audit: data.audit,
      version: data.version,
    };
  },
};
