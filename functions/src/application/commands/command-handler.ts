
export type Next<TRaisedEvent> = (result:TRaisedEvent|null) => Promise<TRaisedEvent|null>;

export interface CommandHandler<TCommandPayload, TRaisedEvent> {
  execute: (payload: TCommandPayload, next: Next<TRaisedEvent>) => Promise<TRaisedEvent|null>;
}

/*
export const createCommand = <TCommandPayload, TRaisedEvent>(
  payload:TCommandPayload,
  ...commandHandlers: CommandHandler<TCommandPayload, TRaisedEvent|null>[]
) => {
  return {
    addHandler: (handler: CommandHandler<TCommandPayload, TRaisedEvent|null>) => {
      commandHandlers.push(handler);
    },
    dispatch: async () => {
      let prevIndex = -1;

      const invoke = async (index:number, result:TRaisedEvent|null) => {
        if (index === prevIndex) {
          throw new Error('next() called multiple times');
        }
        prevIndex = index;
        const handler = commandHandlers[index];

        if (handler) {
          console.debug('handler[index]:', index);
          await handler.execute(payload, async (nextResult) => {
            console.debug('nextResult:', JSON.stringify(nextResult));
            result = await invoke(index + 1, nextResult);
            return result;
          });
        }
        return result;
      };
      return await invoke(0, null);
    },
  };
};
*/
