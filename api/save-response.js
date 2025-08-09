const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  if(req.method !== 'POST') return res.status(405).end();
  try{
    const p = req.body || {};
    const required = ['token','specId','questionId','questionText','answer','setIndex','indexInSet'];
    for(const k of required){ if(p[k]===undefined) return res.status(400).json({ error:`Missing ${k}`}); }
    const { error } = await supabase.from('responses').insert({
      token: p.token,
      spec_id: p.specId,
      question_id: p.questionId,
      question_text: p.questionText,
      answer: p.answer,
      reasons: p.reasons || [],
      note: p.note || null,
      set_index: p.setIndex,
      index_in_set: p.indexInSet
    });
    if(error) throw error;
    res.json({ ok: true });
  }catch(e){ res.status(500).json({ error: e.message }); }
};
// JS code for save-response
