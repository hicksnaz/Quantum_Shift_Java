// main.js
// Shared behavior for all Quantum Shift pages.

/* global $, document */

(function () {
    "use strict";

    function setCurrentYear() {
        var span = document.getElementById("year");
        if (span) {
            span.textContent = new Date().getFullYear();
        }
    }

    function initAccordionAndTabs() {
        if ($("#faq-accordion").length) {
            $("#faq-accordion").accordion({
                heightStyle: "content",
                collapsible: true
            });
        }

        if ($("#lesson-tabs").length) {
            $("#lesson-tabs").tabs();
        }
    }

    $(document).ready(function () {
        setCurrentYear();
        initAccordionAndTabs();
    });
}());
