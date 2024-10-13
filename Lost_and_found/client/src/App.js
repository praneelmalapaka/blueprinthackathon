import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          UNSW Lost an Found
        </p>
        <p>
          Lose Something?
        </p>
        <p>
          Find Something?
        </p>
        <p>
          Crazy, didnt ask
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom'; // No need to specify node_modules
// import ReportLostForm from './ReportLostForm';
// import ReportFoundForm from './ReportFoundForm';
// import ItemView from './ItemView';
// import MatchItems from './MatchItems';
// // Import your Home component if you have one: import Home from './components/Home';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* <Route path="/" element={<Home />} />  */}
//         <Route path="/report-lost" element={<ReportLostForm />} />
//         <Route path="/report-found" element={<ReportFoundForm />} />
//         <Route path="/item/:itemId" element={<ItemView />} />
//         <Route path="/matches" element={<MatchItems />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;