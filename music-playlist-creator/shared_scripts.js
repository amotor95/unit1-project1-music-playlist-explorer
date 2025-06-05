// START FETCHING DATA

const get_json_data = async () => {
    const response = await fetch("data/data.json")
    return response.json()
};

const get_playlists = async () => {
    json_data = await get_json_data()
    return json_data.playlists
};

const get_songs = async () => {
    json_data = await get_json_data()
    return json_data.songs
};

// END FETCHING DATA

// START SONG GEN

// Fisher-Yates randomizing algorithm to shuffle
// Starting at the end, take i+1
// Then multiply by random num in range (0,1)
// Take floor to get integer, then swap them
// JS arrays are pass by reference
// Also for some reason had to add semi-colons b/c using j before initialized?
const shuffle_array = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const shuffle_songs = () => {
    const modal_content = document.getElementById("playlist-modal-content")
    let songs = modal_content.songs
    shuffle_array(songs)
    gen_songs_list(songs)
}

const create_song_card = (song) => {
    const song_div = document.createElement("div")
    song_div.setAttribute("class", "playlist-modal-song")

    const song_img = document.createElement("img")
    song_img.setAttribute("src", song.song_art)
    song_img.setAttribute("class", "playlist-modal-image")
    song_div.appendChild(song_img)

    const song_info = document.createElement("div")
    song_info.setAttribute("class", "playlist-modal-song-info")

    const song_title = document.createElement("p")
    song_title.setAttribute("class", "playlist-modal-song-title")
    song_title.innerText = song.song_name
    const song_artist = document.createElement("p")
    song_artist.setAttribute("class", "playlist-modal-song-artist")
    song_artist.innerText = song.song_artist
    const song_album = document.createElement("p")
    song_album.setAttribute("class", "playlist-modal-song-album")
    song_album.innerText = song.song_album
    song_info.appendChild(song_title)
    song_info.appendChild(song_artist)
    song_info.appendChild(song_album)

    song_div.appendChild(song_info)

    const song_duration = document.createElement("p")
    song_duration.setAttribute("class", "playlist-modal-song-duration")
    song_duration.innerText = song.song_duration
    song_div.appendChild(song_duration)

    return song_div
}

const gen_songs_list = (songs) => {
    const modal_content = document.getElementById("playlist-modal-content")

    document.getElementById("playlist-modal-songs").remove()

    const song_list = document.createElement("div")
    song_list.setAttribute("id", "playlist-modal-songs")

    for(const song of songs) {
        song_div = create_song_card(song)
        song_list.appendChild(song_div)
    }

    modal_content.songs = songs

    modal_content.appendChild(song_list)
}

const get_included_songs = (playlist, songs) => {
    let included_songs = []

    for(const song of songs) {
        if (playlist.song_list.includes(song.songID)) {
            included_songs.push(song)
        }
    }
    return included_songs
}

// END SONG GEN