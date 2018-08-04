import { OMDB_API, POSTER_API } from '../constants/constants';

export default class OMDB {
  static async search( term, page = 1 ) {
    const result = await fetch(`${OMDB_API}&s=${term}&page=${page}`);
    return result.json();
  }

  static async getDetails(imdbID) {
    const result = await fetch(`${OMDB_API}&plot=summary&i=${imdbID}`);
    return result.json();
  }
}
