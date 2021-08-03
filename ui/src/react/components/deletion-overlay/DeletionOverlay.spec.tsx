import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DeletionOverlay from './DeletionOverlay';

describe('DeletionOverlay', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    render(<DeletionOverlay header={'Continue the test?'} onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
  });

  it('should show the header', () => {
    expect(screen.queryByText('Continue the test?')).not.toBeNull();
  });

  it('should notify observers of accept button click', () => {
    userEvent.click(screen.getByText('Yes'));
    expect(mockOnConfirm).toHaveBeenCalled();
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should notify observers of decline button click', () => {
    userEvent.click(screen.getByText('No'));
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should notify observers of decline when unfocused', () => {
    userEvent.click(screen.getByText('Continue the test?'));
    expect(mockOnConfirm).not.toHaveBeenCalled();
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
