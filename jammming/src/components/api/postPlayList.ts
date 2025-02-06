const serverUrl = 'http://localhost:3000/';

export const postPlayList = async (
  listName: string,
  listArray: string[] | []
) => {
  try {
    const response = await fetch(
      `${serverUrl}add-playlist?playListName=${listName}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: listArray }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const res = await response.json();
    console.log('play list resp', res);
    return res;
  } catch (error) {
    console.error('Error posting playlist:', error);
    throw Error("couldn't post list");
  }
};
