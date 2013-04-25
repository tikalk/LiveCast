LiveCast
========

Tikal's Fuseday JS Session Concept - a live screencast system for remote

Major changes
=============
Old project sources were moved to master-old branch.
##New Features##
* User **Grunt** to build project
* The application is based on [grunt-init-express](https://github.com/kamiyam/grunt-init-express) template
* Use socket session to store user session data (server side)
* Use Ejs to render pages on the server side
* All static server contetn moved to ./app/private (After the build they will be available @ ./app/public)

##Getting Started##
Pre-requisites:
1. Install [Nodejs](http://nodejs.org/)
2. Install [Grunt](http://gruntjs.com/installing-grunt)
3. Install [supervisor](https://github.com/isaacs/node-supervisor)

Set up development env.:
1. Clone the repo
2. cd into LiveCast
3. Run: npm install (Installs development environment)
4. cd into app/ (i.e. .../LiveCast/app)
5. Run: npm install (installs the app itesf)
6. Run: grunt

Grunt will do the build and start a proxy server at [http://localhost:8000](http://localhost:8000).

To run the application without grunt:
1. cd into .../LiveCast/app
2. Run: node app.js

Server should listen to port 3000


##Static content##
All the static (js, css & img) content is located under /public.


/views/index.ejs renders to "index.html" so this is the main view for the app.

>The templating engine is [ejs](http://embeddedjs.com/) (very similar to jsp scriptlets). 
