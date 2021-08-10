const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(userId, playlistId) {
    const query = {
      text: `SELECT songs.title, songs.performer, playlists.id FROM playlistsongs
        LEFT JOIN songs ON songs.id = playlistsongs.song_id
        LEFT JOIN playlists ON playlists.id = playlistsongs.playlist_id
        LEFT JOIN users ON users.id = playlists.owner
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        WHERE playlists.id = $1 AND playlists.owner = $2 OR collaborations.user_id = $2
        GROUP BY playlists.id, songs.title, songs.performer`,
      values: [playlistId, userId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
