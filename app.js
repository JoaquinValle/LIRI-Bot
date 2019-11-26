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
        console.log("\x1b[31m","No command was entered or an invalid command was entered. Please enter one of the following commands: ")
        console.log("\x1b[0m","       concert-this <artist name>")
        console.log("        spotify-this-song <song name>")
        console.log("        movie-this <movie name>")
        console.log("        do-what-it-says <run commands from txt file>")
} 

function concertThis() {
    query = queryArr.join("")
    var url = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp"
    axios.get(url).then((res) => {
        if (res.data.length === 0) {
            console.log("\x1b[33m",`    ${query} does not have concerts anytime soon.`)
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
                    console.log("     Venue: " + res.data[i].venue.name +
                            "\n     Location: " + res.data[i].venue.city + ", " + res.data[i].venue.country +
                            "\n     Date: " + day)
                    if (available === "yes") {
                        console.log("\x1b[32m", "    Tickets Available: " + available +
                        "\n")
                    }
                    else {
                        console.log("\x1b[31m", "    Tickets Available: " + available +
                        "\n")
                    }
                    console.log("\x1b[32m", "   --------------------------------------------")
                    console.log("\x1b[0m")
                }
                else {
                    console.log("     Venue: " + res.data[i].venue.name +
                                "\n     Location: " + res.data[i].venue.city + ", " + res.data[i].venue.region + ", " + res.data[i].venue.country +
                                "\n     Date: " + day)
                    if (available === "yes") {
                        console.log("\x1b[32m", "    Tickets Available: " + available +
                        "\n")
                    }
                    else {
                        console.log("\x1b[31m", "    Tickets Available: " + available +
                        "\n")
                    }
                    console.log("\x1b[32m", "   --------------------------------------------")
                    console.log("\x1b[0m")
                }
            }
        }
    fs.appendFile("log.txt", "\nConcert This: " + query + " Created At: " + moment().format("LLLL") + "\n", (err) => {
        if (err) throw (err)
    })
    fs.appendFile("log.txt", "----------------------------------------------------------------", (err) => {
        if (err) throw (err)
    })
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
    if (queryArr.length === 0) {
        query = "The Sign"
    }
    spotify.search({ type: "track", query: query }, (err, data) => {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songList = data.tracks.items
        for (let i in songList) {
            if (!songList[i].preview_url) {
                console.log("\x1b[0m", `   Title: ${songList[i].name} \x1b[32m|\x1b[0m Artist: ${songList[i].artists[0].name} \x1b[32m|\x1b[0m Album: ${songList[i].album.name} \x1b[32m|\x1b[31m URL: No song URL`)
            }
            else {
                console.log("\x1b[0m", `   Title: ${songList[i].name} \x1b[32m|\x1b[0m Artist: ${songList[i].artists[0].name} \x1b[32m|\x1b[0m Album: ${songList[i].album.name}`)
                console.log(`\x1b[35m    URL: ${songList[i].preview_url}`)
            }
            console.log("\x1b[32m", " ----------------------------------------------")
        }
        fs.appendFile("log.txt", "\nSpotify This: " + query + " Created At: " + moment().format("LLLL") + "\n", (err) => {
            if (err) throw (err)
        })
        fs.appendFile("log.txt", "----------------------------------------------------------------", (err) => {
            if (err) throw (err)
        })
    })
    doWhatBool = false

}

function movieThis() {
    query = queryArr.join("-")
    var url =  "http://www.omdbapi.com/?t=" + query + "&y=&plot=short&apikey=trilogy"
    axios.get(url).then((res) => {
        console.log(" Title: " + res.data.Title + 
                    "\n Released: " + res.data.Released +
                    "\n Country: " + res.data.Country +
                    "\n Director: " + res.data.Director +
                    "\n Actors: " + res.data.Actors +
                    "\n Production: " + res.data.Production +
                    "\n Genre: " + res.data.Genre +
                    "\n Runtime: " + res.data.Runtime)

        if (res.data.Rated === "R") {
            console.log(` Rating: \x1b[31m${res.data.Rated}\x1b[0m`)
        }
        else if (res.data.Genre === "PG-13") {
            console.log(` Rating: \x1b[33m${res.data.Rated}\x1b[0m`)
        }
        else {
            console.log(` Rating: \x1b[34m${res.data.Rated}\x1b[0m`)
        }

        console.log("\x1b[0m","Plot: " + res.data.Plot)

        if (parseFloat(res.data.imdbRating) > 8.0) {
            console.log(` IMDB Rating: \x1b[32m${res.data.imdbRating}\x1b[0m`)
        }
        else if (parseFloat(res.data.imdbRating) < 8.0 && parseFloat(res.data.imdbRating) > 6.0) {
            console.log(` IMDB Rating: \x1b[33m${res.data.imdbRating}\x1b[0m`)
        }
        else {
            console.log(` IMDB Rating: \x1b[31m${res.data.imdbRating}\x1b[0m`)
        }

        var tomatoArr = []
        for (let i = 0; res.data.Ratings[1].Value.length-1 > i; i++) {
            tomatoArr.push(res.data.Ratings[1].Value[i])
        }
        var tomatoRate = parseInt(tomatoArr.join(""))

        if (tomatoRate > 85) {
            console.log(` Rotten Tomatoes Rating: \x1b[32m${res.data.imdbRating}\x1b[0m`)
        }
        else if (tomatoRate > 50 && tomatoRate < 85) {
            console.log(` Rotten Tomatoes Rating: \x1b[33m${res.data.imdbRating}\x1b[0m`)
        }
        else {
            console.log(` Rotten Tomatoes Rating: \x1b[31m${res.data.imdbRating}\x1b[0m`)
        }
        fs.appendFile("log.txt", "\nMovie This: " + query + " Created At: " + moment().format("LLLL") + "\n", (err) => {
            if (err) throw (err)
        })
        fs.appendFile("log.txt", "----------------------------------------------------------------", (err) => {
            if (err) throw (err)
        })
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
      fs.appendFile("log.txt", "Do What This Is: See Query below Created At: " + moment().format("LLLL") + "\n", (err) => {
        if (err) throw (err)
    })
      fs.appendFile("log.txt", "----------------------------------------------------------------", (err) => {
        if (err) throw (err)
    })
      fs.appendFile("log.txt","\n", (err) => {
        if (err) throw (err)
    })
}
