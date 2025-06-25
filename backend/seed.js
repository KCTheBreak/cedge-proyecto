const bcrypt = require('bcrypt');
const pool = require('./db');

async function crearUsuario() {
  const username = 'admin_user';
  const plainPassword = 'HelloWorld';

  try {
    const existe = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (existe.rows.length > 0) {
      console.log('⚠️ El usuario admin ya existe. No se creó otro.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await pool.query(
      'INSERT INTO usuarios (username, password, rol) VALUES ($1, $2, $3)',
      [username, hashedPassword, 'admin']
    );
    console.log('✅ Usuario admin creado correctamente.');
    process.exit();
  } catch (error) {
    console.error('❌ Error al crear el usuario:', error);
    process.exit(1);
  }
}

crearUsuario();
