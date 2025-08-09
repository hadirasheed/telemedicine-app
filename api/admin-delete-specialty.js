const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).end();
  try{
    if(req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error:'Unauthorized' });
    const { id } = req.body || {}; if(!id) return res.status(400).json({ error:'id required' });
    const { error } = await supabase.from('specialties').delete().eq('id', id);
    if(error) throw error; res.json({ ok:true });
  }catch(e){ res.status(500).json({ error:e.message }); }
};
// JS code for admin-delete-specialty
