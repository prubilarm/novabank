const supabase = require('../services/supabaseClient');

class Account {
  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) return null;
    return data;
  }

  static async updateBalance(accountId, newBalance) {
    const { data, error } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', accountId);
    if (error) throw error;
    return data;
  }

  static async create(accountData) {
    const { data, error } = await supabase
      .from('accounts')
      .insert([accountData]);
    if (error) throw error;
    return data;
  }
}

module.exports = Account;
