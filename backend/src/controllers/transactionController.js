const supabase = require('../config/supabase');

exports.getTransactions = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener transacciones' });
  }
};

exports.transfer = async (req, res) => {
  const { targetAccountNumber, amount, description } = req.body;
  const senderId = req.user.id;

  try {
    // 1. Obtener saldo emisor
    const { data: sender, error: sError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', senderId)
      .single();

    if (sender.balance < amount) return res.status(400).json({ message: 'Saldo insuficiente' });

    // 2. Buscar receptor
    const { data: receiver, error: rError } = await supabase
      .from('profiles')
      .select('id')
      .eq('account_number', targetAccountNumber)
      .single();

    if (!receiver) return res.status(404).json({ message: 'Cuenta no encontrada' });

    // 3. Transacción (RPC en Supabase o serie de updates)
    // Para simplificar usaremos updates en serie
    await supabase.from('profiles').update({ balance: sender.balance - amount }).eq('id', senderId);
    
    const { data: recvProfile } = await supabase.from('profiles').select('balance').eq('id', receiver.id).single();
    await supabase.from('profiles').update({ balance: recvProfile.balance + amount }).eq('id', receiver.id);

    // 4. Registrar transacción
    await supabase.from('transactions').insert([
      { 
        sender_id: senderId, 
        receiver_id: receiver.id, 
        amount: amount, 
        description: description,
        type: 'TRANSFER'
      }
    ]);

    res.json({ message: 'Transferencia completada con éxito' });
  } catch (err) {
    res.status(500).json({ message: 'Error en la operación' });
  }
};
