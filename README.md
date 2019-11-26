# LIRI-Bot

Liri-Bot is a **Node.js** application that allows the user to use four different commands to get more information about media such as movies, songs, concerts and even read a file and run its contents.
    
# Getting Started

* Clone the repo
* Run command in **npm install** in terminal or bash
* Run command node app.js follwed by the command and the query to search

## Command Documentation

As mentioned above, there are four commands all using its respective API and queries. These commands are the following:

    1.  concert-this
    2.  spotify-this-song
    3.  movie-this
    4.  so-what-it-says
    
These commands should be run as an argument (*process.argv[2]*) after node and app.js, which is the name of the application. The next argument (*process.argv[3]*) would be the query. This will correspond to the command that is previously determined. More specifically, the queries are defines as follows:

    1.  <artist name>
    2.  <song name>
    3.  <movie name>
    4.  <run commands from txt file>

### Concert-This

Checks for incoming concerts for the artits worldwide displaying the following information:
          
  * Venue
  * Location
  * Date
  * Ticket Availability
            
### Spotify-this-song
  
Return the first 20 results of the track query with the following information:

  * Title
  * Artist
  * Album
  * Song Url (if existent)
            
### Movie-this

  Will look for the metadata of the search query and return important data such as:

    * Title
    * Date Released
    * Country
    * Director
    * Actors
    * Production
    * Genre
    * Runtime
    * IMDB Rating
    * Rotten Tomatoes Rating
          
### Do-what-it-says   

  Runs the "random.txt" file. It is mostly used as a test file to understand how the process.argv instructions are read         by the different functions.
        
## Other information

 There is a "log.txt" file that logs every query after it is done with a timestamp and metadata.
     
## Technology Utilized

* Javascript
* Node.js

### APIs

* Axios - queries
* Fs - writting and reading documents
* Node-Spotify-Api - Music queries
* Bandsintown - Conert queries
* Moment.js - Log timestamps and concert schedules


# Authors

Joaquin Valle Pinto

https://github.com/JoaquinValle/

        
        
          
          
