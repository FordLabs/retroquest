import * as React from 'react';

import { PrimaryButton, SecondaryButton } from '../button/Button';
import './DeletionOverlay.scss';

interface OverlayProps {
  header?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeletionOverlay(props: OverlayProps): React.ReactElement {
  const { header = '', onConfirm, onCancel } = props;

  return (
    <div className="deletion-overlay">
      <input autoFocus={true} className="hidden-input" onBlur={onCancel} />
      <div className="heading">
        <p>{header}</p>
      </div>
      <div className="button-container">
        <SecondaryButton className="delete-decline-button" onMouseDown={(e) => e.preventDefault()} onClick={onCancel}>
          No
        </SecondaryButton>
        <PrimaryButton className="delete-accept-button" onMouseDown={(e) => e.preventDefault()} onClick={onConfirm}>
          Yes
        </PrimaryButton>
      </div>
    </div>
  );
}
