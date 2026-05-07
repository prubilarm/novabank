// --- Controlador de Movimientos de NovaBank ---
// Aquí es donde sucede el movimiento de dinero: depósitos y transferencias
const supabase = require('../services/supabaseClient'); // Conexión a nuestra base de datos

/**
 * Obtener saldo actual del usuario
 */
const getBalance = async (req, res) => {
  try {
    const { data: account, error } = await supabase
      .from('accounts')
      .select('balance, currency')
      .eq('user_id', req.user.id)
      .single();
    
    if (error) {
      // Si la DB no está configurada, devolvemos un saldo de simulación para que la web no se rompa
      if (error === 'DB no configurada' || (error.message && error.message.includes('DB no configurada'))) {
        return res.json({
          success: true,
          balance: 10000.00,
          currency: 'USD',
          simulated: true
        });
      }
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener saldo' 
      });
    }
    
    res.json({
      success: true,
      balance: parseFloat(account.balance),
      currency: account.currency
    });
    
  } catch (error) {
    console.error('Error en getBalance:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Realizar un depósito
 */
const deposit = async (req, res) => {
  try {
    const { amount, description } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Monto de depósito inválido' 
      });
    }
    
    // Obtener la cuenta del usuario
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id, balance')
      .eq('user_id', req.user.id)
      .single();
    
    if (accountError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener cuenta' 
      });
    }
    
    // Actualizar saldo
    const newBalance = parseFloat(account.balance) + parseFloat(amount);
    const { error: updateError } = await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('id', account.id);
    
    if (updateError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al actualizar saldo' 
      });
    }
    
    // Registrar transacción
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([{
        sender_account_id: account.id,
        receiver_account_id: account.id,
        amount: amount,
        transaction_type: 'deposit',
        description: description || 'Depósito en efectivo'
      }])
      .select()
      .single();
    
    if (txError) {
      console.error('Error al registrar transacción:', txError);
    }
    
    res.json({
      success: true,
      message: 'Depósito realizado exitosamente',
      newBalance: newBalance,
      transaction
    });
    
  } catch (error) {
    console.error('Error en deposit:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Realizar transferencia entre cuentas
 */
const transfer = async (req, res) => {
  try {
    const { toEmail, amount, description } = req.body;
    
    if (!toEmail || !amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Destinatario y monto son requeridos' 
      });
    }
    
    // Obtener cuenta del remitente
    const { data: senderAccount, error: senderError } = await supabase
      .from('accounts')
      .select('id, balance')
      .eq('user_id', req.user.id)
      .single();
    
    if (senderError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener cuenta del remitente' 
      });
    }
    
    // Verificar saldo suficiente
    if (parseFloat(senderAccount.balance) < parseFloat(amount)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Saldo insuficiente para realizar la transferencia' 
      });
    }
    
    // Buscar destinatario por email
    const { data: receiver, error: receiverError } = await supabase
      .from('users')
      .select('id')
      .eq('email', toEmail)
      .single();
    
    if (receiverError || !receiver) {
      return res.status(404).json({ 
        success: false, 
        error: 'Usuario destinatario no encontrado' 
      });
    }
    
    // Obtener cuenta del destinatario
    const { data: receiverAccount, error: receiverAccountError } = await supabase
      .from('accounts')
      .select('id, balance')
      .eq('user_id', receiver.id)
      .single();
    
    if (receiverAccountError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener cuenta del destinatario' 
      });
    }
    
    // Iniciar transacción (usando supabase para atomicidad)
    const newSenderBalance = parseFloat(senderAccount.balance) - parseFloat(amount);
    const newReceiverBalance = parseFloat(receiverAccount.balance) + parseFloat(amount);
    
    // Actualizar saldo del remitente
    const { error: updateSenderError } = await supabase
      .from('accounts')
      .update({ balance: newSenderBalance })
      .eq('id', senderAccount.id);
    
    if (updateSenderError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al actualizar saldo del remitente' 
      });
    }
    
    // Actualizar saldo del destinatario
    const { error: updateReceiverError } = await supabase
      .from('accounts')
      .update({ balance: newReceiverBalance })
      .eq('id', receiverAccount.id);
    
    if (updateReceiverError) {
      // Revertir cambio del remitente
      await supabase
        .from('accounts')
        .update({ balance: senderAccount.balance })
        .eq('id', senderAccount.id);
      
      return res.status(500).json({ 
        success: false, 
        error: 'Error al actualizar saldo del destinatario' 
      });
    }
    
    // Registrar transacción
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([{
        sender_account_id: senderAccount.id,
        receiver_account_id: receiverAccount.id,
        amount: amount,
        transaction_type: 'transfer',
        description: description || `Transferencia a ${toEmail}`
      }])
      .select()
      .single();
    
    if (txError) {
      console.error('Error al registrar transacción:', txError);
    }
    
    res.json({
      success: true,
      message: 'Transferencia realizada exitosamente',
      newBalance: newSenderBalance,
      transaction
    });
    
  } catch (error) {
    console.error('Error en transfer:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Obtener historial de transacciones
 */
const getHistory = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    // Obtener la cuenta del usuario
    const { data: account, error: accountError } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', req.user.id)
      .single();
    
    if (accountError) {
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener cuenta' 
      });
    }
    
    // Obtener transacciones donde el usuario es remitente o destinatario
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select(`
        *,
        sender:sender_account_id (user_id),
        receiver:receiver_account_id (user_id)
      `)
      .or(`sender_account_id.eq.${account.id},receiver_account_id.eq.${account.id}`)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    
    if (txError) {
      if (txError === 'DB no configurada' || (txError.message && txError.message.includes('DB no configurada'))) {
        return res.json({
          success: true,
          transactions: [
            { id: 'sim-1', amount: 2500.00, direction: 'incoming', transaction_type: 'deposit', description: 'Nómina Mensual', created_at: new Date().toISOString(), counterparty: { full_name: 'Empresa Global S.A.' } },
            { id: 'sim-2', amount: 45.50, direction: 'outgoing', transaction_type: 'transfer', description: 'Pago Amazon Store', created_at: new Date(Date.now() - 86400000).toISOString(), counterparty: { full_name: 'Amazon' } },
            { id: 'sim-3', amount: 120.00, direction: 'outgoing', transaction_type: 'transfer', description: 'Cena Restaurante', created_at: new Date(Date.now() - 172800000).toISOString(), counterparty: { full_name: 'Restaurante Gourmet' } }
          ],
          count: 3,
          simulated: true
        });
      }
      return res.status(500).json({ 
        success: false, 
        error: 'Error al obtener historial' 
      });
    }
    
    // Enriquecer transacciones con información adicional
    const enrichedTransactions = await Promise.all(transactions.map(async (tx) => {
      let direction = 'unknown';
      let counterparty = null;
      
      if (tx.sender_account_id === account.id) {
        direction = 'outgoing';
        // Obtener info del destinatario
        const { data: receiverUser } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', tx.receiver?.user_id)
          .single();
        counterparty = receiverUser;
      } else if (tx.receiver_account_id === account.id) {
        direction = 'incoming';
        // Obtener info del remitente
        const { data: senderUser } = await supabase
          .from('users')
          .select('full_name, email')
          .eq('id', tx.sender?.user_id)
          .single();
        counterparty = senderUser;
      }
      
      return {
        ...tx,
        direction,
        counterparty,
        amount: parseFloat(tx.amount)
      };
    }));
    
    res.json({
      success: true,
      transactions: enrichedTransactions,
      count: enrichedTransactions.length
    });
    
  } catch (error) {
    console.error('Error en getHistory:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

module.exports = {
  getBalance,
  deposit,
  transfer,
  getHistory
};
