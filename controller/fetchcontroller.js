const axios = require('axios');

class Fetch {
    static async showAllMusic(req, res, next) {
        try {
            const {title} = req.body

            const {data} = await axios({
                method: 'GET',
                url: 'https://deezerdevs-deezer.p.rapidapi.com/search',
                params: {q: title},
                headers: {
                    'x-rapidapi-host': 'deezerdevs-deezer.p.rapidapi.com',
                    'x-rapidapi-key': 'a0fd5fdf04msha9dde7e4ff273a1p10644fjsn1b7f916cb262'
                }
            })
            const limit =  data.data.slice(0, 5)
            const tampung = []
            limit.map(el=>{
                const music = {}
                music.title = el.title
                music.artist = el.artist.name 
                music.albumName = el.album.title
                music.imageAlbum = el.album.cover_big
                tampung.push(music)
            })
            res.status(200).json(tampung)

        } catch (err) {
            next(err);
        }
    }

    static async showAllLocations(req, res, next) {
        try {
            const {location} = req.body
            const {data} = await axios({
                method: 'GET',
                url: `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?country=id&proximity=-73.990593%2C40.740121&types=place&access_token=pk.eyJ1IjoiYWduZXNzdXJ5YSIsImEiOiJja3ltMmt5cnExczhpMnBvbHZzNjZwNHlyIn0.SdeuPBofv_1xPCmVIlI_-Q`,
            })
            const limit =  data.features.slice(0, 5)
            const tampung = []
            limit.map(el=>{
                const city = {}
                city.location = el.text
                city.center = el.center
                city.placeName = el.place_name
                tampung.push(city)
            })
            
            res.status(200).json(tampung)
        } catch (err) {
            next(err);
        }
    }
}

module.exports = Fetch;