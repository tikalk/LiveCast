LiveCast
========

Tikal's Fuseday JS Session Concept - a live screencast system for remote

Tikal Fuseday Preperation
=========================

Obtained original code from Github.

Applied the following changes to match Tikal Fuseday requierments:
- Added bootstrap (CSS & JS) - done
- Replaced prototype lib with recent jQuery implementation - done
- Added UI + script for color change - work in progress

Further development ideas:
- Add UI + script for pen properties changes
- Enable uploading an image as the canvas backround image so teacher may highlight things on image

Shared Canvas
=============

Shared Canvas is a test project to show what is drawn on one device on many others, who can also draw.

Drawing is currently only supported on devices that support touch events (such as iOS devices or recent Android phones/tablets), and the requires <canvas> support to both draw and view.
  
Clearing the canvas currently requires restarting the server, and resizing the <canvas> element requires reloading the page (which then replays any drawing since the server started, so doesn't cause data loss).
  
Things to do:

1) Support multiple drawings
2) The canvas tag on one device may be bigger than others, so any drawing done outside of the visible area of those smaller devices won't be visible to them.
3) Support changing colour
4) Add an eraser of some kind
5) Add a reset
6) Show how many people are connected
7) Include headers so it can be added to the home screen on iOS devices as a chrome-less web app.

License
-------

Copyright (c) 2011 Patrick Quinn-Graham

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
