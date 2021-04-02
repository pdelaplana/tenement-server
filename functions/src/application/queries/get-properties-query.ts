import { Property } from '../../domain/entities/property';
import { QueryParameter, Repository } from '../repository/repository';
import { BaseQuery } from './query';

export interface GetPropertiesQueryParams {
  id: string;
}


const getPropertiesQueryHandler = (
    repository: Repository<Property>
) => {
  return async (params:GetPropertiesQueryParams) =>{
    try {
      const filter = [];
      if (params.id) {
        filter.push(<QueryParameter>{ name: 'id', operator: '==', value: params.id });
      }
      const properties = await repository.query(filter);
      return properties;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

export class GetPropertiesQuery extends BaseQuery<GetPropertiesQueryParams, Property[]> {
  constructor(params: GetPropertiesQueryParams, repository: Repository<Property>) {
    super(params, getPropertiesQueryHandler(repository));
  }
}

