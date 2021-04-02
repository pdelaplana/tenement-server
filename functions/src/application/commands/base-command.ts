import { CommandHandler } from './command-handler';

export interface Command<TPayload, TResult> {
  dispatch: (result: TResult) => Promise<TResult|null|void>;
}

export class BaseCommand<TPayload, TRaisedEvent> implements Command<TPayload, TRaisedEvent> {
  private payload: TPayload;
  private commandHandlers!: CommandHandler<TPayload, TRaisedEvent>[];

  constructor(payload: TPayload, ...commandHandlers:CommandHandler<TPayload, TRaisedEvent>[]) {
    this.payload = payload;
    this.commandHandlers = commandHandlers ?? [];
  }

  addHandler(handler: CommandHandler<TPayload, TRaisedEvent>) {
    this.commandHandlers.push(handler);
  }

  async dispatch() {
    let prevIndex = -1;

    const invoke = async (index:number, result:TRaisedEvent|null) => {
      if (index === prevIndex) {
        throw new Error('next() called multiple times');
      }
      prevIndex = index;
      const handler = this.commandHandlers[index];

      if (handler) {
        await handler.execute(this.payload, async (nextResult) => {
          result = await invoke(index + 1, nextResult);
          return result;
        });
      }
      return result;
    };
    return await invoke(0, null);
  }
}

export const createCommand = <TPayload, TRaisedEvent>(payload: TPayload,
  ...commandHandlers: CommandHandler<TPayload, TRaisedEvent>[]) =>{
  return new BaseCommand<TPayload, TRaisedEvent>(
      payload,
      ...commandHandlers
  );
};
