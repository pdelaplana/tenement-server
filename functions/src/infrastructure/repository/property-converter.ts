
import { Developer } from '../../domain/entities/developer';
import { Identifier } from '../../domain/entities/identifier';
import { Property } from '../../domain/entities/property';


export const propertyConverter = (db: FirebaseFirestore.Firestore, organizationId?: string) => {
  return {
    toFirestore: async (property: Property): Promise<FirebaseFirestore.DocumentData> => {
      const { id, developer, ...rest } = property;
      const developerRef = db.doc('organizations/'+organizationId+'/developers/'+developer.id);
      return {
        ...rest,
        developerRef,
      };
    },

    fromFirestore: async (
        snapshot: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>
    ): Promise<Property> => {
      const document = snapshot.data();

      if (!document) {
        throw new Error('No document data available');
      }

      const developerRef = document.developerRef as FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
      let developer = null;

      if (developerRef) {
        const developerSnapshot = await developerRef.get();
        developer = developerSnapshot.data();
      }

      const property = <Property>{
        id: new Identifier<string>(snapshot.id),
        name: document.name,
        buildingName: document.buildingName,
        address: document.address,
        developer: <Developer>{
          name: developer?.name,
          audit: {
            createdByUid: developer?.audit.createdByUid,
            createdDate: developer?.audit.createdDate.toDate(),
            lastUpdatedByUid: developer?.audit.lastUpdatedByUid,
            lastUpdatedDate: developer?.audit.lastUpdatedDate.toDate(),
          },
        },
        propertyType: document.propertyType,
        version: document.version,
        audit: {
          createdByUid: document.audit.createdByUid,
          createdDate: document.audit.createdDate.toDate(),
          lastUpdatedByUid: document.audit.lastUpdatedByUid,
          lastUpdatedDate: document.audit.lastUpdatedDate.toDate(),
        },
      };

      return property;
    },

  };
};
