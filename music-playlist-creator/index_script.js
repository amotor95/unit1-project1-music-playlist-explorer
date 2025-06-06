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

// START DELETE PLAYLISTS

const delete_playlist = (e) => {
    const playlist_card = e.target.parentElement
    // Don't need to pass in playlist_card, if you do it reads as 0 b/c filter doesn't provide it for comparator func
    playlists = playlists.filter( (playlist) => {return playlist.playlistID !== playlist_card.playlist.playlistID})
    playlist_card.remove()
}

// END DELETE PLAYLISTS

// START EDIT PLAYLISTS

let edit_target = null

const modal_edit_playlist = () => {
    const playlist_title = document.getElementById("add-playlist-title-input").value
    const playlist_author = document.getElementById("add-playlist-creator-input").value
    const playlist_image = document.getElementById("add-playlist-image-input").value
    const original_playlist = edit_target.playlist
    const new_playlist = {
        "playlistID": original_playlist.playlistID,
        "playlist_name": playlist_title,
        "playlist_author": playlist_author,
        "playlist_art": playlist_image,
        "num_likes": original_playlist.num_likes,
        "song_list": [...original_playlist.song_list, ...to_be_added_song_ids]
    }
    // Replace original playlist in the playlists object/data model
    for (let i = 0; i < playlists.length; i++) {
        if (playlists[i].playlistID === original_playlist.playlistID) {
            playlists[i] = new_playlist
        }
    }
    const new_playlist_card = create_playlist_card(new_playlist)
    edit_target.replaceWith(new_playlist_card)
    to_be_added_song_ids = []
    edit_target = null
    hide_modals()   

}

// I take the add playlist and adapt it to work with edit 
// (changing text and event listener to edit playlist function above instead of create playlist function)
const edit_playlist = (e) => {
    const playlist_card = e.target.parentElement
    edit_target = playlist_card
    create_add_playlist_modal()
    const header = document.getElementById("add-playlist-header")
    header.innerText = "Edit Playlist"
    const create_btn = document.getElementById("create-playlist-btn")
    create_btn.innerText = "Edit Playlist"
    const new_create_btn = create_btn.cloneNode(true)
    new_create_btn.addEventListener("click", modal_edit_playlist)
    create_btn.replaceWith(new_create_btn)
}

// END EDIT PLAYLISTS

// START POPULATING PLAYLISTS

const create_playlist_card = (playlist) => {
    const new_card = document.createElement("div")
    new_card.setAttribute("class", "playlist-card")
    new_card.playlist = playlist

    const delete_playlist_button = document.createElement("btn")
    delete_playlist_button.setAttribute("class", "delete-playlist-btn")
    delete_playlist_button.innerText = "×"
    delete_playlist_button.addEventListener("click", (e) => delete_playlist(e))
    new_card.appendChild(delete_playlist_button)

    const edit_playlist_button = document.createElement("btn")
    edit_playlist_button.setAttribute("class", "edit-playlist-btn")
    edit_playlist_button.innerText = "EDIT"
    edit_playlist_button.addEventListener("click", (e) => edit_playlist(e))
    new_card.appendChild(edit_playlist_button)

    const card_img = document.createElement("img")
    card_img.setAttribute("class", "playlist-image")
    card_img.setAttribute("src", playlist.playlist_art)
    card_img.setAttribute("alt", "playlist image")
    card_img.playlistID = playlist.playlistID
    // Passes a reference to a function that takes the event as parameter and calls open_modal(e)
    // If you did open_modal(e) it would call it when it when the following line runs instead of on click
    card_img.addEventListener("click", (e) => open_modal(e))
    new_card.appendChild(card_img)

    const card_title = document.createElement("p")
    card_title.setAttribute("class", "playlist-title")
    card_title.innerText = playlist.playlist_name
    card_title.playlistID = playlist.playlistID
    card_title.addEventListener("click", (e) => open_modal(e))
    new_card.appendChild(card_title)
    const card_creator = document.createElement("p")
    card_creator.setAttribute("class", "playlist-creator")
    card_creator.innerText = playlist.playlist_author
    card_creator.playlistID = playlist.playlistID
    card_creator.addEventListener("click", (e) => open_modal(e))
    new_card.appendChild(card_creator)

    const card_likes = document.createElement("div")
    card_likes.setAttribute("class", "playlist-likes-div")
    const likes_button = document.createElement("btn")
    likes_button.setAttribute("class", "playlist-like-button")
    likes_button.innerText = "♡"
    likes_button.addEventListener("click", (e) => toggle_like(e))
    card_likes.appendChild(likes_button)
    const likes_count = document.createElement("p")
    likes_count.setAttribute("class", "playlist-num-likes")
    likes_count.innerText = playlist.num_likes
    likes_count.playlistID = playlist.playlistID
    likes_count.addEventListener("click", (e) => open_modal(e))
    card_likes.appendChild(likes_count)
    new_card.appendChild(card_likes)

    return new_card
}

const populate_playlists = (playlists) => {
    const playlists_box = document.getElementById("playlist-cards-box")
    // console.log(playlists)
    playlists_box.innerHTML = ""
    const playlists_to_populate = order_playlists(playlists)
    // console.log(playlists_to_populate)
    if (playlists_to_populate.length > 0) {
        for (const playlist of playlists_to_populate) {
            const new_card = create_playlist_card(playlist)

            playlists_box.appendChild(new_card)
        }
    } else {
        let no_playlists_message = document.createElement("div")
        no_playlists_message.setAttribute("class", "no-playlists")
        no_playlists_message.innerText = "No playlists found! Consider adding some!"
        playlists_box.appendChild(no_playlists_message)
    }
};

// END POPULATING PLAYLISTS

// START MODAL

const modal = document.getElementById("playlist-modal")
const playlist_modal = document.getElementById("playlist-modal-content")
const add_playlist_modal = document.getElementById("add-playlist-modal-content")

const hide_modals = () => {
    modal.style.display = "none";
    playlist_modal.style.display = "none";
    add_playlist_modal.style.display = "none";
}

// Closing modal by clicking shadow (the content counts as something else)
// Target ensures you clicked on modal (shadow) not modal content etc.
// Creates an event listener, can only have one event listern for each object
modal.onclick = (e) => {
    if (e.target === modal) {
        hide_modals()
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
    // const songs = await get_songs()
    console.log("creating modal w/:")
    console.log(playlists)
    console.log(songs)

    const playlist_close_btn = document.getElementById("playlist-modal-close")
    playlist_close_btn.addEventListener("click", hide_modals)

    const shuffle_btn = document.getElementById("shuffle-btn")
    shuffle_btn.addEventListener("click", shuffle_songs)

    const modal_image = document.getElementById("playlist-modal-image")
    modal_image.setAttribute("src", playlist.playlist_art)

    const modal_title = document.getElementById("playlist-modal-title")
    modal_title.innerText = playlist.playlist_name

    const modal_creator = document.getElementById("playlist-modal-creator")
    modal_creator.innerText = playlist.playlist_author

    const songs_list = document.getElementsByClassName("playlist-songs")[0]

    const included_songs = get_included_songs(playlist, songs)

    const new_song_list = gen_songs_list(included_songs)
    new_song_list.setAttribute("class", "playlist-songs")
    songs_list.replaceWith(new_song_list)

    modal.style.display = "block";
    playlist_modal.style.display = "flex";
    add_playlist_modal.style.display = "none";
};

// END MODAL

// START ADD PLAYLIST MODAL

let to_be_added_song_ids = []

const create_add_playlist_modal = () => {
    modal.style.display = "block";
    playlist_modal.style.display = "none";
    add_playlist_modal.style.display = "flex"

    const header = document.getElementById("add-playlist-header")
    header.innerText = "Add Playlist"
    const create_btn = document.getElementById("create-playlist-btn")
    create_btn.innerText = "Add Playlist"
    const new_create_btn = create_btn.cloneNode(true)
    new_create_btn.addEventListener("click", create_playlist)
    create_btn.replaceWith(new_create_btn)

    document.getElementById("add-playlist-title-input").value = ""
    document.getElementById("add-playlist-creator-input").value = ""
    document.getElementById("add-playlist-image-input").value = "assets/img/playlist.png"

    document.getElementById("add-song-title-input").value = ""
    document.getElementById("add-song-author-input").value = ""
    document.getElementById("add-song-album-input").value = ""
    document.getElementById("add-song-image-input").value = "assets/img/song.png"
    document.getElementById("add-song-duration-input").value = ""

    document.getElementById("to-be-added-songs").innerHTML = ""

    const create_song_btn = document.getElementById("add-song-btn")

    create_song_btn.addEventListener("click", create_song)
    
    // const create_playlist_btn = document.getElementById("create-playlist-btn")

    // create_playlist_btn.addEventListener("click", create_playlist)

    to_be_added_song_ids = []

}

const create_song = () => {
    const song_title = document.getElementById("add-song-title-input").value
    const song_author = document.getElementById("add-song-author-input").value
    const song_album = document.getElementById("add-song-album-input").value
    const song_image = document.getElementById("add-song-image-input").value
    const song_duration = document.getElementById("add-song-duration-input").value

    const song = {
        "songID": songs[songs.length-1].songID+1,
        "song_name": song_title,
        "song_artist": song_author,
        "song_album": song_album,
        "song_art": song_image,
        "song_duration": song_duration
    }
    const song_card = create_song_card(song)
    const songs_list = document.getElementById("to-be-added-songs")
    songs.push(song)
    to_be_added_song_ids.push(songs.length)
    songs_list.appendChild(song_card)
}

const create_playlist = () => {
    const playlist_title = document.getElementById("add-playlist-title-input").value
    const playlist_author = document.getElementById("add-playlist-creator-input").value
    const playlist_image = document.getElementById("add-playlist-image-input").value
    const playlist = {
        "playlistID": playlists[playlists.length-1].playlistID+1,
        "playlist_name": playlist_title,
        "playlist_author": playlist_author,
        "playlist_art": playlist_image,
        "num_likes": 0,
        "song_list": to_be_added_song_ids
    }
    const playlist_card = create_playlist_card(playlist)
    const playlist_box = document.getElementById("playlist-cards-box")
    playlist_box.appendChild(playlist_card)
    playlists.push(playlist)
    to_be_added_song_ids = []
    hide_modals()
}


const add_playlist_btn = document.getElementById("add-playlist-btn")
add_playlist_btn.addEventListener("click", create_add_playlist_modal)

const add_playlist_close_btn = document.getElementById("add-playlist-modal-close")
add_playlist_close_btn.addEventListener("click", hide_modals)

// END ADD PLAYLIST MODAL

// START LIKING PLAYLISTS

const toggle_like = (e) => {
    // Works because the only other sibling is the like count node
    like_count = e.target.nextSibling
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

// END LIKING PLAYLISTS

// START SEARCH BAR

const search_bar = document.getElementById("search-text")

let search_mode = "name"

const clear_search_btn = document.getElementById("search-clear-btn")
const clear_search = () => {
    search_bar.value = ""
    query_playlists = playlists
    populate_playlists(playlists)
}
clear_search_btn.addEventListener("click", clear_search)

const toggle_search_btn = document.getElementById("search-type-btn")
const toggle_search = () => {
    if (search_mode === "name") {
        toggle_search_btn.innerText = "Searching by author"
        search_mode = "author"
    } else {
        toggle_search_btn.innerText = "Searching by name"
        search_mode = "name"
    }
}
toggle_search_btn.addEventListener("click", toggle_search)

let query_playlists = []
const search = () => {
    query_playlists = []
    const search_text = search_bar.value
    if (search_mode === "name") {
        for (const playlist of playlists) {
            if (playlist.playlist_name.toLowerCase().includes(search_text.toLowerCase())) {
                query_playlists.push(playlist)
            }
        }
    } else {
        for (const playlist of playlists) {
            if (playlist.playlist_author.toLowerCase().includes(search_text.toLowerCase())) {
                query_playlists.push(playlist)
            }
        }
    }
    populate_playlists(query_playlists)
}

const submit_search_btn = document.getElementById("search-submit-btn")
submit_search_btn.addEventListener("click", search)


// END SEARCH BARS

// START PLAYLIST SORTING

const order_dropdown = document.getElementById("search-order-dropdown")

const order_playlists = (playlists) => {
    let ordered_playlists = playlists
    const sort_mode = order_dropdown.value
    if (sort_mode === "name") {
        ordered_playlists.sort((left, right) => {
            if (left.playlist_name < right.playlist_name) {return -1;}
            if (left.playlist_name > right.playlist_name) {return 1;}
            else {return 0;}
        })
    } else if (sort_mode === "likes") {
        ordered_playlists.sort((left, right) => {
            if (left.num_likes > right.num_likes) {return -1;}
            if (left.num_likes < right.num_likes) {return 1;}
            else {return 0;}
        })
    } else if (sort_mode === "date") {
        ordered_playlists.sort((left, right) => {
            if (left.playlistID > right.playlistID) {return -1;}
            if (left.playlistID < right.playlistID) {return 1;}
            else {return 0;}
        })
    }
    console.log(ordered_playlists)
    return ordered_playlists
}

order_dropdown.addEventListener("change", () => populate_playlists(query_playlists))

// END PLAYLIST SORTING

let playlists = null
let songs = null

const render_main = async () => {
    const data = await get_json_data()
    playlists = data.playlists
    query_playlists = playlists
    songs = data.songs
    populate_playlists(playlists)
};

render_main()