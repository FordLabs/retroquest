import { render, screen } from '@testing-library/react';

import LoadingScreen from './LoadingScreen';

describe('the loading screen', () => {
	it('should say the word loading', () => {
		render(<LoadingScreen />);
		expect(screen.getByText('Loading...')).toBeInTheDocument();
	});

	it('should have a spinny icon', () => {
		render(<LoadingScreen />);
		expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
	});
});
