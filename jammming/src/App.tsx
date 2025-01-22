import './App.css';
import ResultsContainer from './components/resultContainer/ResultsContainer';
import Searchbar from './components/searchbar/Searchbar';
import MyListContainer from './components/myListContainer/MyListContainer';
import { TrackProvider } from './components/context/TracksContext';
import SpotifyLogin from './components/api/auth';

function App() {
  return (
    <TrackProvider>
      <div className="container grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-8">
        <Searchbar className="col-span-full lg:col-span-4 lg:col-start-3 mt-10 p-4"></Searchbar>
      </div>
      <div className="container grid grid-cols-3 gap-4 md:grid-cols-5 lg:grid-cols-8">
        <div className="col-span-full lg:col-span-4 ">
          <ResultsContainer></ResultsContainer>
        </div>
        <div className="col-span-full lg:col-span-4 ">
          <MyListContainer></MyListContainer>
        </div>
        <SpotifyLogin />
      </div>
    </TrackProvider>
  );
}

export default App;
