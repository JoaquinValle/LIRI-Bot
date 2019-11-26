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
        var url = "https://rest.bandsintown.com/artists/" + answer.artist + "/events?app_id=codingbootcamp"
        axios.get(url).then((res) => {
            if (res.data.length === 0) {
                console.log(`${answer.artist} does not have concerts anytime soon.`)
            }
            else {
                for (let i = 1; res.data.length > i; i++) {
                    if (res.data[i].offers[0].status === "available") {
                        var available = "yes"
                        var day = moment(res.data[i].datetime).format("LLLL")
                    }
                    else {
                        var available = "no"
                    }
                    if (res.data[i].venue.region === "") {
                        console.log("Venue: " + res.data[i].venue.name +
                                "\nLocation: " + res.data[i].venue.city + ", " + res.data[i].venue.country +
                                "\nDate: " + day +
                                "\nTickets Available: " + available
                                )
                        console.log("-----------------------------------------")
                    }
                    else {
                    console.log("Venue: " + res.data[i].venue.name +
                                "\nLocation: " + res.data[i].venue.city + ", " + res.data[i].venue.region + ", " + res.data[i].venue.country +
                                "\nDate: " + day +
                                "\nTickets Available: " + available
                                )
                    console.log("-----------------------------------------")

                    }
                }
            }
        }).catch((error) => {
            if (error.res) {
                console.log("---------------Data---------------")
                console.log(error.res.data)
                console.log("---------------Status---------------")
                console.log(error.res.status)
                console.log("---------------Status---------------")
                console.log(error.res.headers)
            }
            else if (error.request) {
                console.log(error.request)
            } else {
                console.log("Error", error.message)
            }
            if (error.config) {
            console.log(error.config)
            }
        }) 
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
                        "\n Released: " + res.data.Released +
                        "\n Country: " + res.data.Country +
                        "\n Director: " + res.data.Director +
                        "\n Actors: " + res.data.Actors +
                        "\n Production: " + res.data.Production +
                        "\n Genre: " + res.data.Genre +
                        "\n Runtime: " + res.data.Runtime +
                        "\n Rated: " + res.data.Rated +
                        "\n Plot: " + res.data.Plot +
                        "\n IMDB Rating: " + res.data.imdbRating +
                        "\n Rotten Tomatoes Rating: " + res.data.Ratings[1].Value) 
        }).catch((error) => {
            if (error.res) {
                console.log("---------------Data---------------");
                console.log(error.res.data);
                console.log("---------------Status---------------");
                console.log(error.res.status);
                console.log("---------------Status---------------");
                console.log(error.res.headers);  
            }
            else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        })
    })
}

function doWhat() {
}
