import * as React from 'react';
import classnames from 'classnames';

import './Modal.scss';

export interface ModalMethods {
  show: () => void;
  hide: () => void;
}

const ModalContext = React.createContext<ModalMethods>({ show: () => undefined, hide: () => undefined });

type ModalProps = React.PropsWithChildren<{ className?: string }>;

function Modal(props: ModalProps, ref: React.Ref<ModalMethods>) {
  const { className, children } = props;

  const [show, setShow] = React.useState(false);

  const modalMethods = React.useMemo(
    () => ({
      show: () => setShow(true),
      hide: () => setShow(false),
    }),
    []
  );

  React.useImperativeHandle(ref, () => modalMethods);

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

  return (
    <ModalContext.Provider value={modalMethods}>
      {show && (
        <div className="modal-backdrop" onClick={() => setShow(false)} data-testid="modalBackdrop">
          <div className={classnames('modal', className)} onClick={(event) => event.stopPropagation()}>
            {children}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export default React.forwardRef<ModalMethods, ModalProps>(Modal);
