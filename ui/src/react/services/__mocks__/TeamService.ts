export default class TeamService {
  static login = jest.fn().mockResolvedValue('');
  static create = jest.fn().mockResolvedValue('');
  static getTeamName = jest.fn();
}
