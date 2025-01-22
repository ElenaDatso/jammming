import React, { createContext, useContext, useState } from 'react';

export interface Track {
  track: string;
  singer: string;
  album: string;
  id: string;
}
interface TracksContextType {
  myTracks: Track[];
  searchList: Track[];
  addToMyTrack: (track: Track) => void;
  removeFromMyTrack: (trackId: string) => void;
}

const TrackContext = createContext<TracksContextType | undefined>(undefined);

export const TrackProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [myTracks, setMyTracks] = useState<Track[]>([]);
  const [searchList, ] = useState<Track[]>([]);
  const addToMyTrack = (track: Track) => {
    for (const item of myTracks) {
      if (item.id === track.id) {
        console.log('same!');
        return;
      }
    }
    setMyTracks((curTracks) => [...curTracks, track]);

  };
  const removeFromMyTrack = (trackId: string) => {
    setMyTracks((curList) => curList.filter((track) => track.id !== trackId));
  };
  return (
    <TrackContext.Provider
      value={{ myTracks, searchList, addToMyTrack, removeFromMyTrack }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTracksContext = (): TracksContextType => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error('useSongContext must be used within a SongProvider');
  }
  return context;
};
