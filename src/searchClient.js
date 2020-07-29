import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

function getNewRequests(requests) {
  const newRequest =requests;

  for (const request of newRequest) {
    const facetFilters = request.params.facetFilters;
    if (!facetFilters) {
      continue;
    }
    const newFacetFilters = [];
    for (const facetFilter of facetFilters) {
      if (facetFilter && facetFilter.length > 0) {
        const negFilters = [];
        const posFilters = [];
        for (const each of facetFilter) {
          if (each.indexOf(':-') > -1) {
            newFacetFilters.push([each]);
          } else {
            posFilters.push(each);
          }
        }
        if (negFilters.length > 0) {
          newFacetFilters.push(negFilters);
        }
        if (posFilters.length > 0) {
          newFacetFilters.push(posFilters);
        }
      }
    }
    request.params.facetFilters = newFacetFilters;
  }
  return newRequest;
}
const algoliaSearchClient = {
  async search(requests) {
    console.log('old', requests);
    const newRequests = getNewRequests(requests);
    console.log('new', newRequests);
    return await searchClient.search(newRequests);
  },
  async searchForFacetValues(requests){
    return await searchClient.searchForFacetValues(requests);
  }
};

export default algoliaSearchClient;
