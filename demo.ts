/**
 * Created by Dawid on 30.04.2017.
 */

import {HostFactory} from "./resources/hosts/HostFactory";
import {MoviesRepository} from "./resources/content/MoviesRepository";
import {SyncRequestUtil} from "./resources/utils/SyncRequestUtil";

//let host = HostFactory.getHost("https://openload.co/embed/g3W0LDYZhYY");
//let mediaLink = host.getMediaLink();
//console.log(mediaLink);
//host.setUrl('https://openload.co/embed/T71J_v66AD4');
//mediaLink = host.getMediaLink();
//console.log(mediaLink);

//let request = new SyncRequestUtil();
let content = new MoviesRepository();
let movies = content.search("harry potter");
console.log(movies);