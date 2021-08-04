import * as React from 'react';
import classnames from 'classnames';

import { PrimaryButton, SecondaryButton } from '../button/Button';

import './Dialog.scss';

export interface DialogMethods {
  show: () => void;
  hide: () => void;
}

type DialogProps = React.PropsWithChildren<{
  className?: string;
  header: string;
  subHeader?: string;
  buttons?: {
    cancel?: {
      text: string;
      onClick?: () => void;
    };
    confirm?: {
      text: string;
      onClick: () => void;
    };
  };
}>;

function Dialog(props: DialogProps, ref: React.Ref<DialogMethods>) {
  const { header, subHeader, buttons, className, children } = props;

  const [show, setShow] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    show: () => setShow(true),
    hide: () => setShow(false),
  }));

  React.useEffect(() => {
    if (show) {
      document.onkeydown = (event) => {
        if (event.key === 'Escape') {
          setShow(false);
        }
      };
    } else {
      document.onkeydown = null;
    }
  }, [show]);

  const onHide = () => setShow(false);

  return show ? (
    <div className="dialog-backdrop" onClick={onHide} data-testid="dialogBackdrop">
      <div className={classnames('dialog', className)} onClick={(event) => event.stopPropagation()}>
        <div className="dialog-body">
          <div className="dialog-heading">{header}</div>
          {subHeader && <div className="dialog-sub-heading">{subHeader}</div>}
          {children}
        </div>
        {buttons && (
          <div className="dialog-footer">
            {buttons.cancel && (
              <div className="dialog-footer-container">
                <SecondaryButton onClick={buttons.cancel.onClick || onHide}>
                  {buttons.cancel.text || 'cancel'}
                </SecondaryButton>
              </div>
            )}
            {buttons.confirm && (
              <div className="dialog-footer-container">
                <PrimaryButton onClick={buttons.confirm.onClick}>{buttons.confirm.text || 'confirm'}</PrimaryButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;
}

export default React.forwardRef<DialogMethods, DialogProps>(Dialog);
