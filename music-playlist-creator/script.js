var songs

const modal = document.getElementById("playlist-modal")

const open_modal = (playlist) => {
    console.log("opening modal w/:")
    console.log(playlist)
    document.getElementById("playlist-modal-image").src = playlist.playlist_art;
    document.getElementById("playlist-modal-title").innerText = playlist.playlist_name;
    document.getElementById("playlist-modal-creator").innerText = playlist.playlist_author;

    document.getElementById("playlist-modal-songs").remove()

    const song_list = document.createElement("div")
    song_list.setAttribute("id", "playlist-modal-songs")

    const modal_content = document.getElementById("playlist-modal-content")

    for(const song of songs) {
        if (song.songID in playlist.song_list) {
            const song = document.createElement("div")
            song.setAttribute("class", "playlist-modal-song")

            const song_img = document.createElement("src")
            song_img.setAttribute("src", song.song_art)
            song_img.setAttribute("class", "playlist-modal-image")
            song.appendChild(song_img)

            const song_info = document.createElement("div")
            song_info.setAttribute("class", "playlist-modal-song-info")

            const song_title = document.createElement("p")
            song_title.setAttribute("class", "playlist-modal-song-title")
            song_title.innerText = song.song_title
            const song_artist = document.createElement("p")
            song_artist.setAttribute("class", "playlist-modal-song-artist")
            song_artist.innerText = song.song_artist
            const song_album = document.createElement("p")
            song_album.setAttribute("class", "playlist-modal-song-album")
            song_album.innerText = song.song_album
            song_info.appendChild(song_title)
            song_info.appendChild(song_artist)
            song_info.appendChild(song_album)

            song.appendChild(song_info)

            const song_duration = document.createElement("p")
            song_duration.setAttribute("class", "playlist-modal-song-duration")
            song_duration.innerText = song.song_duration
            song.appendChild(song_duration)
            
            song_list.appendChild(song)
        }
    }

    modal_content.appendChild(song_list)

    modal.style.display = "block";
};

const close_span = document.getElementById("playlist-modal-close");
close_span.onclick = () => {
    modal.style.display = "none";
};

// Makes sure the top level element you're clicking is modal (the background)
// modal.onclick would also close out if you clock on modal content
window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};

window.onclick = (e) => {
    let playlist_card = null
    if (e.target.className === "playlist-image"
        || e.target.className === "playlist-title"
    ) {
        playlist_card = e.target.parentElement
    } else if (e.target.className === "playlist-num-likes") {
        playlist_card = e.target.parentElement.parentElement
    }
    open_modal(playlist_card.playlist)
};

// const get_json_data = () => {
//     fetch("data/data.json")
//     .then((response) => {
//         return response.json()
//     })
//     .then((data) => {
//         console.log(data)
//         return data
//     })
//     .catch((error) => {
//         console.log(error);
//     })
// };

const get_json_data = async () => {
    const response = await fetch("data/data.json")
    return response.json()
};

const populate_playlists = (playlists) => {
    const playlists_box = document.getElementById("playlist-cards-box")
    for (const playlist of playlists) {
        let new_card = document.createElement("div")
        new_card.setAttribute("class", "playlist-card")
        new_card.playlist = playlist
        // console.log(new_card.playlist)

        let card_img = document.createElement("img")
        card_img.setAttribute("class", "playlist-image")
        card_img.setAttribute("src", playlist.playlist_art)
        card_img.setAttribute("alt", "playlist image")
        new_card.appendChild(card_img)

        // let card_info = document.createElement("div")
        // card_info.setAttribute("class", "playlist-card-info")
        let card_title = document.createElement("p")
        card_title.setAttribute("class", "playlist-title")
        card_title.innerText = playlist.playlist_name
        // card_info.appendChild(card_title)
        new_card.append(card_title)
        let card_creator = document.createElement("p")
        card_creator.setAttribute("class", "playlist-creator")
        card_creator.innerText = playlist.playlist_author
        // card_info.appendChild(card_creator)
        new_card.appendChild(card_creator)

        let card_likes = document.createElement("div")
        card_likes.setAttribute("class", "playlist-likes-div")
        let likes_button = document.createElement("btn")
        likes_button.setAttribute("class", "playlist-like-button")
        likes_button.innerText = "♡"
        card_likes.appendChild(likes_button)
        let likes_count = document.createElement("p")
        likes_count.setAttribute("class", "playlist-num-likes")
        likes_count.innerText = playlist.num_likes
        card_likes.appendChild(likes_count)
        new_card.appendChild(card_likes)

        playlists_box.appendChild(new_card)
    }
};

const main = async () => {
    const data = await get_json_data()
    console.log("Data:" + JSON.stringify(data))
    songs = data.songs
    const playlists = data.playlists
    populate_playlists(playlists)
    
};

main()