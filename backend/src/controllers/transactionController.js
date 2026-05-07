const supabase = require('../config/supabase');

exports.getTransactions = async (req, res) => {
  try {
    // Primero obtenemos el ID de la cuenta del usuario
    const { data: account } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' });

    // Buscamos transacciones vinculadas a ese account_id
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`sender_account_id.eq.${account.id},receiver_account_id.eq.${account.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener transacciones' });
  }
};

exports.transfer = async (req, res) => {
  const { targetEmail, amount, description } = req.body;
  const senderUserId = req.user.id;

  try {
    // 1. Obtener cuenta emisor
    const { data: senderAccount } = await supabase
      .from('accounts')
      .select('id, balance')
      .eq('user_id', senderUserId)
      .single();

    if (senderAccount.balance < amount) return res.status(400).json({ message: 'Saldo insuficiente' });

    // 2. Buscar cuenta receptor por Email (vía tabla users)
    const { data: receiverUser } = await supabase
      .from('users')
      .select('id, accounts(id)')
      .eq('email', targetEmail)
      .single();

    if (!receiverUser || !receiverUser.accounts[0]) {
      return res.status(404).json({ message: 'Usuario de destino no encontrado' });
    }

    const receiverAccountId = receiverUser.accounts[0].id;

    // 3. Ejecutar transferencias (Actualizar balances)
    await supabase.from('accounts').update({ balance: parseFloat(senderAccount.balance) - parseFloat(amount) }).eq('id', senderAccount.id);
    
    const { data: recvAcc } = await supabase.from('accounts').select('balance').eq('id', receiverAccountId).single();
    await supabase.from('accounts').update({ balance: parseFloat(recvAcc.balance) + parseFloat(amount) }).eq('id', receiverAccountId);

    // 4. Registrar transacción en la tabla obligatoria
    await supabase.from('transactions').insert([
      { 
        sender_account_id: senderAccount.id, 
        receiver_account_id: receiverAccountId, 
        amount: amount, 
        description: description,
        transaction_type: 'transfer'
      }
    ]);

    res.json({ message: 'Transferencia completada con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error en la operación de transferencia' });
  }
};
