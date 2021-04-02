import { Organization } from '../../domain/entities/organization';
import { to } from '../helpers';
import { Repository, QueryParameter } from '../repository/repository';
import { BaseQuery } from './query';

export interface GetOrganizationQueryParams {
  id: string;
}

export const getOrganizationQueryHandler = (
    repository: Repository<Organization>
) => {
  return async (params:GetOrganizationQueryParams) =>{
    try {
      const filter = [];
      if (params.id) {
        filter.push(to<QueryParameter>({ name: 'id', operator: '==', value: params.id }));
      }
      const organizations = await repository.query(filter);
      return organizations;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

export class GetOrganizationQuery extends BaseQuery<GetOrganizationQueryParams, Organization[]> {
  constructor(params: GetOrganizationQueryParams, repository: Repository<Organization>) {
    super(params, getOrganizationQueryHandler(repository));
  }
}

