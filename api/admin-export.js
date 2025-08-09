const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function csvEscape(s=''){ s=String(s); return /[",\n]/.test(s)? '"'+s.replace(/"/g,'""')+'"' : s; }

module.exports = async (req, res) => {
  try{
    if(req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error:'Unauthorized' });
    const { data, error } = await supabase
      .from('responses')
      .select('token, spec_id, question_text, answer, reasons, note, set_index, index_in_set, created_at, app_users(name)')
      .order('created_at');
    if(error) throw error;
    const header = ['token','name','spec_id','question','answer','reasons','note','setIndex','indexInSet','timestamp'];
    const rows = data.map(r=>[
      r.token,
      (r.app_users||{}).name || '',
      r.spec_id,
      r.question_text,
      r.answer,
      (r.reasons||[]).join('|'),
      r.note||'',
      r.set_index,
      r.index_in_set,
      r.created_at
    ]);
    const csv = [header].concat(rows).map(r=>r.map(csvEscape).join(',')).join('\n');
    res.setHeader('Content-Type','text/csv');
    res.setHeader('Content-Disposition','attachment; filename="responses.csv"');
    res.send(csv);
  }catch(e){ res.status(500).json({ error: e.message }); }
};
// JS code for admin-export
