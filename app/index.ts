import {RequestUtil} from "../resources/utils/RequestUtil";
import {EKinoTvAsync} from "../resources/content/providers/EKinoTv";

import * as jQuery from "jquery";
let $ = jQuery;
import 'owl.carousel';
import 'bootstrap';

/**
 * Created by Dawid on 04.05.2017.
 */

$(document).ready(function () {

    let request = new RequestUtil();
    let eKino = new EKinoTvAsync(request);
    owlCarousel();
    $('.owl-carousel').hide();
    eKino.setQuery("harry potter");
    eKino.getMoviesWithHostLinks(function (link) {
        console.log(link);
        $('.owl-carousel')
            .owlCarousel('add', '<div class="poster"><img src="posters/'+Math.floor((Math.random() * 4) + 1)+'.jpg"/><span class="glyphicon glyphicon-play-circle play-icon"></span></div>');

        $('.poster').off('mouseenter mouseleave');
        $('.poster').off('hover');
        $(".poster").hover(
            function (e) {
                $(this).find(".play-icon").show();
            },
            function (e) {
                $(this).find(".play-icon").hide();
            });
        if (link.left == 0) {


            $(".play-icon").hide();
            $('.owl-carousel').owlCarousel('update');
            $('.owl-carousel').show();
        }



    });
});

function owlCarousel() {
    let owl = $('.owl-carousel');
    let owlInstance = owl.data('owlCarousel');
    if(owlInstance != null) {
        owlInstance.reinit();
    }
    else {
        owl.owlCarousel({
            loop: true,
            nav: false,
            margin: 4,
            center: true,
            responsive: {
                600: {
                    items: 4
                },
            }
        });
        owl.on('mousewheel', '.owl-stage', function (e) {
            console.log(e);
            if (e.originalEvent.deltaY > 0) {
                owl.trigger('next.owl');
            } else {
                owl.trigger('prev.owl');
            }
            e.preventDefault();
        });
    }
}

