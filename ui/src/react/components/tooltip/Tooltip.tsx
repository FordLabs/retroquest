import * as React from 'react';

import './Tooltip.scss';

export type ToolTipProps = React.PropsWithChildren<{}>;

export default function Tooltip(props: ToolTipProps): React.ReactElement {
  const { children } = props;
  const ref = React.useRef<HTMLElement>();

  React.useEffect(() => {
    const parent = ref.current?.parentElement;

    if (parent) {
      const parentStyle = window.getComputedStyle(parent);
      const parentStylePosition = parentStyle.getPropertyValue('position');

      if (parentStylePosition === 'static') {
        parent.style.position = 'relative';
      }

      return () => {
        parent.style.position = parentStylePosition;
      };
    }
  }, [ref.current]);

  return (
    <span className="tooltip" ref={ref}>
      {children}
    </span>
  );
}
