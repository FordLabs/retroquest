import TeamCredentials from './types/teamCredentials';

export function getTeamCredentials(): TeamCredentials {
	const teamName = 'Test Login ' + Math.random().toString().replace('.', '');
	const teamId = teamName.toLowerCase().replace(/ /g, '-');
	return {
		teamName,
		teamId,
		password: 'Login1234',
		jwt: '',
	};
}
