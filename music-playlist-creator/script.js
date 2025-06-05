// Relics of a bygone era
// Tried using fetch->then but I believe that only works for react b/c useEffect updates state after and reloads
// You need to use await/async in JS (?)
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

//START POPULATING PLAYLISTS

const populate_playlists = (playlists) => {
    const playlists_box = document.getElementById("playlist-cards-box")
    if (playlists.length > 0) {
        for (const playlist of playlists) {
            let new_card = document.createElement("div")
            new_card.setAttribute("class", "playlist-card")
            new_card.playlist = playlist
            // console.log(new_card.playlist)

            let card_img = document.createElement("img")
            card_img.setAttribute("class", "playlist-image")
            card_img.setAttribute("src", playlist.playlist_art)
            card_img.setAttribute("alt", "playlist image")
            card_img.playlistID = playlist.playlistID
            // Passes a reference to a function that takes the event as parameter and calls open_modal(e)
            // If you did open_modal(e) it would call it when it when the following line runs instead of on click
            card_img.addEventListener("click", (e) => open_modal(e))
            new_card.appendChild(card_img)

            let card_title = document.createElement("p")
            card_title.setAttribute("class", "playlist-title")
            card_title.innerText = playlist.playlist_name
            card_title.playlistID = playlist.playlistID
            card_title.addEventListener("click", (e) => open_modal(e))
            new_card.appendChild(card_title)
            let card_creator = document.createElement("p")
            card_creator.setAttribute("class", "playlist-creator")
            card_creator.innerText = playlist.playlist_author
            card_creator.playlistID = playlist.playlistID
            card_creator.addEventListener("click", (e) => open_modal(e))
            new_card.appendChild(card_creator)

            let card_likes = document.createElement("div")
            card_likes.setAttribute("class", "playlist-likes-div")
            let likes_button = document.createElement("btn")
            likes_button.setAttribute("class", "playlist-like-button")
            likes_button.innerText = "♡"
            likes_button.addEventListener("click", (e) => toggle_like(e))
            card_likes.appendChild(likes_button)
            let likes_count = document.createElement("p")
            likes_count.setAttribute("class", "playlist-num-likes")
            likes_count.innerText = playlist.num_likes
            likes_count.playlistID = playlist.playlistID
            likes_count.addEventListener("click", (e) => toggle_like(e))
            card_likes.appendChild(likes_count)
            new_card.appendChild(card_likes)

            playlists_box.appendChild(new_card)
        }
    } else {
        let no_playlists_message = document.createElement("div")
        no_playlists_message.setAttribute("class", "no-playlists")
        no_playlists_message.innerText = "No playlists! Consider adding some!"
        playlists_box.appendChild(no_playlists_message)
    }
};

// END POPULATING PLAYLISTS

// START MODAL

const modal = document.getElementById("playlist-modal")

// Close modal button
const close_span = document.getElementById("playlist-modal-close");
close_span.onclick = () => {
    modal.style.display = "none";
};

// Closing modal by clicking shadow (the content counts as something else)
// Target ensures you clicked on modal (shadow) not modal content etc.
// Creates an event listener, can only have one event listern for each object
modal.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
};

// Opening modal by clicking on playlist image, title, author, or likes (everything except like/heart button)
const open_modal = (e) => {
    let playlist_card = null
    try {
        if (e.target.className === "playlist-image"
        || e.target.className === "playlist-title"
        || e.target.className === "playlist-creator"
    ) {
        playlist_card = e.target.parentElement
        create_modal(playlist_card.playlist)
    } else if (e.target.className === "playlist-num-likes") {
        playlist_card = e.target.parentElement.parentElement
        create_modal(playlist_card.playlist)
    }
    } catch(e) {
        console.log(e)
    }
}

const create_modal = async (playlist) => {
    console.log("creating modal w/:")
    const songs = await get_songs()
    console.log(playlist)
    console.log(songs)
    document.getElementById("playlist-modal-image").src = playlist.playlist_art;
    document.getElementById("playlist-modal-title").innerText = playlist.playlist_name;
    document.getElementById("playlist-modal-creator").innerText = playlist.playlist_author;

    document.getElementById("playlist-modal-songs").remove()

    const song_list = document.createElement("div")
    song_list.setAttribute("id", "playlist-modal-songs")

    const modal_content = document.getElementById("playlist-modal-content")

    for(const song of songs) {
        if (playlist.song_list.includes(song.songID)) {
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
            
            song_list.appendChild(song_div)
        }
    }

    modal_content.appendChild(song_list)

    modal.style.display = "block";
};

// END MODAL

// START LIKING PLAYLISTS

const toggle_like = (e) => {
    // Works because the only other sibling is the like count node
    like_count = e.target.nextSibling
    console.log(like_count)
    if (e.target.innerText === "♡") {
        like_count.innerText = (parseInt(like_count.innerText) + 1)
        e.target.innerText = "❤️"
        e.target.paddingBottom = "0px"
    } else {
        like_count.innerText = (parseInt(like_count.innerText) - 1)
        e.target.innerText = "♡"
        e.target.paddingBottom = "5px"
    }
}

const render_main_page = async () => {
    const data = await get_json_data()
    const playlists = data.playlists
    populate_playlists(playlists)
};

render_main_page()