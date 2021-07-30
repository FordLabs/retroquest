import * as React from 'react';
import classNames from 'classnames';

import FloatingCharacterCountdown from '../floating-character-countdown/FloatingCharacterCountdown';
import './TextField.scss';

export interface TextFieldProps extends React.HTMLAttributes<HTMLSpanElement> {
  type: string;
  placeholder: string;
  handleSubmission: (string) => void;
}

const maxCharacterCount = 255;

export default function TextField(props: TextFieldProps): React.ReactElement {
  const { placeholder, type, handleSubmission, ...spanProps } = props;

  const [text, setText] = React.useState('');

  const handleTextChange = (changeEvent) => {
    setText(changeEvent.target.value);
  };

  const handleKeyPress = (keyPressEvent) => {
    if (keyPressEvent.key === 'Enter') {
      handleSubmission(text);
      setText('');
    }
  };

  const className = classNames('text-field', type);

  return (
    <span {...spanProps} className={className}>
      <input
        type="text"
        placeholder={placeholder}
        maxLength={maxCharacterCount}
        value={text}
        onChange={handleTextChange}
        onKeyPress={handleKeyPress}
      />
      <FloatingCharacterCountdown
        maxCharacterCount={maxCharacterCount}
        charsAreRunningOutThreshold={50}
        characterCount={text.length}
      />
    </span>
  );
}
