import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Switch, Route } from 'react-router-dom';

import CharacterList from './components/Characters/CharacterList';
import FilmList from './components/Films/FilmList';

function App() {
  const [films, setFilms] = useState([]);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const getFilms = async () => {
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/films`, {
        headers: {
          apikey: process.env.REACT_APP_SUPABASE_KEY,
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
        },
      });
      const data = await response.json();
      const filmArr = data.map((item) => {
        return [
          item.title,
          slugifyName(item.title),
          item.boxOfficeRevenueInMillions,
          item.academyAwardNominations,
        ];
      });
      setFilms(filmArr);
      return [];
    };

    const getCharacters = async () => {
      const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/characters`, {
        headers: {
          apikey: process.env.REACT_APP_SUPABASE_KEY,
          Authorization: `Bearer ${process.env.REACT_APP_SUPABASE_KEY}`,
        },
      });
      const data = await response.json();

      const characterArr = data.map((item) => {
        if (item.birth || item.death) {
          return { ...item, dates: (item.dates = `${item.birth} - ${item.death}`) };
        } else {
          return { ...item, dates: 'unknown' };
        }
      });
      setCharacters(characterArr);
      return [];
    };

    getFilms();
    getCharacters();
  }, [characters]);

  //from StackOverflow
  const slugifyName = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
    var to = 'aaaaeeeeiiiioooouuuunc------';
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // collapse whitespace and replace by -
      .replace(/-+/g, '-'); // collapse dashes

    return str;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavLink to="/films" data-testid="film-link">
            Films
          </NavLink>
          <NavLink to="/characters" data-testid="char-link">
            Characters
          </NavLink>
        </header>

        <Switch>
          <Route path="/characters">
            <CharacterList characters={characters} />
          </Route>
          <Route path="/films">
            <FilmList films={films} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
