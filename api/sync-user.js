const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).end();
  try{
    const { token, name } = req.body || {};
    if(!token) return res.status(400).json({ error: 'token required' });
    const { error } = await supabase.from('app_users').upsert({ token, name }, { onConflict: 'token' });
    if(error) throw error;
    res.json({ ok: true });
  }catch(e){ res.status(500).json({ error: e.message }); }
};
// JS code for sync-user
