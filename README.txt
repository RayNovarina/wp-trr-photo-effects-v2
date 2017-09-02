cd /Applications/MAMP/htdocs/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects-v2
//---------------------------------------------------
based on:
    AtomProjects/harp/gsap-sandbox-halftone/
    per: https://greensock.com/jump-start-js
         https://greensock.com/get-started-js#intro
    javascript module pattern per: http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

local dev path for this file:
  /Applications/MAMP/htdocs/Sites/wordpress-5-trr-staging/wp-content/plugins/trr-photo-effects-v2/README.txt

browser access: start OSX Mamp. Apache server at localhost:8888
  browser only access: http://localhost:8888/Sites/wordpress-5-exploding-profiles/management-team/

github repository:
  https://github.com/RayNovarina/wp-trr-photo-effects-v2.git
staging site:
  http://trafficrevenueresults.com/management-team/

login: http://localhost:8888/Sites/wordpress-5-exploding-profiles/management-team/wp-login.php

===================
$ cd /Applications/MAMP/htdocs/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects
$ npm and gulp notes:
npm config set prefix /usr/local
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
npm install gulp -g
npm install --save-dev gulp
sudo npm install --save-dev gulp-uglify
sudo npm install gulp-minify --save-dev
sudo npm install gulp-minify-html --save-dev
sudo npm install browser-sync --save-dev

create gulpfile.js:
  // including plugins
  var gulp = require('gulp')
      , minifyHtml = require("gulp-minify-html");
  // task
  gulp.task('minify-html', function () {
      gulp.src('./Html/*.html') // path to your files
      .pipe(minifyHtml())
      .pipe(gulp.dest('path/to/destination'));
  });

Verify:
$ gulp
  [21:05:43] Using gulpfile /Applications/MAMP/htdocs/Sites/wordpress-5-exploding-profiles/wp-content/plugins/trr-photo-effects/gulpfile.js
  [21:05:43] Task 'default' is not in your gulpfile

Run from command line using the gulp.task name:
$ gulp minify-html

=========================

original canvas-dots-cat:
per: https://codepen.io/Mamboleoo/pen/wKqwPN
     https://codepen.io/Mamboleoo/post/how-to-convert-an-image-into-particles

Tutorial:

In this tutorial I will just explain how to generate an array filled with
coordinates from the pixels of our image. Those pens above are using ThreeJs
to create a depth effect but I won't get into 3D over here. I will just use
the Canvas API ;)

You need a basic canvas tag in your HTML
<canvas id="scene"></canvas>

We will use some CSS to make our result nicer
body, html{
  width:100%;
  height:100%;
  overflow: hidden;
  background: black;
}
canvas{
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
}

And finally you need your image
CodePen logo: 100x100 .png 72 DPI Color mode RGB

Get the infos of your image
Now that we have our basic scene we need to convert our image into an array of data.

Create a new image element and execute the 'drawScene' function when it is loaded.
var png = new Image();
png.onload = drawScene;
png.src = "codepen.png";
Now that our image is loaded, we can init our canvas scene.
var canvas    = document.getElementById("scene");
var ctx       = canvas.getContext("2d");

canvas.width = png.width;
canvas.height = png.height;
The next step is to draw the image, get the data from the scene and finally
clearing it. To get the data we will use the getImageData method from the
Canvas API.
This method returns an object with an array in it that contains 4 values for
each pixel: one for each color (RGB) and a last one for the Alpha.
You can find more infos about the getImageData method here

ctx.drawImage(png, 0, 0);
var data = ctx.getImageData(0, 0, png.width, png.height);
ctx.clearRect(0,0,canvas.width, canvas.height);

We now have an array with the data of every pixel from the image. But we only
want specific pixels. In this case I will select only the pixel with no
transparency (but you can target all the blue pixels, the darker
pixels [...] It's up to you !).

To select the pixels we need, we will loop through the Y and the X axis of
our image. That's why we have a loop into another one.
I check if it's four value (Alpha) is over than 128, the average value.
(Each value is between 0 and 255).
If the Alpha is over 128, I push the pixel into my particles array.

var particles = [];
for (var y = 0, y2 = data.height; y < y2; y++) {
    for (var x = 0, x2 = data.width; x < x2; x++) {
        if (data.data[(x * 4 + y * 4 * data.width) + 3] > 128) {
            var particle = {
                x : x,
                y : y
            };
            particles.push(particle);
        }
    }
}
#Check if the array is correct
We can do a quick check by drawing every particle on our scene.

Set the fillStyle to white.
Loop through all the particles.
Draw each particle with its coordinates.
And voila !
ctx.fillStyle = "white";
for(var i=0, j=particles.length;i<j;i++){
    var particle = particles[i];
    ctx.fillRect(particle.x, particle.y, 1, 1);
}

=================================
NOTES:
=================================
* Add to each photo attribs:
  - ImageOffsetX and Y.
  Not all base photos are "centered".
  Use to "center" home position, i.e. expanded image.
* Add to Each particles file:
  - ImageOffsetX and Y.
  Use to "center" the collapsed cores of the collapsing and expanding images.
  Apply to animation boundaries when
  calculating RandomizeCollapsedCore
  values.


=================================
boneyard snippets:
=================================
