import * as React from 'react';
import classNames from 'classnames';

import './FloatingCharacterCountdown.scss';

interface Props {
  characterCount: number;
  maxCharacterCount?: number;
  charsAreRunningOutThreshold?: number;
}

export default function FloatingCharacterCountdown(props: Props): React.ReactElement {
  const { maxCharacterCount = 255, charsAreRunningOutThreshold = 20, characterCount = 0 } = props;

  const charactersRemaining = maxCharacterCount - characterCount;
  const charactersRemainingHaveRunOut = charactersRemaining <= 0;
  const charactersRemainingAreBelowThreshold = charactersRemaining < charsAreRunningOutThreshold;
  const charactersRemainingAreAboutToRunOut = charactersRemainingAreBelowThreshold && !charactersRemainingHaveRunOut;

  const className = classNames('floating-character-countdown', {
    visible: characterCount,
    'display-warning-text': charactersRemainingAreAboutToRunOut,
    'display-error-text': charactersRemainingHaveRunOut,
  });

  return <span className={className}>{charactersRemaining}</span>;
}
