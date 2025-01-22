import React, {useState} from 'react';
import Container from '../container/Container';
import SongItem from '../songItem/SongItem';
import Button from '../button/Button';
import { MdBorderColor, MdCheck } from 'react-icons/md';
import InputField from '../inputField/InputField';
import { BsFileMinus } from 'react-icons/bs';
import { useTracksContext } from '../context/TracksContext';


function MyListContainer() {

  const DEFAULT_LIST_NAME = 'My List Name';

  const { myTracks, removeFromMyTrack } = useTracksContext();

  const [isEditing, setIsEditing] = useState(false);
  const [listName, setListName] = useState(DEFAULT_LIST_NAME);

  console.log(listName);

  const onShowEditHandler = () => {
    setIsEditing((curIsEditing) => !curIsEditing);
  };
  const onSetListNameHandler = () => {
    setIsEditing(false);
    setListName(listName || DEFAULT_LIST_NAME);
  }
  const getInputValue = (inputValue: string) => {
    setListName(inputValue ? inputValue : DEFAULT_LIST_NAME)
  };

  return (
    <section className="flex h-full">
      <Container>
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="relative flex w-full">
              <InputField
                getInputValue={getInputValue}
                className="pr-[3rem]"
                initialInputValue={listName}
              />
              <div
                onClick={onSetListNameHandler}
                className="absolute right-0 text-blue-950 text-lg top-1/2 -translate-y-1/2 hover:text-blue-950/50 hover:cursor-pointer p-4"
              >
                <MdCheck />
              </div>
            </div>
          ) : (
            <>
              <h4>{listName}</h4>
              <div
                className="relative translate-x-2 text-lg p-3 hover:cursor-pointer hover:text-white/50"
                onClick={onShowEditHandler}
              >
                <MdBorderColor></MdBorderColor>
              </div>
            </>
          )}
        </div>
        <ul>
          {myTracks.map((item) => (
            <div key={item.id}>
              <li className="flex justify-between items-center">
                <SongItem
                  key={item.track}
                  track={item.track}
                  singer={item.singer}
                  album={item.album}
                />
                <div onClick={() => removeFromMyTrack(item.track)}>
                  <BsFileMinus
                    key={item.track}
                    className="hover:opacity-[0.5] hover:cursor-pointer p-1 w-auto h-auto"
                  />
                </div>
              </li>
              <hr />
            </div>
          ))}
        </ul>
        <div className="text-center">
          <Button
            className="mt-4"
            cb={() => {
              console.log('button');
            }}
          >
            Add to Spotify
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default MyListContainer;
