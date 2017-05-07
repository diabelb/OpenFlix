import * as jQuery from "jquery";
import * as videojs from 'video.js';
let $ = jQuery;
import 'bootstrap';

/**
 * Created by Dawid on 04.05.2017.
 */

$(document).ready(function () {
    const {ipcRenderer} = require('electron');
    $('#my-video').hide();
    ipcRenderer.on('play-movie-msg', function(event, movie) {
        $("#title").text("OpenFlix - " + movie.title);
        //let videojs = require('video.js');

        let player = videojs('my-video');

        player.ready(function() {
            player.src({
                src: movie.url,
                type: 'video/mp4'
            });
            player.play();
            $('#my-video').show();
        });

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

