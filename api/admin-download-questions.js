const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function csvEscape(s=''){ s=String(s); return /[",\n]/.test(s)? '"'+s.replace(/"/g,'""')+'"' : s; }

module.exports = async (req, res) => {
  try{
    if(req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error:'Unauthorized' });
    const specId = req.query.specId; if(!specId) return res.status(400).json({ error:'specId required' });
    const { data: spec } = await supabase.from('specialties').select('name').eq('id', specId).single();
    const { data, error } = await supabase.from('questions').select('text').eq('spec_id', specId);
    if(error) throw error;
    const rows = [['specialty','question']].concat((data||[]).map(q=>[spec?.name||'', q.text]));
    const csv = rows.map(r=>r.map(csvEscape).join(',')).join('\n');
    res.setHeader('Content-Type','text/csv');
    res.setHeader('Content-Disposition','attachment; filename="questions.csv"');
    res.send(csv);
  }catch(e){ res.status(500).json({ error:e.message }); }
};
// JS code for admin-download-questions
