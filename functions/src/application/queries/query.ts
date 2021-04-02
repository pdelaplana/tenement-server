export type QueryHandler<TQueryParams, TQueryResult> = (query: TQueryParams) => Promise<TQueryResult>;

export const createQuery = <TQueryParams, TQueryResult>(
  params: TQueryParams,
  handler: QueryHandler<TQueryParams, TQueryResult|null>
) => {
  return {
    execute: async () => {
      return await handler(params);
    },
  };
};

export class BaseQuery<TQueryParams, TQueryResult> {
  constructor(private params: TQueryParams, private handler:QueryHandler<TQueryParams, TQueryResult|null>) {}

  async execute() {
    return await this.handler(this.params);
  }
}

