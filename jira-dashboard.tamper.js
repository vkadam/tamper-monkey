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
        };

        this.addRule = function(selector, rule) {
            if (stylesheet.addRule) {
                stylesheet.addRule(selector, rule);
            } else if (stylesheet.insertRule) {
                stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
            }
        };
        return this;
    })();

    jiraStylesheet.init();
    jiraStylesheet.addRule('#js-filter-toggle', 'z-index: 1; right: -3px; top: 3px; background-position:5px -547px !important');
    jiraStylesheet.addRule('#announcement-banner', 'display:none !important');
    jiraStylesheet.addRule('#js-filter-toggle .ghx-icon', 'background-position:5px -547px');
    jiraStylesheet.addRule('.closed .ghx-icon', 'background-position:-20px -547px !important');
    jiraStylesheet.addRule('.ghx-column-headers .ghx-column', 'padding-bottom: 3px !important; padding-top: 3px !important');
    jiraStylesheet.addRule('.ghx-swimlane-header .ghx-heading', 'font-weight: bolder');

    function resizeWorkdiv() {
        var $window = jQuery(window),
            $header = jQuery('#header .aui-header'),
            $announcement = jQuery('#announcement-banner'),
            $dashboardTitle = jQuery('#ghx-header'),
            $filters = jQuery('#ghx-operations'),
            $workDiv = jQuery('#ghx-work'),
            headersHeight = 15;

        jQuery.each([$header, $announcement, $dashboardTitle, $filters], function(idx, ele) {
            // console.log(ele.attr('id'), ele.height(), ele.is(':visible'));
            if (ele.is(':visible')) {
                headersHeight += ele.outerHeight();
            }
        });
        // console.log('window height', $window.height(), 'headersHeight', headersHeight, 'work div height', $workDiv.height(), 'new height',$window.height() - headersHeight);
        $workDiv.height($window.height() - headersHeight);
        // console.log('jira dashboard workspace resized');
    }

    function createFilterToggle() {
        var toggleFilter,
            filterDiv = jQuery('#ghx-operations'),
            ghxPoolDiv = jQuery('#ghx-pool'),
            ghxColumnHeaderGroupDiv = jQuery('#ghx-column-header-group'),
            compactToggle = jQuery('#js-compact-toggle'),
            header = jQuery('#header');
        toggleFilter = compactToggle.clone();
        toggleFilter.attr('id', 'js-filter-toggle');

        var setLastValues = false,
            ghxPoolLastPadding,
            ghxColumnHeaderGroupLastTop,
            lastVisibility = GM_getValue('jiraHeaderVisible');

        toggleFilter.on('click', function() {
            if (header.is(':visible')) {
                compactToggle.click();
            }
            /* Show filter div */
            if (setLastValues) {
                filterDiv.show();
                ghxPoolDiv.css('padding-top', ghxPoolLastPadding);
                ghxColumnHeaderGroupDiv.css('top', ghxColumnHeaderGroupLastTop);
                setLastValues = false;
                GM_setValue('jiraHeaderVisible', true);
            }
            /* Hide filter div */
            else {
                filterDiv.hide();
                ghxPoolLastPadding = ghxPoolDiv.css('padding-top');
                ghxColumnHeaderGroupLastTop = ghxColumnHeaderGroupDiv.css('top');

                setLastValues = true;
                ghxPoolDiv.css('padding-top', 0);
                ghxColumnHeaderGroupDiv.css('top', '0px');
                GM_setValue('jiraHeaderVisible', false);
            }
            toggleFilter.toggleClass('closed');
            resizeWorkdiv();
        });

        jQuery('#ghx-column-header-group').prepend(toggleFilter);
        setTimeout(function(){
            if (!lastVisibility) {
                toggleFilter.click();
            };
        }, 100);
    }

    function windowResizeEvent() {
        var $window = jQuery(window);
        $window.off('resize').on('resize', resizeWorkdiv);
    }
    
    function swimlaneExpanderEvent() {
        jQuery('#ghx-pool').on('click', 'div.ghx-expander.js-expander', function(){
        	setTimeout(resizeWorkdiv, 100);
        });
    }

    function nodeInsertedEvent(event) {
        var target = jQuery(event.target);
        if (target.attr('id') === 'ghx-column-header-group') {
            createFilterToggle();
            windowResizeEvent();
            swimlaneExpanderEvent();
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        jQuery(document).on('DOMNodeInserted', nodeInsertedEvent);
    });
})();
