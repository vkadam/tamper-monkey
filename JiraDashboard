// ==UserScript==
// @name       Pretify Jira Dashboard
// @namespace  https://github.com/vkadam/
// @version    0.1
// @description  enter something useful
// @match      http://jira.cengage.com/**
// @copyright  2012+, You
// ==/UserScript==

var JiraDashboard = (function() {

    var jiraStylesheet = (function() {
        var stylesheet;

        this.init = function() {
            // Create the <style> tag
            var style = document.createElement('style');

            // Add a media (and/or media query) here if you'd like!
            // style.setAttribute('media', 'screen')
            // style.setAttribute('media', '@media only screen and (max-width : 1024px)')

            // WebKit hack :(
            style.appendChild(document.createTextNode(''));

            // Add the <style> element to the page
            document.head.appendChild(style);

            stylesheet = style.sheet;
        }

        this.addRule = function(selector, rule) {
            if (stylesheet.addRule) {
                stylesheet.addRule(selector, rule);
            } else if (stylesheet.insertRule) {
                stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
            }
        }
        return this;
    })();

    jiraStylesheet.init();
    jiraStylesheet.addRule('#js-filter-toggle', 'z-index: 1; right: -3px; top: 3px; background-position:5px -547px !important');
    jiraStylesheet.addRule('#announcement-banner', 'display:none !important');
    jiraStylesheet.addRule('#js-filter-toggle .ghx-icon', 'background-position:5px -547px');
    jiraStylesheet.addRule('.closed .ghx-icon', 'background-position:-20px -547px !important');


    function createFilterToggle() {
        var toggleFilter,
            filterDiv = jQuery('#ghx-operations'),
            workDiv = jQuery('#ghx-work'),
            ghxPoolDiv = jQuery('#ghx-pool'),
            ghxColumnHeaderGroupDiv = jQuery('#ghx-column-header-group');
        toggleFilter = jQuery('#js-compact-toggle').clone();
        toggleFilter.attr('id', 'js-filter-toggle');

        var setLastValues = false,
            ghxPoolLastPadding,
            ghxColumnHeaderGroupLastTop,
            workDivHeight;

        toggleFilter.on('click', function() {
            /* Show filter div */
            workDivHeight = workDiv.height();
            if (setLastValues) {
                filterDiv.show();
                workDivHeight -= filterDiv.height();
                workDivHeight -= 20;
                ghxPoolDiv.css('padding-top', ghxPoolLastPadding);
                ghxColumnHeaderGroupDiv.css('top', ghxColumnHeaderGroupLastTop);
                setLastValues = false;
            }
            /* Hide filter div */
            else {
                workDivHeight += filterDiv.height();
                workDivHeight += 20;
                filterDiv.hide();
                ghxPoolLastPadding = ghxPoolDiv.css('padding-top');
                ghxColumnHeaderGroupLastTop = ghxColumnHeaderGroupDiv.css('top');

                setLastValues = true;
                ghxPoolDiv.css('padding-top', 0);
                ghxColumnHeaderGroupDiv.css('top', '0px');
            }
            workDiv.height(workDivHeight);
            toggleFilter.toggleClass('closed');
            jQuery(document).trigger('resize');
        })

        jQuery('#ghx-column-header-group').prepend(toggleFilter);
    }

    function nodeInsertedEvent(event) {
        var target = jQuery(event.target);
        if (target.attr('id') === 'ghx-column-header-group') {
            createFilterToggle();
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        jQuery(document).on('DOMNodeInserted', nodeInsertedEvent);
    });
})();
