import '../css/App.css';
import GameBoard from './GameBoard.js';
import Chat from "./Chat";

function App() {
  return (
    <div className="App flex">
        <div className="w-1/5">
            <Chat />
        </div>
        <div className="w-4/5 flex items-center justify-center">
            <GameBoard />
        </div>
    </div>
  );
}

export default App;
