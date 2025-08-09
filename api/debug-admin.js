module.exports = async (req, res) => {
  const set = typeof process.env.ADMIN_PASSWORD === 'string' && process.env.ADMIN_PASSWORD.length > 0;
  // Don't leak the password—just say if it's set and its length.
  res.json({
    ok: true,
    adminPasswordIsSet: set,
    adminPasswordLength: set ? process.env.ADMIN_PASSWORD.length : 0,
    env: process.env.VERCEL_ENV || 'unknown' // "production" or "preview"
  });
};
