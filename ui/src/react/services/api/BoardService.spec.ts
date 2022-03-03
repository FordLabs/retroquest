import axios from 'axios';

import BoardService from './BoardService';

describe('Board Service', () => {
  it('should return list of boards by page index', async () => {
    const teamId = 'teamId';
    const expectedBoards = [];
    axios.get = jest.fn().mockResolvedValue({ data: expectedBoards });

    const actual = await BoardService.getBoards(teamId, 0);

    expect(actual).toEqual(expectedBoards);
    expect(axios.get).toHaveBeenCalledWith('/api/team/teamId/boards?pageIndex=0');
  });
});
