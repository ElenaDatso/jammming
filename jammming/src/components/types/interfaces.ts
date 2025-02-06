export interface myTrack {
  track: string;
  singer: string;
  album: string;
  id: string;
  uri: string;
}
export interface Track {
  name: string;
  artists: [
    {
      name: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [string: string]: any;
    }
  ];
  album: {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [string: string]: any;
  };
  id: string;
  uri: string;
}