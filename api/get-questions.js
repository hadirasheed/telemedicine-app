const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  try{
    const specId = req.query.specId;
    if(!specId) return res.status(400).json({ error: 'specId required' });
    const { data, error } = await supabase.from('questions').select('id,text').eq('spec_id', specId).order('text');
    if(error) throw error;
    res.json({ questions: data || [] });
  }catch(e){ res.status(500).json({ error: e.message }); }
};
// JS code for get-questions
