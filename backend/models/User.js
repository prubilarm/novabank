const supabase = require('../services/supabaseClient');

class User {
  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*, accounts(*)')
      .eq('email', email)
      .single();
    if (error) return null;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*, accounts(*)')
      .eq('id', id)
      .single();
    if (error) return null;
    return data;
  }

  static async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

module.exports = User;
