const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function parseCSV(text){
  const lines = text.split(/\r?\n/).filter(l=>l.trim().length);
  return lines.map(line=>{
    const m = [...line.matchAll(/\s*(?:"([^"]*(?:""[^"]*)*)"|([^",]*))\s*(?:,|$)/g)].map(x=>x[1]?x[1].replace(/""/g,'"'):(x[2]||''));
    if(m.length && m[m.length-1]==='') m.pop(); return m;
  });
}

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).end();
  try{
    if(req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error:'Unauthorized' });
    const { csv } = req.body || {}; if(!csv) return res.status(400).json({ error:'csv required' });
    const rows = parseCSV(csv); if(!rows.length) return res.status(400).json({ error:'empty csv' });
    const header = rows[0].map(h=>h.trim().toLowerCase());
    const si = header.indexOf('specialty'); const qi = header.indexOf('question');
    if(si<0 || qi<0) return res.status(400).json({ error:'Header must include specialty,question' });

    let inserted=0; const specNameToId = {};

    const { data: specs } = await supabase.from('specialties').select('id,name');
    (specs||[]).forEach(s=> specNameToId[s.name.toLowerCase()] = s.id);

    for(let r=1;r<rows.length;r++){
      const row = rows[r]; if(!row) continue;
      const specName=(row[si]||'').trim(); const qText=(row[qi]||'').trim();
      if(!specName || !qText) continue;
      let specId = specNameToId[specName.toLowerCase()];
      if(!specId){
        const { data, error } = await supabase.from('specialties').insert({ name: specName }).select('id').single();
        if(error) throw error; specId = data.id; specNameToId[specName.toLowerCase()] = specId;
      }
      const { error: qErr } = await supabase.from('questions').insert({ spec_id: specId, text: qText });
      if(qErr) throw qErr; inserted++;
    }

    res.json({ ok:true, inserted, specialties: Object.keys(specNameToId).length });
  }catch(e){ res.status(500).json({ error:e.message }); }
};
// JS code for admin-import-questions
