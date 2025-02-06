import React, { createContext, useContext, useEffect, useState } from 'react';
import { myTrack, Track } from '../types/interfaces';




interface TracksContextType {
  myTracks: myTrack[];
  searchList: Array<Track> | [];
  addSearchedList: (listlist: Array<Track> | []) => void;
  addToMyTrack: (track: myTrack) => void;
  removeFromMyTrack: (trackId: string) => void;
}

const TrackContext = createContext<TracksContextType | undefined>(undefined);

export const TrackProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [myTracks, setMyTracks] = useState<myTrack[]>([]);
  const [searchList, setSearchedList] = useState<
    Array<Track> | []
  >([]);
  const addToMyTrack = (track: myTrack) => {
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
  const addSearchedList = (list: Array<Track> | []) => {
    setSearchedList(list);
  };
  useEffect(() => {
    console.log(searchList)
  }, [searchList])
  return (
    <TrackContext.Provider
      value={{
        myTracks,
        searchList,
        addToMyTrack,
        removeFromMyTrack,
        addSearchedList,
      }}
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
