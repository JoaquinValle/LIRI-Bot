require("dotenv").config()

var keys = require("./keys.js")
var fs = require("fs")



var inquirer = require("inquirer")
var Spotify = require("node-spotify-api")
var axios = require("axios")
var bandsintown = require("bandsintown")
var moment = require("moment")

var spotify = new Spotify(keys.spotify)
var doWhatBool = false

var command = process.argv[2]
var query = process.argv[3]
var proArg = process.argv
var queryArr = []

for (let i = 3; proArg.length > i; i++) {
    queryArr.push(proArg[i]) 
}


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
    query = queryArr.join("")
    var url = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp"
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
}

function spotifyThis() {
    if (!doWhatBool) {
        query = queryArr.join(" ")
    }
    spotify.search({ type: "track", query: query }, (err, data) => {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songList = data.tracks.items
        for (let i in songList) {
            console.log(`Title: ${songList[i].name} | Artist: ${songList[i].artists[0].name} | Album: ${songList[i].album.name} | \n URL: ${songList[i].preview_url}`)
            console.log("----------------------------------------------")
        }
        })
}

function movieThis() {
    query = queryArr.join("-")
    var url =  "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy"
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
}

function doWhat() {
    doWhatBool = true
    fs.readFile("random.txt", "utf8", function(error, data){
        var text = data.split(',')
        console.log(text)
        //command = text[0]
        query = text[1]
        spotifyThis(text[1]);
      });
}
