// lessons.js
// Handles loading extra tips from local JSON using jQuery AJAX.

/* global $, document */

(function () {
    "use strict";

    var tipsUrl = "data/tips.json";

    function renderTips(tips) {
        var list = document.getElementById("tipsList");
        var status = document.getElementById("tipsStatus");

        if (!list) {
            return;
        }

        list.innerHTML = "";
        tips.forEach(function (tip) {
            var li = document.createElement("li");
            li.textContent = tip;
            list.appendChild(li);
        });

        if (status) {
            status.textContent = "Tips loaded successfully.";
        }
    }

    function loadTips() {
        var status = document.getElementById("tipsStatus");
        if (status) {
            status.textContent = "Loading tips...";
        }

        $.getJSON(tipsUrl)
            .done(function (data) {
                if (Array.isArray(data.tips)) {
                    renderTips(data.tips);
                } else if (status) {
                    status.textContent = "No tips found in the JSON file.";
                }
            })
            .fail(function () {
                if (status) {
                    status.textContent = "Unable to load tips at this time.";
                }
            });
    }

    function init() {
        var button = document.getElementById("loadTipsBtn");
        if (!button) {
            return;
        }

        button.addEventListener("click", function () {
            loadTips();
        });
    }

    $(document).ready(function () {
        init();
    });
}());
