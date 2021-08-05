import * as React from 'react';
import classnames from 'classnames';

import { PrimaryButton, SecondaryButton } from '../button/Button';

import './Dialog.scss';

type DialogProps = React.PropsWithChildren<{
  className?: string;
  header: string;
  subHeader?: string;
  buttons?: {
    cancel?: {
      text: string;
      onClick: () => void;
    };
    confirm?: {
      text: string;
      onClick: () => void;
    };
  };
}>;

export default function Dialog(props: DialogProps) {
  const { header, subHeader, buttons, className, children } = props;

  return (
    <div className={classnames('dialog', className)}>
      <div className="dialog-body">
        <div className="dialog-heading">{header}</div>
        {subHeader && <div className="dialog-sub-heading">{subHeader}</div>}
        {children}
      </div>
      {buttons && (
        <div className="dialog-footer">
          {buttons.cancel && (
            <SecondaryButton onClick={buttons.cancel.onClick}>{buttons.cancel.text || 'cancel'}</SecondaryButton>
          )}
          {buttons.confirm && (
            <PrimaryButton onClick={buttons.confirm.onClick}>{buttons.confirm.text || 'confirm'}</PrimaryButton>
          )}
        </div>
      )}
    </div>
  );
}
