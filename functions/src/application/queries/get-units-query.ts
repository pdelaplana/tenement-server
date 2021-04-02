import { Unit } from '../../domain/entities/unit';
import { QueryParameter, Repository } from '../repository/repository';
import { BaseQuery } from './query';

export interface GetUnitsQueryParams {
  id?: string;
}


const getUnitsQueryHandler = (
    repository: Repository<Unit>
) => {
  return async (params:GetUnitsQueryParams) =>{
    try {
      const filter = [];
      if (params.id) {
        filter.push(<QueryParameter>{ name: 'id', operator: '==', value: params.id });
      }
      const units = await repository.query(filter);
      return units;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
};

export class GetUnitsQuery extends BaseQuery<GetUnitsQueryParams, Unit[]> {
  constructor(params: GetUnitsQueryParams, repository: Repository<Unit>) {
    super(params, getUnitsQueryHandler(repository));
  }
}

