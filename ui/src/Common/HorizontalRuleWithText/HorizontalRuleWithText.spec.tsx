import { render } from '@testing-library/react';
import { screen } from '@testing-library/react';

import HorizontalRuleWithText from './HorizontalRuleWithText';

describe('the text passed as a prop', () => {
	it('is rendered', () => {
		render(<HorizontalRuleWithText text={'expected TEXT'} />);
		expect(screen.getByText(/expected TEXT/)).toBeInTheDocument();
	});
});
