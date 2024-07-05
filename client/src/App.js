import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect} from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      let parts = item.split('=')
      initial[parts[0]] = decodeURIComponent(parts[1])
      return initial
  }, {});
}



function App() {
  const [spotifyToken, setSpotifyToken] = useState("");
  const [nowPlaying, setNowPlaying] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [myTopArtists, setMyTopArtists] = useState([]);

  useEffect(() => {
    console.log("derived from the url: ", getTokenFromUrl());
    const spotifyToken = getTokenFromUrl().access_token;
    window.location.hash = '';
    console.log("spotify token is ", spotifyToken);

    if (spotifyToken){
      setSpotifyToken(spotifyToken);
      spotifyApi.setAccessToken(spotifyToken);
      spotifyApi.getMe().then((user) =>{
        console.log(user);
      });
      setLoggedIn(true);


      const topArtists = [];
      spotifyApi.getMyTopArtists().then((artists) => {
        console.log(artists);
        artists.items.forEach((artistObject) => {
          topArtists.push(<li key={artistObject.id}>{artistObject.name}</li>);
        });
        setMyTopArtists(topArtists);
      });
    }
  });

  const getNowPlaying = () => {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      console.log(response);
      if(response){
        setNowPlaying({
        name: response.item.name,
        albumArt: response.item.album.images[0].url
        });
      }
    });
  }
  
  return (
    <div className="App">
      {!loggedIn && <a href="http://localhost:8888">Login to Spotify</a>}
      {loggedIn && (
        <>
          <div>Now Playing: {nowPlaying.name}</div>
          <div>
            <img src={nowPlaying.albumArt} style={{height: 150}}/>
          </div>
        </>
      )}
      {loggedIn && (
        <button onClick={() => getNowPlaying()}>Check now playing</button>
      )}
      {loggedIn && (<ul>{myTopArtists}</ul>)}
    </div>
  );
}

export default App;
