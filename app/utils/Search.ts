/**
 * Created by Dawid on 07.05.2017.
 */

import {RequestUtil} from "../../resources/utils/RequestUtil";
import {EKinoTv} from "../../resources/links/providers/EKinoTv";
import * as $ from "jquery";
import {FilmWeb} from "../../resources/content/FilmWeb";
import {Carousel} from "./Carousel";

export class Search {
    static init() {
        $(".search-input").focus();
        $(".search-input").on("change", function (e) {
            let searchMovie = $(this).val();
            let request = new RequestUtil();
            let contentProvider = new FilmWeb(request);
            let eKino = new EKinoTv(request, contentProvider);
            eKino.setQuery(searchMovie);
            Carousel.hide();
            let temp = '';
            $("#bottom").text("Wyszukuję  -  "+searchMovie+"...");
            eKino.getMoviesData(moviesData => {
                if (moviesData.imgUrl != '' && moviesData.url != '') {
                    temp += '<div class="poster" title="'+moviesData.title+'" url="'+moviesData.url+'"><img src="' + moviesData.imgUrl + '"/><span class="glyphicon glyphicon-play-circle play-icon"></span></div>';
                }
                console.log("TEMP:")
                console.log("temp: "+temp);
                if (moviesData.left == 0 && (moviesData.total == 0 || temp == '')) {
                    $("#bottom").text("Gotowe  -  nie znaleziono");
                }
                else if (moviesData.left == 0 && moviesData.total > 0) {
                    $("#bottom").text("Gotowe");
                    Carousel.replace(temp);
                    Carousel.show();
                }

            });
        });
    }
}