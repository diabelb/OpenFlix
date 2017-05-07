/**
 * Created by Dawid on 07.05.2017.
 */

import * as jQuery from "jquery";
let $ = jQuery;
import 'owl.carousel';
import {ipcRenderer} from "electron";

export class Carousel {
    static initOwlCarousel() {
    let owl = $('.owl-carousel');
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
    Carousel.owlMouseWheelEvent();
    Carousel.owlCarouselClickEvent();
}

    private static owlCarouselClickEvent() {
    $('.owl-carousel').on('click', '.poster', function (e) {
        ipcRenderer.send('play-movie-msg', {
            title: $(this).attr('title'),
            url: $(this).attr('url')
        });
    });
}

    private static owlMouseWheelEvent() {
    $('.owl-carousel').on('mousewheel', '.owl-stage', function (e) {
        console.log(e);
        if (e.originalEvent.deltaY > 0) {
            $('.owl-carousel').trigger('next.owl');
        } else {
            $('.owl-carousel').trigger('prev.owl');
        }
        e.preventDefault();
    });
}

    static hide() {
        $('.owl-carousel').hide();
    }

    static replace(data: any) {
        $('.owl-carousel').trigger('replace.owl.carousel', data);
        $('.owl-carousel').owlCarousel('update');
    }

    static show() {
        $('.owl-carousel').show();
    }
}
