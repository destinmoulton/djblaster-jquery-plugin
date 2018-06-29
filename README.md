A jQuery plugin to feed DJ Signins/shows into another page via the DJBlaster feeds.

### Page Integration

Clone the Repository:

```
$ git clone https://github.com/destinmoulton/djblaster-jquery-plugin.git
```

Add a container for the DJBlaster feeds:

```
<div id="djblaster-feed-container">Animated loading gif here...</div>
```

Include djblaster.jquery.js:

```
<script src="djblaster.jquery.js"></script>
```

Add and modify the feed template:

```
<!-- Modifiable template -->
<script type="html/tpl" id="djblaster-feed-template">
<div>
	<div>{{show_title}}</div>
    <div>{{dj_name}}</div>
    <div>{{show_start_time}} to {{show_end_time}}</div>
    <br/>
</div>
</script>
```

Initialize and run the DJBlaster plugin:

```
<script type="text/javascript">
$(function(){
    // djlbaster.jquery options
    var options = {
        debug: false,
        feed_url: "<ADDRESS_OF_DJBLASTER_INSTALLATION>/feeds/dj-signins-json",
        count: 10,
        ignore: ["Test", "Test show"], // The show names to ignore (comma separated, in quotes)
        template: "#djblaster-feed-template"
    }
    $("#djblaster-feed-container").djblaster(options);
});
</script>
```

### Requirements

The javascript libraries are required:

-   jQuery
-   lodash
-   moment.js
