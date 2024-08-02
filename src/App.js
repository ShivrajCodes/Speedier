import React from 'react';
//import AnimatedText from './components/AnimatedText';
import SpeedTest from './components/SpeedTest';
import './tailwind.css';
import './index.css'
import './App.css';

const App = () => {
  return (
    <div className="App bg-black min-h-screen flex flex-col items-center justify-center text-white">
      {/* <AnimatedText /> */}
      <SpeedTest />
    </div>
  );
};

export default App;
