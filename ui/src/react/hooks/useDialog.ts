import * as React from 'react';

import Dialog from '../types/dialog';

export default function useDialog(ref: React.Ref<Dialog>): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
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

  return [show, setShow];
}
