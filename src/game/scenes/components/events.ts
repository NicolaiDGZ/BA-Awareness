export const TASK_EVENTS = {
    UPDATE_TASKS: 'UPDATE_TASKS',
  } as const;
  
  export const customEmitter = new Phaser.Events.EventEmitter();