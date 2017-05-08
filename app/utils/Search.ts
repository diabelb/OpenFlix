/**
 * Created by Dawid on 07.05.2017.
 */

import {RequestUtil} from "../../resources/utils/RequestUtil";
import {EKinoTv} from "../../resources/links/providers/EKinoTv";
import * as $ from "jquery";
import {Carousel} from "./Carousel";

export class Search {
    static init() {
        $(".search-input").focus();
        $(".search-input").on("change", function (e) {
            let searchMovie = $(this).val();
            let request = new RequestUtil();
            let eKino = new EKinoTv(request);
            eKino.setQuery(searchMovie);
            Carousel.hide();
            let temp = '';
            $("#bottom").text("Wyszukuję  -  "+searchMovie+"...");
            eKino.getAllMoviesData(moviesData => {
                if (moviesData.length == 0) {
                    $("#bottom").text("Gotowe  -  nie znaleziono");
                }
                else {
                    for (let movie of moviesData) {
                        temp += '<div class="poster" title="'+movie.title+'" url="'+movie.url+'"><img src="' + movie.imgUrl + '" height="285px"/><span class="glyphicon glyphicon-play-circle play-icon"></span></div>';
                    }

                    $("#bottom").text("Gotowe - Znaleziono - " + moviesData.length);
                    Carousel.replace(temp);
                    Carousel.show();
                }
            });
        });
    }
}