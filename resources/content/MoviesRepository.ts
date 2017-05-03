import {EKinoTv} from "./providers/EKinoTv";
import {Provider} from "./Provider";
import {SyncRequestUtil} from "../utils/SyncRequestUtil";
import {FilmyTo} from "./providers/FilmyTo";

/**
 * Created by Dawid on 02.05.2017.
 */

export class MoviesRepository {
    private contentProviders = [EKinoTv, FilmyTo];
    private requestUtil: SyncRequestUtil;

    constructor(requestUtil?: SyncRequestUtil) {
        if (requestUtil) {
            this.requestUtil = requestUtil;
        }
        else {
            this.requestUtil = new SyncRequestUtil();
        }
    }

    search(movieQuery: string) {
        let moviesList = [];
        for (let contentProvider of this.contentProviders) {
            let provider : Provider;
            provider = new (<any>contentProvider)(this.requestUtil);
            provider.setQuery(movieQuery);
            let providerMoviesList = provider.getMoviesWithProviderLinks();

            if (providerMoviesList[0]) {
                moviesList = moviesList.concat(providerMoviesList);
            }
        }
        return moviesList;
    }
}