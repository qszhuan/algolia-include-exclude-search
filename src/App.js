import React, { useEffect, useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  SearchBox,
  connectRefinementList,
  Pagination,
  Highlight,
  RefinementList,
  CurrentRefinements,
  Configure,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';
import algoliaSearchClient from './searchClient';
import CustomCurrentRefinements from './customCurrentRefinements';
import { Stats } from 'react-instantsearch-dom';
import CustomAutocomplete from './customAutoComplete';

const indexName = 'instant_search';
const initialFacets = [];

const CustomRefinementList = connectRefinementList(
  ({ limit, items, refine, searchForItems }) => {
    // console.log('Length of CustomRefinementList', items);
    return (
      <>
        <input
          type="search"
          onChange={event => searchForItems(event.currentTarget.value)}
        />
        <ul className="custom-RefinementList">
          {items
            .filter(item => item.label[0] !== '-')
            .slice(0, limit / 2 + 1)
            .map(item => {
              const isNegativeRefined =
                item.value.indexOf('-' + item.label) > -1;
              const valueWithoutItself = item.value.filter(
                value => value !== item.label && value !== '-' + item.label
              );
              return (
                <li key={item.label}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isNegativeRefined}
                      onChange={() => {
                        console.log(
                          'refine param',
                          isNegativeRefined
                            ? valueWithoutItself
                            : [...valueWithoutItself, '-' + item.label]
                        );
                        refine(
                          isNegativeRefined
                            ? valueWithoutItself
                            : [...valueWithoutItself, '-' + item.label]
                        );
                      }}
                    />{' '}
                    - {item.label}
                  </label>
                </li>
              );
            })}
        </ul>
      </>
    );
  }
);

function App() {
  // useEffect(() => {
  //   searchClient
  //     .searchForFacetValues([
  //       {
  //         indexName,
  //         params: {
  //           facetName: 'brand',
  //           facetQuery: '',
  //           maxFacetHits: 100,
  //         },
  //       },
  //     ])
  //     .then(([{ facetHits }]) => {
  //       initialFacets.push(
  //         ...facetHits.map(facet => ({
  //           ...facet,
  //           label: facet.value,
  //           value: facet.value,
  //           isRefined: false,
  //           count: 0,
  //         }))
  //       );
  //     });

  //   searchClient
  //     .search([
  //       {
  //         indexName,
  //         params: {
  //           facetFilters:[['brand:Samsung'], ['brand:-Samsung'],["categories:Appliances"]],

  //           facets: ['brand', 'categories'],
  //           hitsPerPage: 1,
  //           maxValuesPerFacet: 2000
  //         },
  //       },
  //     ])
  //     .then(({ results }) => {
  //       console.log(results);
  //       // console.log(Object.keys(results[0].facets['brand']).length);
  //       // console.log(Object.keys(results[0].facets['categories']).length);
  //     });
  // }, []);
  const [filters, setfilters] = useState('');
  const [excludedItems, setExcludedItems] = useState([]);
  const [excludeFilterList, setExcludefilterList] = useState({});
  useEffect(() => {
    let newFilters = getFilters();
    setfilters(newFilters);
    console.log(excludeFilterList, newFilters);
  }, [excludeFilterList]);
  function onExclude(key, hit) {
    // setfilters(filters ? `${filters} AND (NOT ${key}:${hit[key]})` : `(NOT ${key}:${hit[key]})`);
    const excludeKeys = excludeFilterList[key] || [];
    excludeKeys.push(hit);
    let newFilterList = { ...excludeFilterList, [key]: excludeKeys }
    setExcludefilterList(newFilterList);
    setExcludedItems(newFilterList[key] ||[]);

  }
  function addBack(keyToAddBack, hit) {
    const list = excludeFilterList[keyToAddBack] || [];
    const newList = list.filter(item => item.objectID !== hit.objectID);
    let newFilterList = { ...excludeFilterList, [keyToAddBack]: newList };
    setExcludefilterList(newFilterList);
    setExcludedItems(newFilterList['objectID'] ||[]);

  }

  function getFilters() {
    let result = '';
    Object.keys(excludeFilterList).forEach(key => {
      if (excludeFilterList[key]) {
        const excludeStringForKey = excludeFilterList[key]
          .map(item => `(NOT ${key}:${item[key]})`)
          .join(' AND ');
        result = result
          ? `${result} AND ${excludeStringForKey}`
          : excludeStringForKey;
      }
    });
    return result;
  }
  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">react-instantsearch-app</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <InstantSearch
          searchClient={algoliaSearchClient}
          indexName="instant_search"
        >
          <div className="search-panel">
            <div className="search-panel__filters">
              <p> brands</p>
              <CustomCurrentRefinements
                inclusive={true}
                includeAttributes={['brand']}
                transformItems={items => {
                  return items.filter(item => {
                    return item.attribute === 'brand';
                  });
                }}
              />
              <RefinementList
                limit={20}
                defaultRefinement={['LG']}
                attribute="brand"
                transformItems={items =>
                  items.filter(item => item.label[0] !== '-')
                }
                searchable={true}
                showMore={true}
                showMoreLimit={100000}
              />
              <p> -brands</p>
              <CustomCurrentRefinements
                inclusive={false}
                includeAttributes={['brand']}
                transformItems={items => {
                  return items.filter(item => {
                    return item.attribute === 'brand';
                  });
                }}
              />
              <CustomRefinementList
                limit={100}
                attribute="brand"
                defaultRefinement={['-Samsung', '-Sony']}
                transformItems={items => items}
                searchable={true}
                // showMoreLimit={30}
              />
              <p>types</p>
              <CustomCurrentRefinements
                inclusive={false}
                transformItems={items => {
                  return items.filter(item => {
                    return item.attribute === 'type';
                  });
                }}
              />
              <CustomRefinementList
                limit={200}
                attribute="type"
                defaultRefinement={['-Otr mic', '-Pedestal']}
                transformItems={items => items}
              />

              <p> categories</p>
              <CustomCurrentRefinements
                inclusive={true}
                limit={20}
                includeAttributes={['categories']}
                transformItems={items =>
                  items.filter(item => item.attribute === 'categories')
                }
              />
              <RefinementList
                limit={20}
                attribute="categories"
                transformItems={items =>
                  items.filter(item => item.label[0] !== '-')
                }
              />
              <p> -categories</p>
              <CustomCurrentRefinements
                inclusive={false}
                includeAttributes={['categories']}
                transformItems={items => {
                  // console.log('currentRefinementItems', items);
                  return items.filter(item => {
                    // console.log('currentRefinements', item);
                    return item.attribute === 'categories';
                  });
                }}
              />
              <CustomRefinementList
                limit={40}
                attribute="categories"
                transformItems={items => items}
              />
            </div>

            <div className="search-panel__results">
              <Configure filters={filters} />
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
              />
              <ul>
                {excludedItems.map(item => (
                  <li key={`exclude-${item.objectID}`}>
                    <span>{item.objectID} : </span>
                    <span>{item.name}</span>
                    <button onClick={() => addBack('objectID', item)}>
                      Add Back
                    </button>
                  </li>
                ))}
              </ul>

              <CustomAutocomplete onExclude={onExclude} />
              <Stats />

              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

function Hit(props) {
  return (
    <article>
      <h1>
        <Highlight attribute="name" hit={props.hit} />
      </h1>
      <p>
        <div attribute="objectID">
          {props.hit.objectID}
          {/* <button
            onClick={() => {
              exclude('objectID', props.hit.objectID);
              console.log(props.hit.objectID);
            }}
          >
            Exclude
          </button> */}
        </div>
        <div attribute="objectID">{props.hit.objectID}</div>
      </p>
      <p>
        <Highlight attribute="description" hit={props.hit} />
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
