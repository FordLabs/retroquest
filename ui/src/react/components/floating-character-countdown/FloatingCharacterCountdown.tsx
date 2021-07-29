import * as React from 'react';
import { Themes } from '../../../app/modules/domain/Theme';

import './FloatingCharacterCountdown.scss';
import classNames from 'classnames';

interface Props {
  characterCount: number;
  maxCharacterCount?: number;
  charsAreRunningOutThreshold?: number;
  theme?: Themes;
}

export default function FloatingCharacterCountdown(props: Props): React.ReactElement {
  const { maxCharacterCount = 255, charsAreRunningOutThreshold = 20, characterCount = 0, theme = Themes.Light } = props;

  const charactersRemaining = maxCharacterCount - characterCount;
  const charactersRemainingHaveRunOut = charactersRemaining <= 0;
  const charactersRemainingAreBelowThreshold = charactersRemaining < charsAreRunningOutThreshold;
  const charactersRemainingAreAboutToRunOut = charactersRemainingAreBelowThreshold && !charactersRemainingHaveRunOut;

  const className = classNames({
    visible: characterCount,
    'display-warning-text': charactersRemainingAreAboutToRunOut,
    'display-error-text': charactersRemainingHaveRunOut,
    'dark-theme': theme === Themes.Dark,
  });

  return <span className={className}>{charactersRemaining}</span>;
}
