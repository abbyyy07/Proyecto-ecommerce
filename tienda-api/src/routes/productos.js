router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagen, categoria_id } = req.body;
    const [resultado] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock, imagen, categoria_id) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, descripcion, precio, stock, imagen, categoria_id]
    );
    res.json({ mensaje: 'Producto creado', id: resultado.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});