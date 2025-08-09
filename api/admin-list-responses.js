const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  try{
    if(req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error:'Unauthorized' });
    const { data, error } = await supabase
      .from('responses')
      .select('token, spec_id, question_text, answer, reasons, note, set_index, index_in_set, created_at, app_users(name)')
      .order('created_at');
    if(error) throw error;
    const uniqueUsers = new Set(data.map(r=>r.token)).size;
    const rows = data.map(r=>({ ...r, name: (r.app_users||{}).name }));
    res.json({ uniqueUsers, rows });
  }catch(e){ res.status(500).json({ error: e.message }); }
};
// JS code for admin-list-responses
