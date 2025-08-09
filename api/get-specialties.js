const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

module.exports = async (req, res) => {
  try{
    const { data, error } = await supabase.from('specialties').select('id,name').order('name');
    if(error) throw error;
    res.json({ specialties: data || [] });
  }catch(e){ res.status(500).json({ error: e.message }); }
};
// JS code for get-specialties
