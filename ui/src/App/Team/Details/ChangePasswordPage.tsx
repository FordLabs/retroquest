import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import TeamService from '../../../Services/Api/TeamService';

type ElementType = {
	password: { value: string };
	confirmpassword: { value: string };
};

function ChangePasswordPage(): JSX.Element {
	const [shouldShowSaved, setShouldShowSaved] = useState(false);
	const { search } = useLocation();

	function submitNewPassword(e: React.SyntheticEvent<HTMLFormElement>) {
		e.preventDefault();
		const password1 = (e.currentTarget.elements as unknown as ElementType)
			.password.value;
		const password2 = (e.currentTarget.elements as unknown as ElementType)
			.confirmpassword.value;
		if (password1 === password2) {
			let token = new URLSearchParams(search).get('token');
			TeamService.setPassword(password1, token == null ? '' : token).then(
				() => {
					setShouldShowSaved(true);
				}
			);
		}
	}

	return (
		<form onSubmit={submitNewPassword}>
			<label htmlFor="passwordinput">New Password</label>
			<input type="password" id="passwordinput" name="password" />
			<label htmlFor="confirmpasswordinput">Confirm New Password</label>
			<input type="password" id="confirmpasswordinput" name="confirmpassword" />

			<button type="submit">Reset Password</button>
			{shouldShowSaved && <div className={'success-indicator'}>Saved!</div>}
		</form>
	);
}

export default ChangePasswordPage;
