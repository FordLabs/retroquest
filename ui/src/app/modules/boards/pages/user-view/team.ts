export interface Team {
  name: string;
  id: string;
}

export function emptyTeam(): Team {
  return {
    name: '',
    id: ''
  };
}
