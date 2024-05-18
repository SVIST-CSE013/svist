$(function () {

    "use strict";

    //======topbar js======
    $(".close_topbar").on("click", function () {
        $(".topbar").addClass("hide_topbar");
    });


    //======menu search js======
    $(".menu_search_icon").on("click", function () {
        $(".menu_search").addClass("show_search");
    });

    $(".close_search").on("click", function () {
        $(".menu_search").removeClass("show_search");
    });


    //======menu fix js======

    // Get the .main_menu element
    var mainMenu = document.querySelector('.main_menu');

    // Add a scroll event listener to the window
    window.addEventListener('scroll', function() {
        // Get the current scroll position
        var scrolling = window.scrollY || window.pageYOffset;

        // Get the initial offsetTop of .main_menu
        var navoff = mainMenu.offsetTop;

        // Check if the scroll position is greater than the initial offsetTop of .main_menu
        if (scrolling > navoff) {
            // Add the 'menu_fix' class to .main_menu
            mainMenu.classList.add('menu_fix');
        } else {
            // Remove the 'menu_fix' class from .main_menu
            mainMenu.classList.remove('menu_fix');
        }
    });




    // //=======TEAM SLIDER======
    // $('.team_slider').slick({
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     autoplay: true,
    //     autoplaySpeed: 4000,
    //     dots: true,
    //     arrows: false,
    //     responsive: [
    //         {
    //             breakpoint: 1400,
    //             settings: {
    //                 slidesToShow: 3,
    //             }
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 3,
    //             }
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 2,
    //             }
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //             }
    //         },
    //         {
    //             breakpoint: 576,
    //             settings: {
    //                 arrows: false,
    //                 slidesToShow: 1,
    //             }
    //         }
    //     ]
    // });

    // //=======TESTI SLIDER======
    // $('.testi_slider').slick({
    //     slidesToShow: 2,
    //     slidesToScroll: 1,
    //     autoplay: false,
    //     autoplaySpeed: 4000,
    //     dots: false,
    //     arrows: true,
    //     nextArrow: '<i class="far fa-angle-right nextArrow"></i>',
    //     prevArrow: '<i class="far fa-angle-left prevArrow"></i>',
    //     responsive: [
    //         {
    //             breakpoint: 1400,
    //             settings: {
    //                 slidesToShow: 2,
    //             }
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 2,
    //             }
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 1,
    //             }
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 arrows: false,
    //                 slidesToShow: 1,
    //             }
    //         },
    //         {
    //             breakpoint: 576,
    //             settings: {
    //                 arrows: false,
    //                 slidesToShow: 1,
    //             }
    //         }
    //     ]
    // });

    // //=======BLOG SLIDER======
    // $('.blog_slider').slick({
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     autoplay: true,
    //     autoplaySpeed: 4000,
    //     dots: true,
    //     arrows: false,
    //     responsive: [
    //         {
    //             breakpoint: 1400,
    //             settings: {
    //                 slidesToShow: 3,
    //             }
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 2,
    //             }
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 2,
    //             }
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //             }
    //         },
    //         {
    //             breakpoint: 576,
    //             settings: {
    //                 arrows: false,
    //                 slidesToShow: 1,
    //             }
    //         }
    //     ]
    // });


    //*=======SCROLL BUTTON=======
    $('.scroll_btn').on('click', function () {
        $('html, body').animate({
            scrollTop: 0,
        }, 300);
    });

    $(window).on('scroll', function () {
        var scrolling = $(this).scrollTop();

        if (scrolling > 500) {
            $('.scroll_btn').fadeIn();
        } else {
            $('.scroll_btn').fadeOut();
        }
    });


    // *========STICKY SIDEBAR=======
    $("#sticky_sidebar").stickit({
        top: 90,
    })


    //======wow js=======
    new WOW().init();


    //======MOBILE MENU BUTTON=======
    $(".navbar-toggler").on("click", function () {
        $(".navbar-toggler").toggleClass("show");
    });


});
