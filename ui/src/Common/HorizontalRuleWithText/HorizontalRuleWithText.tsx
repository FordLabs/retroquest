import React from 'react';

import './HorizontalRuleWithText.scss';

interface RuleProps {
	text: string;
}

function HorizontalRuleWithText(props: RuleProps): JSX.Element {
	const { text } = props;
	return (
		<div className="or-separator-line">
			<span>{text}</span>
		</div>
	);
}

export default HorizontalRuleWithText;
