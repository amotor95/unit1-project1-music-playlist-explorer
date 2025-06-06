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
    playlist_card.remove()
}

// END DELETE PLAYLISTS

// START POPULATING PLAYLISTS

const populate_playlists = (playlists) => {
    const playlists_box = document.getElementById("playlist-cards-box")
    if (playlists.length > 0) {
        for (const playlist of playlists) {
            const new_card = document.createElement("div")
            new_card.setAttribute("class", "playlist-card")
            new_card.playlist = playlist
            // console.log(new_card.playlist)

            const delete_playlist_button = document.createElement("btn")
            delete_playlist_button.setAttribute("class", "delete-playlist-btn")
            delete_playlist_button.innerText = "×"
            delete_playlist_button.addEventListener("click", (e) => delete_playlist(e))
            new_card.appendChild(delete_playlist_button)

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
    const songs = await get_songs()
    console.log("creating modal w/:")
    console.log(playlist)
    console.log(songs)

    const close_btn = document.getElementById("playlist-modal-close")
    close_btn.addEventListener("click", () => {modal.style.display = "none";})

    const shuffle_btn = document.getElementById("shuffle-btn")
    shuffle_btn.addEventListener("click", shuffle_songs)

    const modal_image = document.getElementById("playlist-modal-image")
    modal_image.setAttribute("src", playlist.playlist_art)

    const modal_title = document.getElementById("playlist-modal-title")
    modal_title.innerText = playlist.playlist_name

    const modal_creator = document.getElementById("playlist-modal-creator")
    modal_creator.innerText = playlist.playlist_author

    // const modal_content = document.getElementById("playlist-modal-content")

    const songs_list = document.getElementsByClassName("playlist-songs")[0]

    const included_songs = get_included_songs(playlist, songs)

    const new_song_list = gen_songs_list(included_songs)
    new_song_list.setAttribute("class", "playlist-songs")
    console.log(songs_list)
    songs_list.replaceWith(new_song_list)

    // modal_content.remove()

    // const new_modal_content = document.createElement("div")
    // new_modal_content.setAttribute("id", "playlist-modal-content")
    // new_modal_content.setAttribute("class", "modal-context")

    // const close_btn = document.createElement("span")
    // close_btn.setAttribute("id", "playlist-modal-close")
    // close_btn.innerText = "×"
    // close_btn.addEventListener("click", () => {modal.style.display = "none";})

    // const playlist_modal_header = document.createElement("div")
    // playlist_modal_header.setAttribute("id", "playlist-modal-header")

    // const playlist_image = document.createElement("img")
    // playlist_image.setAttribute("src", playlist.playlist_art)
    // playlist_image.setAttribute("alt", "playlist image")
    // playlist_image.setAttribute("class", "playlist-modal-image")
    // playlist_modal_header.appendChild(playlist_image)

    // const playlist_model_header_info = document.createElement("div")
    // playlist_model_header_info.setAttribute("id", "playlist-modal-header-info")

    // const playlist_modal_title = document.createElement("h1")
    // playlist_modal_title.setAttribute("id", "playlist-modal-title")
    // playlist_modal_title.innerText = playlist.playlist_name

    // const playlist_modal_creator = document.createElement("p")
    // playlist_modal_creator.setAttribute("id", "playlist-modal-creator")
    // playlist_modal_creator.innerText = playlist.playlist_author

    // playlist_model_header_info.appendChild(playlist_modal_title)
    // playlist_model_header_info.appendChild(playlist_modal_creator)

    // playlist_modal_header.appendChild(playlist_model_header_info)

    // const modal_shuffle_btn = document.createElement("btn")
    // modal_shuffle_btn.setAttribute("id", "shuffle-btn")
    // modal_shuffle_btn.addEventListener("click", shuffle_songs)
    // modal_shuffle_btn.innerText = "🔀"

    // playlist_modal_header.appendChild(modal_shuffle_btn)

    // new_modal_content.appendChild(close_btn)
    // new_modal_content.appendChild(playlist_modal_header)


    // const included_songs = get_included_songs(playlist, songs)

    // document.getElementsByClassName("playlist-songs")[0].remove()
    // const songs_list = gen_songs_list(included_songs)
    // songs_list.setAttribute("class", "playlist-songs")
    // new_modal_content.appendChild(songs_list)

    // modal.appendChild(new_modal_content)

    modal.style.display = "block";
};

// END MODAL

// START ADD PLAYLIST MODAL

const add_playlist_btn = document.getElementById("add-playlist-btn")

const create_add_playlist_modal = () => {
    modal.style.display = "block";

    const modal_content = document.getElementById("playlist-modal-content")

    modal_content.remove()

    // Add new nodes to new_modal_content
    const new_modal_content = document.createElement("div")
    new_modal_content.setAttribute("id", "playlist-modal-content")
    new_modal_content.setAttribute("class", "modal-context")

    const close_btn = document.createElement("span")
    close_btn.setAttribute("id", "playlist-modal-close")
    close_btn.innerText = "×"
    close_btn.addEventListener("click", () => {modal.style.display = "none";})

    new_modal_content.appendChild(close_btn)

    const new_playlist_content = document.createElement("div")
    new_playlist_content.setAttribute("class", "add-playlist-content")

    const new_playlist_info = document.createElement("div")
    new_playlist_info.setAttribute("class", "new-playlist-info")

    const new_title = document.createElement("h1")
    new_title.setAttribute("class", "new-playlist-title")
    new_title.innerText = "Add A New Playlist"



    new_playlist_content.appendChild(new_playlist_info)
    modal.appendChild(new_modal_content)

}

add_playlist_btn.addEventListener("click", create_add_playlist_modal)

// END ADD PLAYLIST MODAL

// START LIKING PLAYLISTS

const toggle_like = (e) => {
    // Works because the only other sibling is the like count node
    like_count = e.target.nextSibling
    // console.log(like_count)
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

const render_main = async () => {
    const data = await get_json_data()
    const playlists = data.playlists
    populate_playlists(playlists)
};

render_main()