// funfacts.js
// Simple jQuery UI tooltip plugin that shows random fun facts loaded from JSON.

/* global $, document */

(function () {
    "use strict";

    var factsUrl = "data/funfacts.json";
    var facts = null;

    function randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function loadFacts() {
        return $.getJSON(factsUrl).done(function (data) {
            facts = data;
        });
    }

    function initTooltips() {
        if (!$(".funfact-trigger").length) {
            return;
        }

        $(document).tooltip({
            items: ".funfact-trigger",
            track: true,
            show: {
                effect: "slideDown",
                delay: 120,
                duration: 200
            },
            hide: {
                effect: "fadeOut",
                duration: 150
            },
            content: function () {
                var key = $(this).data("key");
                if (facts && facts[key]) {
                    return randomItem(facts[key]);
                }
                return "Loading fun facts…";
            }
        });
    }

    $(document).ready(function () {
        loadFacts().always(function () {
            initTooltips();
        });
    });
}());
