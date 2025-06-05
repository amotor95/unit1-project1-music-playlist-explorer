// FEATURED PLAYLIST

const render_featured = async () => {
    const data = await get_json_data()
    const playlists = data.playlists
    const songs = data.songs
    const random_playlist_index = Math.floor(Math.random() * playlists.length)
    const playlist = playlists[random_playlist_index]

    const main = document.getElementById("featured-main")

    const featured_content = document.createElement("section")
    featured_content.setAttribute("class", "featured-content")

    const featured_header = document.createElement("div")
    featured_header.setAttribute("class", "featured-header")

    const featured_image = document.createElement("img")
    featured_image.setAttribute("class", "featured-image")
    featured_image.setAttribute("src", playlist.playlist_art)
    featured_header.appendChild(featured_image)

    const featured_title = document.createElement("p")
    featured_title.setAttribute("class", "featured-title")
    featured_title.innerText = playlist.playlist_name
    featured_header.appendChild(featured_title)

    const featured_creator = document.createElement("p")
    featured_creator.setAttribute("class", "featured-creator")
    featured_creator.innerText = playlist.playlist_author
    featured_header.appendChild(featured_creator)

    featured_content.appendChild(featured_header)

    const included_songs = get_included_songs(playlist, songs)

    const songs_list = gen_songs_list(included_songs)
    songs_list.setAttribute("class", "playlist-songs")
    featured_content.appendChild(songs_list)
    main.appendChild(featured_content)
}

render_featured()