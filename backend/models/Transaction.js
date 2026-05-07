const supabase = require('../services/supabaseClient');

class Transaction {
  static async findByAccountId(accountId) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`sender_account_id.eq.${accountId},receiver_account_id.eq.${accountId}`)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  static async create(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transactionData]);
    if (error) throw error;
    return data;
  }
}

module.exports = Transaction;
