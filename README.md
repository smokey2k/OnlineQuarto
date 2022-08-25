
![Quarto Online](/assets/public/media/QUARTO-LOGO.svg)

# Quarto Online

An online, multi-user board game combined with an instant chat application.<br/>

Technologies used:<br/>

* Node.js: server-side JavaScript runtime environment.<br/>
* Socket.IO: two-way and low latency platform for independent communication web socket.<br/>
* Three.js: browser-to-browser JavaScript library and application programming interface (API) for creating and displaying animated 3D computer graphics in a web browser using WebGL.<br/>

The application documentation can be found in the ./assets/docs directory.

Installation:
The application needs a runnig MySQL server, a Node.js runtime environment and npm package manager.

Install Node.js (LTS version prefered) and npm package manager:

# Windows 
Get the installer, it will install npm aswell: [Node.js](https://nodejs.org/en/)

# Arch Linux (For 16.X version) 
```
sudo pacman -Syu nodejs-lts-gallium npm
```
# Debian:
```
sudo apt update
sudo apt install nodejs npm -y
```

Ask the system admin to create an empty database in MySQL database server or do on your own named as 'quartoonlinedb';
```
mysql -u root
CREATE DATABASE IF NOT EXISTS quartoonlinedb;
```

In the project local repository path, initialize the project and install the required modules with npm:
```
npm init (initialise the application)
npm install (installing node.js modules)
```

Start the project:
```
npm start (for production environment)
npm run dev (for developement)
```