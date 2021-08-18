import * as React from 'react';
import classnames from 'classnames';

import { onKeys } from '../../utils/EventUtils';

import './Modal.scss';

const NO_OP = () => undefined;

export interface ModalMethods {
  show: () => void;
  hide: () => void;
  setHideOnEscape: (enabled: boolean) => void;
  setHideOnBackdropClick: (enabled: boolean) => void;
}

const ModalContext = React.createContext<ModalMethods>({
  show: NO_OP,
  hide: NO_OP,
  setHideOnEscape: NO_OP,
  setHideOnBackdropClick: NO_OP,
});

type ModalProps = React.PropsWithChildren<{
  show?: boolean;
  hideOnEscape?: boolean;
  hideOnBackdropClick?: boolean;
  onHide?: () => void;
  className?: string;
}>;

function Modal(props: ModalProps, ref: React.Ref<ModalMethods>) {
  const {
    show: showProp,
    hideOnEscape: hideOnEscapeProp,
    hideOnBackdropClick: hideOnBackdropClickProp,
    onHide,
    className,
    children,
  } = props;

  const [showState, setShowState] = React.useState(false);
  const [hideOnEscapeState, setHideOnEscapeState] = React.useState(true);
  const [hideOnBackdropClickState, setHideOnBackdropClickState] = React.useState(true);

  const show = showProp ?? showState;
  const hideOnEscape = hideOnEscapeProp ?? hideOnEscapeState;
  const hideOnBackdropClick = hideOnBackdropClickProp ?? hideOnBackdropClickState;

  const hide = React.useCallback(() => {
    if (showProp === undefined) {
      setShowState(false);
    }
    if (onHide) onHide();
  }, [showProp, onHide]);

  React.useEffect(() => {
    if (show && hideOnEscape) {
      const escapeListener = onKeys('Escape', hide);
      document.addEventListener('keydown', escapeListener);

      return () => document.removeEventListener('keydown', escapeListener);
    }
  }, [show, hide, hideOnEscape]);

  const modalMethods = React.useMemo(
    () => ({
      show: () => setShowState(true),
      hide: () => setShowState(false),
      setHideOnEscape: setHideOnEscapeState,
      setHideOnBackdropClick: setHideOnBackdropClickState,
    }),
    []
  );

  React.useImperativeHandle(ref, () => modalMethods, [modalMethods]);

  return (
    <ModalContext.Provider value={modalMethods}>
      {show && (
        <div className="modal-backdrop" onClick={hideOnBackdropClick ? hide : undefined} data-testid="modalBackdrop">
          <div className={classnames('modal', className)} onClick={(event) => event.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export default React.forwardRef<ModalMethods, ModalProps>(Modal);

export function useModal() {
  return React.useContext(ModalContext);
}
