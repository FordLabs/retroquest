import * as React from 'react';
import classnames from 'classnames';

import FloatingCharacterCountdown from '../floating-character-countdown/FloatingCharacterCountdown';
import { onChange, onKeys } from '../../utils/EventUtils';

import './EditableText.scss';

const MAX_LENGTH = 255;

const NO_OP = () => undefined;

type EditableTextProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  editing: boolean;
  selectable?: boolean;
  disabled?: boolean;
  onConfirm?: (value: string) => void;
  onCancel?: () => void;
  onSelect?: () => void;
};

export default function EditableText(props: EditableTextProps) {
  const {
    value,
    editing,
    selectable = false,
    disabled = false,
    onConfirm = NO_OP,
    onCancel = NO_OP,
    onSelect = NO_OP,
    className,
    ...divProps
  } = props;

  const [editValue, setEditValue] = React.useState(value);

  const textAreaRef = React.useRef<HTMLTextAreaElement>();

  const canSelect = selectable && !disabled && !editing;

  React.useEffect(() => {
    resizeTextArea();
  }, [value]);

  React.useEffect(() => {
    resizeTextArea();
  }, [editValue]);

  React.useEffect(() => {
    if (editing) {
      setEditValue(value);
      textAreaRef.current?.focus();
      textAreaRef.current?.select();

      const escapeListener = onKeys<KeyboardEvent>('Escape', onCancel);
      document.addEventListener('keydown', escapeListener);

      return () => {
        textAreaRef.current?.setSelectionRange(0, 0);
        document.removeEventListener('keydown', escapeListener);
      };
    }
  }, [editing, onCancel]);

  function resizeTextArea() {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = '';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  }

  function onEditConfirmed() {
    onConfirm(editValue);
  }

  return (
    <div
      {...divProps}
      data-testid="editableText-container"
      className={classnames('editable-text-container', className, { disabled })}
      onClick={canSelect ? onSelect : undefined}
    >
      <textarea
        data-testid="editableText"
        className="text-area"
        ref={textAreaRef}
        value={editing ? editValue : value}
        onChange={onChange(setEditValue)}
        onKeyDown={onKeys('Enter', onEditConfirmed)}
        maxLength={MAX_LENGTH}
        readOnly={!editing}
        disabled={!editing}
      />
      {editing && (
        <FloatingCharacterCountdown
          characterCount={editValue.length}
          charsAreRunningOutThreshold={50}
          maxCharacterCount={MAX_LENGTH}
        />
      )}
      {canSelect && <button className="editable-text-select" data-testid="editableText-select" aria-label={value} />}
    </div>
  );
}
