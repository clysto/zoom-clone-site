import { autorun } from 'mobx';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useRef } from 'react';

export default observer(function UserAudios({ roomStore }) {
  const audioRef = useRef(null);
  useEffect(
    () =>
      autorun(() => {
        roomStore.allMicTracks.forEach((track) => {
          track.play(audioRef.current);
        });
      }),
    [roomStore.allMicTracks]
  );

  return <div ref={audioRef}></div>;
});
