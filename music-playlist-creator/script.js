const playlists_url = "/music-playlist-creator/data/data.json"

const get_playlists = () => {
    fetch(URL=playlists_url)
    .then((data) => {
        console.log(data)
        return data
    })
    .catch((error) => {
        console.log(error)
    })
}
