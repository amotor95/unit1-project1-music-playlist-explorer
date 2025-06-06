// FEATURED PLAYLIST

const render_featured = async () => {
    const data = await get_json_data()
    const playlists = data.playlists
    const songs = data.songs
    const random_playlist_index = Math.floor(Math.random() * playlists.length)
    const playlist = playlists[random_playlist_index]

    const featured_image = document.getElementsByClassName("featured-image")[0]
    featured_image.setAttribute("src", playlist.playlist_art)

    const featured_title = document.getElementsByClassName("featured-title")[0]
    featured_title.innerText = playlist.playlist_name

    const featured_creator = document.getElementsByClassName("featured-creator")[0]
    featured_creator.innerText = playlist.playlist_author

    const songs_list = document.getElementsByClassName("playlist-songs")[0]

    const included_songs = get_included_songs(playlist, songs)

    const new_song_list = gen_songs_list(included_songs)
    new_song_list.setAttribute("class", "playlist-songs")
    songs_list.replaceWith(new_song_list)
}

render_featured()