export default class TeamService {
  static login = jest.fn().mockResolvedValue('team-name');
  static getTeamName = jest.fn();
}
