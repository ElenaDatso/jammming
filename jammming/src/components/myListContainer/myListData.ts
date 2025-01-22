type mySong = { track: string; singer: string; album: string; id: string };
export const myListData: mySong[] = [];
export const updateMyList = (item: mySong) => {
  console.log(item);
  myListData.push(item);
} 
