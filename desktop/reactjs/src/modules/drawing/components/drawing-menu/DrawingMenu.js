import React from 'react';
import { useState, useEffect } from 'react';
import './DrawingMenu.scss';

var searchTimeout = null;

const DrawingMenu = (props) => {
  const {
    menuOpen, setMenuOpen, activeDrawing, setActiveDrawing, canvas, setSavingState, erase, triggerSave, setTriggerSave,
    savingRef, save, search, loadDrawing
  } = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [tags, setTags] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const closeMenu = () => {
    setMenuOpen(false);
    setSearchTerm('');
    setTags('');
  };

  useEffect(() => {
    clearTimeout(searchTimeout);

    if (!searchTerm.length && searchResults.length) {
      setSearchResults([]);
    } else {
      if (searchTerm.length || tags.length) {
        searchTimeout = setTimeout(() => {
          search(searchTerm, tags, setSearchResults);
        }, 500);
      }
    }
  }, [searchTerm, tags]);
  
  return (
    <div className={`DrawingMenu ${menuOpen ? 'open' : ''}`}>
      <h2>Save or load drawing</h2>
      <input type="text" className="DrawingMenu__search-input" placeholder="drawing name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      <input type="text" className="DrawingMenu__tag-input" placeholder="tags" value={tags} onChange={(e) => setTags(e.target.value)}/>
      <div className="DrawingMenu__btns">
        <button type="button" onClick={() => closeMenu(setMenuOpen, setSearchTerm, setTags)}>Cancel</button>
        <button
          type="button"
          onClick={() => save(
            {
              name: searchTerm,
              tags: tags
            },
            setSavingState, setMenuOpen, canvas, setTriggerSave, closeMenu, undefined, setActiveDrawing)}
        >Save</button>
      </div>
      <div className={`DrawingMenu__search-results ${searchResults.length ? 'open' : ''}`}>
        {searchResults.map((searchResult, index) =>
          <div
            key={index}
            className="DrawingMenu__search-result"
            onClick={() => loadDrawing(searchResult, canvas, setMenuOpen, setSearchTerm, setTags, erase, setActiveDrawing, closeMenu)}
          >{searchResult.name}</div>
        )}
      </div>
    </div>  
  );
}

export default DrawingMenu;
