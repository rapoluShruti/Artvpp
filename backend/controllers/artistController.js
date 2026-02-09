const pool = require("../config/db");

/* Apply to become artist */
exports.applyArtist = async (req, res) => {
  const { display_name, bio, specialization, portfolio_link } = req.body;

  try {
    // Use users table to record artist application (merge profile into users)
    const existing = await pool.query(
      "SELECT artist_status, role FROM users WHERE id=$1",
      [req.user.id]
    );

    if (existing.rows.length > 0) {
      const st = existing.rows[0].artist_status;
      const role = existing.rows[0].role;
      if (role === 'artist' || st === 'approved') {
        return res.status(400).json({ message: "Already an artist" });
      }
      if (st === 'pending') {
        return res.status(400).json({ message: "Already applied" });
      }
    }

    await pool.query(
      `UPDATE users SET artist_display_name=$1, artist_bio=$2, artist_specialization=$3, artist_portfolio_link=$4, artist_status='pending' WHERE id=$5`,
      [display_name, bio, specialization, portfolio_link, req.user.id]
    );

    res.json({ message: "Artist application submitted" });


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Admin: get pending artists */
exports.getPendingArtists = async (req, res) => {
  const result = await pool.query(
    `SELECT id, artist_display_name as display_name, artist_specialization as specialization, email
     FROM users WHERE artist_status='pending'`
  );
  res.json(result.rows);
};

/* Admin: approve artist */
exports.approveArtist = async (req, res) => {
  const { userId } = req.params;

  await pool.query(
    "UPDATE users SET artist_status='approved', role='artist' WHERE id=$1",
    [userId]
  );

  res.json({ message: "Artist approved" });
};
