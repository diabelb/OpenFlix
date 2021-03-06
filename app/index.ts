import * as jQuery from "jquery";
let $ = jQuery;
import 'bootstrap';
import {Carousel} from "./utils/Carousel";
import {Search} from "./utils/Search";


/**
 * Created by Dawid on 04.05.2017.
 */

$(document).ready(function () {
    Carousel.initOwlCarousel();
    Search.init();
});



(function () {

    const remote = require('electron').remote;

    function init() {
        document.getElementById("min-btn").addEventListener("click", function (e) {
            const window = remote.getCurrentWindow();
            window.minimize();
        });

        document.getElementById("close-btn").addEventListener("click", function (e) {
            const window = remote.getCurrentWindow();
            window.close();
        });
    };

    document.onreadystatechange = function () {
        if (document.readyState == "complete") {
            init();
        }
    };
})();

