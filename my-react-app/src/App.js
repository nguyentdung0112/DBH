import "./App.css";
import AppFooter from "./components/footer/Footer";
import AppHeader from "./components/header/AppHeader";

import "react-toastify/dist/ReactToastify.css";
import RoomList from "./components/room/RoomList";

function App() {
  return (
    <div className="App">
      <header id="header">
        <AppHeader />
      </header>
      <main style={{ marginTop: 30 }}>
        <RoomList/>
      </main>
      <footer id="footer">
        <AppFooter />
      </footer>
    </div>
  );
}

export default App;
