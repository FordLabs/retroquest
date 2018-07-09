export interface Task {
  id: number;
  teamId: string;
  topic: string;
  message: string;
  hearts: number;
  completed: boolean;
}

export function emptyTask (): Task {
  return {
    id: -1,
    message: '',
    topic: '',
    teamId: '',
    hearts: 0,
    completed: false,
  };
}
