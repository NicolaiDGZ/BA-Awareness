export const TASK_EVENTS = {
    UPDATE_TASKS: 'UPDATE_TASKS',
    SET_VISIBLE: 'SET_VISIBLE'
  } as const;
  
  export const customEmitter = new Phaser.Events.EventEmitter();