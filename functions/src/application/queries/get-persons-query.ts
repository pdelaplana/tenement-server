import { Person } from '../../domain/entities/person';
import { QueryParameter, Repository } from '../repository/repository';
import { BaseQuery } from './query';

export interface GetPersonsQueryParams {
  id?: string;
}

const queryHandler = (
    repository: Repository<Person>
) => {
  return async (params:GetPersonsQueryParams) =>{
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

export class GetPersonsQuery extends BaseQuery<GetPersonsQueryParams, Person[]> {
  constructor(params: GetPersonsQueryParams, repository: Repository<Person>) {
    super(params, queryHandler(repository));
  }
}

