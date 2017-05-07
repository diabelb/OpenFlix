import * as jQuery from "jquery";
let $ = jQuery;
import 'bootstrap';

/**
 * Created by Dawid on 04.05.2017.
 */

$(document).ready(function () {
    const {ipcRenderer} = require('electron');
    ipcRenderer.on('play-movie-msg', function(event, movie) {
        $("#title").text("OpenFlix - " + movie.title + " - " + movie.url);
    });
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

