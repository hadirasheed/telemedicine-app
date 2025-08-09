const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).end();
  try{
    if(req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error:'Unauthorized' });
    const { id, name } = req.body || {};
    if(!name || !name.trim()) return res.status(400).json({ error:'name required' });
    if(id){
      const { error } = await supabase.from('specialties').update({ name: name.trim() }).eq('id', id);
      if(error) throw error;
      return res.json({ ok:true, id });
    } else {
      const { data, error } = await supabase.from('specialties').insert({ name: name.trim() }).select('id').single();
      if(error) throw error; return res.json({ ok:true, id:data.id });
    }
  }catch(e){ res.status(500).json({ error:e.message }); }
};
// JS code for admin-upsert-specialty
