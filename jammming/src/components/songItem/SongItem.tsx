import React from 'react';

function SongItem({
  track, singer, album
}: {track: string, singer: string, album: string}) {
  return (
    <>
      <div className="song_container flex justify-between items-center my-4">
        <div className="flex flex-col items-start">
          <p className="song_name font-semibold">{track}</p>
          <p className="font-thin text-sm	">
            <span className="author_name">{singer}</span>
            <span className="separator mx-1">|</span>
            <span className="album_name">{album}</span>
          </p>
        </div>
      </div>
    </>
  );
}

export default SongItem;
