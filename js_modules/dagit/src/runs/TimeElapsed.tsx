import {Colors, Icon} from '@blueprintjs/core';
import * as React from 'react';

import {formatElapsedTime} from 'src/app/Util';
import {Group} from 'src/ui/Group';

export interface Props {
  startUnix: number | null;
  endUnix: number | null;
}

export const TimeElapsed = (props: Props) => {
  const {startUnix, endUnix} = props;

  const [endTime, setEndTime] = React.useState(() => (endUnix ? endUnix * 1000 : null));
  const interval = React.useRef<NodeJS.Timer | null>(null);
  const timeout = React.useRef<NodeJS.Timer | null>(null);

  const clearTimers = React.useCallback(() => {
    interval.current && clearInterval(interval.current);
    timeout.current && clearTimeout(timeout.current);
  }, []);

  React.useEffect(() => {
    // An end time has been supplied. Simply set a static value.
    if (endUnix) {
      setEndTime(endUnix * 1000);
      return;
    }

    // Align to the next second and then update every second so the elapsed
    // time "ticks" up.
    timeout.current = setTimeout(() => {
      interval.current = setInterval(() => {
        setEndTime(Date.now());
      }, 1000);
    }, Date.now() % 1000);

    return () => clearTimers();
  }, [clearTimers, endUnix]);

  const startTime = startUnix ? startUnix * 1000 : 0;

  return (
    <Group direction="row" spacing={4} alignItems="center">
      <Icon
        icon="time"
        iconSize={13}
        color={Colors.GRAY3}
        style={{position: 'relative', top: '-1px'}}
      />
      <span style={{fontVariantNumeric: 'tabular-nums'}}>
        {startTime ? formatElapsedTime((endTime || Date.now()) - startTime) : ''}
      </span>
    </Group>
  );
};
