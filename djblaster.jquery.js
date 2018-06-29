/**
 * djblaster.jquery.js
 *
 * DJBlaster jQuery Feed
 *
 * @version 0.1.0
 * @author Destin Moulton
 * @license MIT
 *
 *
 * Options:
 *    debug: boolean enable/disable debug messages
 *    feed_url: string URL of feed source
 *    count: Number of shows to get
 *    ignore: Array of show names to ignore (comma separated, in quotes)
 *    template: Selector (id) of the mustache template
 */
(function($) {
    "use strict";
    var DEBUG = false;
    $.fn.djblaster = function(options) {
        var $container = $(this);
        var TEMPLATE = null;
        var config = { ignore: [], count: 10 };
        DEBUG = options.debug || false;

        if (!options || !options.feed_url || !options.template) {
            error(
                "djblaster.jquery :: ERROR :: feed_url and template required in options"
            );
            return;
        }
        config.feed_url = options.feed_url;
        config.ignore = options.ignore || config.ignore;
        config.count = options.count || config.count;
        config.time_format = options.time_format || "h:mm a";
        config.template = options.template || "#djblaster-feed-template";

        // Setup lodash mustache style template delimiters
        _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
        TEMPLATE = _.template($(config.template).html());

        // Start the feed
        fetchFeed();

        function fetchFeed() {
            var opts = {
                ignore: config.ignore,
                count: config.count
            };
            var init = {
                body: JSON.stringify(opts),
                method: "POST",
                mode: "cors"
            };
            fetch(config.feed_url, init)
                .then(function(res) {
                    return res.json();
                })
                .then(function(shows) {
                    buildShowsList(JSON.parse(shows));
                })
                .catch(function(err) {
                    error(err);
                });
        }

        function buildShowsList(shows) {
            debug("Shows Feed List Acquired", shows);

            $container.html("");

            var lastShowStartTime = "";
            var lastShowEndTime = "";
            shows.forEach(function(show) {
                var showStartTime = moment(show.show_start_time).format(
                    config.time_format
                );
                var showEndTime = moment(show.show_end_time).format(
                    config.time_format
                );

                if (
                    lastShowEndTime !== showEndTime &&
                    lastShowStartTime !== showStartTime
                ) {
                    var compiled = TEMPLATE({
                        show_title: _.startCase(_.toLower(show.show_title)),
                        dj_name: _.startCase(
                            _.toLower(
                                show.dj_first_name + " " + show.dj_last_name
                            )
                        ),
                        show_start_time: showStartTime,
                        show_end_time: showEndTime
                    });

                    $container.append(compiled);
                } else {
                    debug(
                        "Duplicate Show Being Supressed From Feeds List ",
                        show
                    );
                }

                lastShowEndTime = showEndTime;
                lastShowStartTime = showStartTime;
            });
        }
    };

    function error() {
        console.error(...arguments);
    }

    function debug() {
        if (DEBUG) {
            console.log(...arguments);
        }
    }
})(jQuery);
