const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const User = require('../models/User');

exports.getHistory = async (req, res) => {
  try {
    const account = await Account.findByUserId(req.user.id);
    if (!account) return res.status(404).json({ message: 'Cuenta no encontrada' });

    const history = await Transaction.findByAccountId(account.id);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.transfer = async (req, res) => {
  const { targetEmail, amount, description } = req.body;
  const senderUserId = req.user.id;

  try {
    const senderAccount = await Account.findByUserId(senderUserId);
    if (senderAccount.balance < amount) return res.status(400).json({ message: 'Saldo insuficiente' });

    const receiverUser = await User.findByEmail(targetEmail);
    if (!receiverUser || !receiverUser.accounts[0]) {
      return res.status(404).json({ message: 'Destinatario no encontrado' });
    }

    const receiverAccount = receiverUser.accounts[0];

    // Ejecutar movimientos
    await Account.updateBalance(senderAccount.id, parseFloat(senderAccount.balance) - parseFloat(amount));
    await Account.updateBalance(receiverAccount.id, parseFloat(receiverAccount.balance) + parseFloat(amount));

    // Registrar transacción
    await Transaction.create({
      sender_account_id: senderAccount.id,
      receiver_account_id: receiverAccount.id,
      amount: amount,
      description: description,
      transaction_type: 'transfer'
    });

    res.json({ message: 'Transferencia realizada con éxito' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
