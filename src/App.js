import React, { useEffect } from 'react';
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
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';
import algoliaSearchClient from './searchClient';
import CustomCurrentRefinements from './customCurrentRefinements';
import { Stats } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);
const indexName = 'instant_search';
const initialFacets = [];

const CustomRefinementList = connectRefinementList(
  ({ limit, items, refine }) => {
    console.log('Length of CustomRefinementList', items);
    return (
      <ul className="custom-RefinementList">
        {items
          .filter(item => item.label[0] !== '-')
          .slice(0, limit / 2 + 1)
          .map(item => {
            const isNegativeRefined = item.value.indexOf('-' + item.label) > -1;
            const valueWithoutItself = item.value.filter(
              value => value !== item.label && value !== '-' + item.label
            );
            // console.log(isNegativeRefined, item.value);
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
                  console.log('currentRefinementItems', items);
                  return items.filter(item => {
                    console.log('currentRefinements', item);
                    return item.attribute === 'brand';
                  });
                }}
              />
              <RefinementList
                limit={20}
                defaultRefinement={['LG']}
                attribute="brand"
                transformItems={
                  items => items.filter(item => item.label[0] !== '-')
                  //.reverse()
                  // .slice(0, 20)
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
                  console.log('currentRefinementItems', items);
                  return items.filter(item => {
                    console.log('currentRefinements', item);
                    return item.attribute === 'brand';
                  });
                }}
              />
              <CustomRefinementList
                limit={40}
                // operator={'and'}
                attribute="brand"
                //defaultRefinement={['-Samsung', '-Sony']}
                transformItems={
                  items => items
                  //  .reverse()
                  //  .slice(0, 20)
                }
                showMore={true}
                showMoreLimit={30}
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
                // operator={'and'}
                attribute="type"
               defaultRefinement={['-Otr mic', '-Pedestal']}
                transformItems={
                  items => items
                  //  .reverse()
                  //  .slice(0, 20)
                }
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
                transformItems={
                  items => items.filter(item => item.label[0] !== '-')
                  // .reverse()
                  // .slice(0, 20)
                }
              />
              <p> -categories</p>
              <CustomCurrentRefinements
                inclusive={false}
                includeAttributes={['categories']}
                transformItems={items => {
                  console.log('currentRefinementItems', items);
                  return items.filter(item => {
                    console.log('currentRefinements', item);
                    return item.attribute === 'categories';
                  });
                }}
              />
              <CustomRefinementList
                limit={40}
                attribute="categories"
                transformItems={
                  items => items
                  //  .reverse()
                  // .slice(0, 20)
                }
              />
            </div>

            <div className="search-panel__results">
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
              />
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
        <Highlight attribute="description" hit={props.hit} />
      </p>
    </article>
  );
}

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default App;
