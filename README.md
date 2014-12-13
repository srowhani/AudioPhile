AudioPhile
==========

A quick application I made that makes use of the HTML5 audio element, and API
to load sound files and play them back, as well as visualizing them.

<h2>Third Party Libraries</h2>
<ul><li><h4>RequireJS</h4><small>For loading each of the modules</small></li></ul>

Using Canvas, I draw the frequency data which is represented as an UintArray by iterating through it
and drawing each of the array values as rectangles.

As for the beat matching, if:<br/>
<code>[].slice.call(_player.getFrequency()).slice(0,4).reduce(function(x,y){return x+y})</code>
<br/>
surpasses 720 (the limit for each frequency is 200) I set the fillstyle of my canvas context to be
a blue gradient as opposed to the default red one.


<h2>Usage</h2>
<small>It's pretty simple, you drop music into the dashed div box, and it should load them.
Once it has, clicking the div will grab the src from the element's dataset, and begin playback</small>

<h2>Demo</h2>
<small>Can be found <a href='http://srowhani.github.io/AudioPhile' target='_blank'>here</a>.</small>

<h2>Learning sources</h2>
<ul>
  <li>http://ianreah.com/2013/02/28/Real-time-analysis-of-streaming-audio-data-with-Web-Audio-API.html</li>
  <li>https://webaudio.github.io/web-audio-api/</li>
</ul>
