import { connectAutoComplete } from 'react-instantsearch-dom';
import React from 'react';

const Autocomplete = ({
  hits,
  currentRefinement,
  refine,
  onExclude = str => {
    console.log(str);
  },
}) => (
  <ul>
    <li>
      <input
        type="search"
        value={currentRefinement}
        onChange={event => refine(event.currentTarget.value)}
      />
    </li>
    {hits.map(hit => (
      <li key={hit.objectID}>
        {hit.name}{' '}
        <button
          onClick={() => {
            console.log(hit.objectID);
            onExclude('objectID', hit);
          }}
        >
          Exclude by objectID {hit.objectID}
        </button>
        {/* <button
          onClick={() => {
            console.log(hit.objectID);
            onExclude("rating", hit);
          }}
        >
          Exclude by rating {hit.rating}
        </button> */}
      </li>
    ))}
  </ul>
);

const CustomAutocomplete = connectAutoComplete(Autocomplete);

export default CustomAutocomplete;
