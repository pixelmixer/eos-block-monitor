import { OMDB_API, POSTER_API } from '../constants/constants';

// The OMDB class does most of the heavy lifting with the API
// Normally, we'd want to use a proper model here, but we're just searching pretty much.
export default class OMDB {

  // Search method grab the search results.
  // Uses localstorage to cache results for nearly instant results after the first search and allows this to work offline.
  static async search(term, page = 1) {
    const termkey = `${term}-${page}`;
    const savedResult = JSON.parse(localStorage.getItem(termkey));
    try {
      const result = savedResult || (await fetch(`${OMDB_API}&s=${term}&page=${page}`)).json();

      if (!savedResult) {
        localStorage.setItem(termkey, JSON.stringify(await result))
      }

      return result;
    } catch (e) {
      return { Response: 'False', Error: `Failed to load results.` }
    }
  }

  static async getDetails(imdbID) {
    const savedResult = JSON.parse(localStorage.getItem(imdbID));
    const result = savedResult || (await fetch(`${OMDB_API}&plot=summary&i=${imdbID}`)).json();
    if (!savedResult) {
      localStorage.setItem(imdbID, JSON.stringify(await result))
    }

    return result;
  }

  static async getPoster(imdbID) {
    try {
      const result = await fetch(`${POSTER_API}&i=${imdbID}`);
      if (!result.ok) {
        throw new Error(result.statusText);
      }
      return result.url;
    } catch (e) {
      return false;
    }
  }
}
