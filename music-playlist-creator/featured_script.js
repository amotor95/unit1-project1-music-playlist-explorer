// FEATURED PLAYLIST

const render_featured = async () => {
    console.log("Hi")
    const data = await get_json_data()
    const playlists = data.playlists
    const songs = data.songs
    const random_playlist_index = Math.floor(Math.random() * playlists.length)
    const playlist = playlists[random_playlist_index]

    const main = document.getElementsByClassName("main")[0]

    const featured_content = document.createElement("section")
    featured_content.setAttribute("id", "playlist-modal-content")

    const featured_header = document.createElement("div")
    featured_header.setAttribute("class", "featured-header")

    const featured_image = document.createElement("img")
    featured_image.setAttribute("id", "featured-image")
    featured_image.setAttribute("src", playlist.playlist_art)
    featured_header.appendChild(featured_image)

    const featured_title = document.createElement("p")
    featured_title.setAttribute("class", "featured-title")
    featured_title.innerText = playlist.playlist_name
    featured_header.appendChild(featured_title)

    const featured_creator = document.createElement("p")
    featured_creator.setAttribute("class", "playlist-creator")
    featured_creator.innerText = playlist.playlist_author
    featured_header.appendChild(featured_creator)

    featured_content.appendChild(featured_header)

    const included_songs = get_included_songs(playlist, songs)

    gen_songs_list(included_songs)

    main.appendChild(featured_content)
}

render_featured()