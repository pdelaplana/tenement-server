import { Developer } from '../../domain/entities/developer';
import { QueryParameter, Repository } from '../repository/repository';
import { BaseQuery } from './query';

export interface GetDevelopersQueryParams {
  id?: string;
}


const getDevelopersQueryHandler = (
    repository: Repository<Developer>
) => {
  return async (params:GetDevelopersQueryParams) =>{
    try {
      const filter = [];
      if (params.id) {
        filter.push(<QueryParameter>{ name: 'id', operator: '==', value: params.id });
      }
      const developers = await repository.query(filter);
      return developers;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

export class GetDevelopersQuery extends BaseQuery<GetDevelopersQueryParams, Developer[]> {
  constructor(params: GetDevelopersQueryParams, repository: Repository<Developer>) {
    super(params, getDevelopersQueryHandler(repository));
  }
}

