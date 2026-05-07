const supabase = require('../services/supabaseClient');

/**
 * Obtener todos los usuarios (solo admin)
 */
const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at, welcome_email_sent')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener usuarios' 
      });
    }
    
    // Obtener saldo de cada usuario
    const usersWithBalance = await Promise.all(users.map(async (user) => {
      const { data: account } = await supabase
        .from('accounts')
        .select('balance')
        .eq('user_id', user.id)
        .single();
      
      return {
        ...user,
        balance: account ? parseFloat(account.balance) : 0
      };
    }));
    
    res.json({
      success: true,
      users: usersWithBalance,
      total: usersWithBalance.length
    });
    
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Obtener todas las transacciones (solo admin)
 */
const getAllTransactions = async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query;
    
    const { data: transactions, error, count } = await supabase
      .from('transactions')
      .select('*, sender:sender_account_id (user_id), receiver:receiver_account_id (user_id)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener transacciones' 
      });
    }
    
    // Enriquecer con emails de usuarios
    const enrichedTransactions = await Promise.all(transactions.map(async (tx) => {
      let senderEmail = null;
      let receiverEmail = null;
      
      if (tx.sender?.user_id) {
        const { data: sender } = await supabase
          .from('users')
          .select('email, full_name')
          .eq('id', tx.sender.user_id)
          .single();
        senderEmail = sender;
      }
      
      if (tx.receiver?.user_id) {
        const { data: receiver } = await supabase
          .from('users')
          .select('email, full_name')
          .eq('id', tx.receiver.user_id)
          .single();
        receiverEmail = receiver;
      }
      
      return {
        ...tx,
        amount: parseFloat(tx.amount),
        sender_email: senderEmail,
        receiver_email: receiverEmail
      };
    }));
    
    res.json({
      success: true,
      transactions: enrichedTransactions,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
  } catch (error) {
    console.error('Error en getAllTransactions:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Obtener estadísticas del sistema (solo admin)
 */
const getStats = async (req, res) => {
  try {
    // Total de usuarios
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    // Total de transacciones
    const { count: totalTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });
    
    // Volumen total transferido
    const { data: transferVolume } = await supabase
      .from('transactions')
      .select('amount')
      .eq('transaction_type', 'transfer');
    
    const totalVolume = transferVolume?.reduce((sum, tx) => sum + parseFloat(tx.amount), 0) || 0;
    
    // Usuarios nuevos en los últimos 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: newUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());
    
    res.json({
      success: true,
      stats: {
        total_users: totalUsers,
        total_transactions: totalTransactions,
        total_transfer_volume: totalVolume,
        new_users_last_7_days: newUsers,
        average_transaction: totalTransactions > 0 ? totalVolume / totalTransactions : 0
      }
    });
    
  } catch (error) {
    console.error('Error en getStats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

module.exports = {
  getAllUsers,
  getAllTransactions,
  getStats
};
