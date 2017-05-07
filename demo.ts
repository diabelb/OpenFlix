/**
 * Created by Dawid on 30.04.2017.
 */

import {HostFactory} from "./resources/hosts/HostFactory";
import {MoviesRepository} from "./resources/links/MoviesRepository";
import {SyncRequestUtil} from "./resources/utils/SyncRequestUtil";
import {FilmyTo} from "./resources/links/providers/FilmyTo";
import {RequestUtil} from "./resources/utils/RequestUtil";
import {EKinoTv} from "./resources/links/providers/EKinoTv";
import {FilmWeb} from "./resources/content/FilmWeb";

let request = new RequestUtil();
//let filmyTo = new FilmyTo(request);
//filmyTo.getMovieHtml("http://filmy.to/film/Harry_Potter_i_Ksiaze_Polkrwi-2009,531");

let hostFactory = new HostFactory();
let host = hostFactory.getHost("https://openload.co/embed/VYhMEpj9do0");
let mediaLink = host.getMediaLink();
console.log(mediaLink);

//host = hostFactory.getHost("http://vshare.io/v/49869bd/width-600/height-400/");
//mediaLink = host.getMediaLink();
//console.log(mediaLink);

//let request = new SyncRequestUtil();
//let links = new MoviesRepository();
///let movies = links.search("harry potter");
//console.log(movies);

/*let eKino = new EKinoTv(request, new FilmWeb(request));
eKino.setQuery("Dzieciak rządzi");

eKino.getMoviesData(data => {
    console.log(data);
});*/
