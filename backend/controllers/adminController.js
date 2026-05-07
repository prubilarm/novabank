/**
 * Controlador administrativo para NovaBank
 */
exports.getStats = async (req, res) => {
  res.json({
    totalUsers: 150,
    totalTransactions: 1200,
    activeAccounts: 145
  });
};

exports.suspendUser = async (req, res) => {
  const { userId } = req.body;
  res.json({ message: `Usuario ${userId} suspendido (Simulado)` });
};
