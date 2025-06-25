const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`);
});

// Listar materiales
app.get('/materiales', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM materiales')
    res.json(result.rows)
  } catch (error) {
    console.error('Error al obtener materiales:', error)
    res.status(500).json({ error: 'Error al obtener materiales' })
  }
})


// Agregar material
app.post('/materiales', async (req, res) => {
  const { nombre, codigo, cantidad, disponibilidad } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO materiales (nombre, codigo, cantidad, disponibilidad) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, codigo, cantidad, disponibilidad]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar material' });
  }
});

// Eliminar material
app.delete('/materiales/:codigo', async (req, res) => {
  const { codigo } = req.params
  try {
    await pool.query('DELETE FROM materiales WHERE codigo = $1', [codigo])
    res.json({ mensaje: 'Material eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar material:', error)
    res.status(500).json({ error: 'Error al eliminar material' })
  }
})

// Ruta para obtener materiales por tipo (mejorada)
app.get('/materiales/tipo/:tipo', async (req, res) => {
  const { tipo } = req.params;
  
  // Mapeo de tipos del frontend a patrones de búsqueda en la base de datos
  const tipoMap = {
    'electronico': ['proyector', 'cañón', 'bocina', 'pantalla'],
    'hardware': ['computadora', 'laptop', 'teclado', 'mouse'],
    'libros': ['libro', 'manual', 'guía'],
    'herramientas': ['herramienta', 'destornillador', 'martillo'],
    'cables': ['cable', 'extensión', 'adaptador']
  };

  try {
    if (!tipoMap[tipo]) {
      return res.status(400).json({ error: 'Tipo de material no válido' });
    }

    // Construir la consulta dinámica
    let query = 'SELECT * FROM materiales WHERE disponibilidad = $1 AND (';
    const params = ['Disponible'];
    
    tipoMap[tipo].forEach((keyword, index) => {
      if (index > 0) query += ' OR ';
      query += `LOWER(nombre) LIKE $${params.length + 1}`;
      params.push(`%${keyword}%`);
    });
    
    query += ') ORDER BY nombre';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener materiales por tipo:', error);
    res.status(500).json({ error: 'Error al obtener materiales' });
  }
});

// Buscar materiales
app.get('/materiales/buscar/:termino', async (req, res) => {
  const { termino } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM materiales WHERE disponibilidad = $1 AND (LOWER(nombre) LIKE $2 OR LOWER(codigo) LIKE $2) LIMIT 10',
      ['Disponible', `%${termino.toLowerCase()}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al buscar materiales:', error);
    res.status(500).json({ error: 'Error al buscar materiales' });
  }
});

// Crear préstamo
app.post('/prestamos', async (req, res) => {
  const { nombre_solicitante, grupo, tipo_material, fecha_solicitud, fecha_entrega, materiales } = req.body;
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Crear el préstamo principal
    const prestamoResult = await client.query(
      'INSERT INTO prestamos (nombre_solicitante, grupo, tipo_material, fecha_solicitud, fecha_entrega) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nombre_solicitante, grupo, tipo_material, fecha_solicitud, fecha_entrega]
    );
    
    const prestamoId = prestamoResult.rows[0].id;
    
    // Agregar los materiales del préstamo
    for (const material of materiales) {
      await client.query(
        'INSERT INTO prestamo_detalles (prestamo_id, material_id, cantidad_prestada) VALUES ($1, $2, $3)',
        [prestamoId, material.id, material.cantidad_prestada]
      );
      
      // Actualizar la cantidad disponible del material
      await client.query(
        'UPDATE materiales SET cantidad = cantidad - $1 WHERE id = $2',
        [material.cantidad_prestada, material.id]
      );
      
      // Actualizar disponibilidad si la cantidad llega a 0
      await client.query(
        'UPDATE materiales SET disponibilidad = CASE WHEN cantidad = 0 THEN $1 ELSE $2 END WHERE id = $3',
        ['Agotado', 'Disponible', material.id]
      );
    }
    
    await client.query('COMMIT');
    res.status(201).json({ message: 'Préstamo creado correctamente', prestamo_id: prestamoId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al crear préstamo:', error);
    res.status(500).json({ error: 'Error al crear préstamo' });
  } finally {
    client.release();
  }
});

// Listar préstamos
app.get('/prestamos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             COUNT(pd.id) as total_materiales,
             STRING_AGG(m.nombre, ', ') as materiales_nombres
      FROM prestamos p
      LEFT JOIN prestamo_detalles pd ON p.id = pd.prestamo_id
      LEFT JOIN materiales m ON pd.material_id = m.id
      GROUP BY p.id
      ORDER BY p.fecha_solicitud DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    res.status(500).json({ error: 'Error al obtener préstamos' });
  }
});