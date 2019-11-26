require("dotenv").config()

var keys = require("./keys.js")
var fs = require("fs")



var inquirer = require("inquirer")
var Spotify = require("node-spotify-api")
var axios = require("axios")
var bandsintown = require("bandsintown")
var moment = require("moment")

var spotify = new Spotify(keys.spotify)

var command = process.argv[2]
var proArgv = process.argv

// if (proArgv.length = 4) {
//     command = `${command}-${proArgv[3]}`
// }
// else if (proArgv.length = 5) {
//     command = `${command}-${proArgv[3]}-${proArgv[4]}`
// }
// else if (proArgv.length = 6) {
//     command = `${command}-${proArgv[3]}-${proArgv[4]}-${proArgv[5]}`
// }

// console.log(command)
// console.log(proArgv.length)
switch(command) {
    case "concert-this":
        concertThis()
        break

    case "spotify-this-song":
        spotifyThis()
        break

    case "movie-this":
        movieThis()
        break
    
    case "do-what-it-says":
        doWhat()
        break

    default:
        console.log("Please enter a command")
} 

function concertThis() {
    inquirer.prompt([
        {
            name: "artist",
            message: "Please write artist or band name."
        }
    ]).then((answer) => {
        console.log(answer.artist)
    })
}

function spotifyThis() {
    inquirer.prompt([
        {
            name: "song",
            message: "Please write a title to search."
        }
    ]).then((answer) => {
        spotify.search({ type: 'track', query: answer.song }, (err, data) => {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
          console.log(`Song: ${data.tracks.items}|`) 
          });
    })
}

function movieThis() {
}

function doWhat() {
}
