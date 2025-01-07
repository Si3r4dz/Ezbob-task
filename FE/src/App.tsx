import React from 'react';
import SearchProvider from './components/SearchProvider/SearchProvider';
import SearchInput from './components/SearchInput/SearchInput';
import SearchResults from './components/SearchResults/SearchResults';
import './App.css';

function App() {

  return (
    <SearchProvider>
      <div className="container">
        <div className="logo">
          <img
            src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
            alt="Google-like logo"
          />
        </div>
      <div className="search-container">
        <SearchInput />
        <SearchResults />
      </div>
      </div>
    </SearchProvider>
  );
}

export default App;
