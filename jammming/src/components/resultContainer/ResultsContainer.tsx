import React from 'react';
import SongItem from '../songItem/SongItem';
import Container from '../container/Container';
import tracksData from './tracksData';
import { BsPlus } from 'react-icons/bs';
import { useTracksContext, Track } from '../context/TracksContext';

function ResultsContainer() {
  const { addToMyTrack } = useTracksContext();
  return (
    <section className="flex h-full">
      <Container>
        <h4>Search result</h4>
        <ul>
          {tracksData.tracks.items.map((item) => (
            <div key={item.name}>
              <li className="flex justify-between items-center">
                <SongItem
                  track={item.name}
                  singer={item.artists[0].name}
                  album={item.album.name}
                />
                <div
                  onClick={() =>{
                    const track: Track = {
                      track: item.name,
                      singer: item.artists[0].name,
                      album: item.album.name,
                      id: item.name,
                    };
                    addToMyTrack(track);
                    }
                  }
                >
                  <BsPlus className="hover:opacity-[0.5] hover:cursor-pointer p-1 w-auto h-auto" />
                </div>
              </li>
              <hr />
            </div>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default ResultsContainer;
