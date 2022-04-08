import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DeleteButton from './DeleteButton';

describe('DeleteButton', () => {
	const mockDelete = jest.fn();

	it('should display trash icon', () => {
		render(<DeleteButton />);

		screen.getByTestId('trashIcon');
	});

	it('should have a tooltip', () => {
		render(<DeleteButton />);

		screen.getByText('Delete');
	});

	it('should handle clicks', () => {
		render(<DeleteButton onClick={mockDelete} />);

		userEvent.click(screen.getByTestId('trashIcon'));

		expect(mockDelete).toHaveBeenCalledTimes(1);
	});

	it('can be disabled', () => {
		render(<DeleteButton onClick={mockDelete} disabled={true} />);
		const deleteButton = screen.getByTestId('deleteButton');

		userEvent.click(deleteButton);

		expect(mockDelete).toHaveBeenCalledTimes(0);
		expect(deleteButton.getAttribute('disabled')).not.toBeNull();
	});
});
