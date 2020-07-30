import { connectCurrentRefinements } from 'react-instantsearch-dom';
import React from 'react';

const CurrentRefinements = ({ items, refine, createURL, inclusive=true }) => {
  // console.log('current refinments', items);
  return (
    <ul>
      {items.map((item, idx) => (
        <li key={item.label + idx}>
          {item.items ? (
            <React.Fragment>
              {item.label}
              <ul>
                {item.items
                  .filter(nested =>
                    inclusive
                      ? nested.label[0] !== '-'
                      : nested.label[0] === '-'
                  )
                  .map((nested, index) => (
                    <li key={nested.label + index}>
                      <a
                        href={createURL(nested.value)}
                        onClick={event => {
                          event.preventDefault();
                          refine(nested.value);
                        }}
                      >
                        {nested.label}
                      </a>
                    </li>
                  ))}
              </ul>
            </React.Fragment>
          ) : (
            <a
              href={createURL(item.value)}
              onClick={event => {
                event.preventDefault();
                refine(item.value);
              }}
            >
              {item.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  );
};

const CustomCurrentRefinements = connectCurrentRefinements(CurrentRefinements);

export default CustomCurrentRefinements;
