import { OMDB_API, POSTER_API } from '../constants/constants';

export default class OMDB {
  static async search( term ) {
    const result = await fetch(`${OMDB_API}&t=${term}&page=1&plot=short`);
    return result.json();
  }
}
