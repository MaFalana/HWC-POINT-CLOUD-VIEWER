import { FaRegMap } from "react-icons/fa"; 
import { IoGrid } from "react-icons/io5";
import { FaListUl } from "react-icons/fa6";
import React from 'react';

export function ViewToggle({ view, setView }) {
  return (
    <div className="hdr-toggles">
      <button 
        onClick={() => setView('map')}
        className={view === 'map' ? 'active' : ''}
        aria-label="Map view"
      >
        <FaRegMap />
      </button>

      <button 
        onClick={() => setView('card')}
        className={view === 'card' ? 'active' : ''}
        aria-label="Card view"
      >
        <IoGrid />
      </button>

      <button 
        onClick={() => setView('list')}
        className={view === 'list' ? 'active' : ''}
        aria-label="List view"
      >
        <FaListUl />
      </button>
    </div>
  );
}

