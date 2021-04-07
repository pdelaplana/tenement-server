import { Developer } from '../../domain/entities/developer';

export const developerDTO = (developer:Developer) => {
  return {
    id: developer.id?.toString(),
    name: developer.name,
    audit: developer.audit,
  };
};
