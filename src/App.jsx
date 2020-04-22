import React, { useState, useEffect } from 'react';

import Search from './components/Search.jsx';
import CharacterCard from './components/CharacterCard.jsx';
import NotFound from './components/NotFound.jsx';

import { defaultCharacters } from './utils/enums';
import formatCharacters from './utils/formatCharacters';
import search from './utils/search';

const App = () => {
  const [characters, setCharacters] = useState(null);
  const [displayCharacters, setDisplayCharacters] = useState(defaultCharacters);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const fetchCharacters = async () => {
        const characterPromise = await fetch('/characters');
        const characters = await characterPromise.json();

        setCharacters(formatCharacters(characters));
        setIsLoading(false);
      };
    } catch (err) {
      console.log(`Fetch failed with ${err}`);
    }

    fetchCharacters();
  }, []);

  const onSearch = (event) => {
    setSearchQuery(event.target.value);

    if (!event.target.value) {
      setDisplayCharacters(defaultCharacters);
    } else {
      setIsLoading(true);
      setDisplayCharacters(search(event.target.value, Object.keys(characters)));
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="title-container">
        <h1>Breaking Bad Character Index</h1>
      </div>
      <Search onSearch={onSearch} searchQuery={searchQuery} />
      <div className="character-container">
        {!isLoading ? (
          displayCharacters.length ? (
            displayCharacters.map((displayCharacter) => (
              <CharacterCard
                character={characters[displayCharacter]}
                key={characters[displayCharacter].char_id}
              />
            ))
          ) : (
            <NotFound />
          )
        ) : (
          // animated spinner source - https://loading.io/css/
          <div className="loading-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
