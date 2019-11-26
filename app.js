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
            var songList = data.tracks.items
            for (let i in songList) {
                console.log(`Title: ${songList[i].name} | Artist: ${songList[i].artists[0].name} | Album: ${songList[i].album.name} | \n URL: ${songList[i].preview_url}`)
                console.log("----------------------------------------------")
            }
          });
    })
}

function movieThis() {
    inquirer.prompt([
        {
            name: "movie",
            message: "Please write a movie title to search."
        }
    ]).then((answer) => {
        var url =  "http://www.omdbapi.com/?t=" + answer.movie + "&y=&plot=short&apikey=trilogy"
        axios.get(url).then((res) => {
            console.log("Title: " + res.data.Title + 
                        "\nReleased: " + res.data.Released +
                        "\nCountry: " + res.data.Country +
                        "\nDirector: " + res.data.Director +
                        "\nActors: " + res.data.Actors +
                        "\nProduction: " + res.data.Production +
                        "\nGenre: " + res.data.Genre +
                        "\nRuntime: " + res.data.Runtime +
                        "\nRated: " + res.data.Rated +
                        "\nPlot: " + res.data.Plot +
                        "\nIMDB Rating: " + res.data.imdbRating +
                        "\nRotten Tomatoes Rating: " + res.data.Ratings[1].Value) 
        }).catch((error) => {
            if (error.res) {
                console.log("There is an error")
            }
        })
    })
}

function doWhat() {
}
