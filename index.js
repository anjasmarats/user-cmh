// index.js
import express from 'express';
import cors from 'cors';
import supabase from './supabaseClient.js';
import bcrypt from 'bcryptjs';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET - Ambil semua produk
app.get('/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

// POST - Buat produk baru
app.post('/user', async (req, res) => {
  const { email, password } = req.body;

  const { data: user, err } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (err || !user) {
      console.error("error mengecek db", error,"\n\nuser\n\n",user)
      return res.json(500).json({
        message: "error mengecek db"
      });
    }

    if (user) {
      console.error("error, user suda ada")
      return res.json(400).json({
        message: "user sudah ada"
      });
    }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const { data, error } = await supabase
    .from('users')
    .insert([{ email, password:hashedPassword }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json(data);
});

// PUT - Perbarui produk berdasarkan ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  const { data, error } = await supabase
    .from('products')
    .update({ email, password })
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json(data);
});

// DELETE - Hapus produk berdasarkan ID
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.status(200).json({ message: 'Product deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
