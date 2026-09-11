const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Servir tu página web principal (index.html)
app.use(express.static('.'));

// Configuración para el envío de correos por Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});
// Ruta que procesa el formulario de contacto
app.post('/api/contacto', async (req, res) => {
  const { nombre, empresa, servicio, whatsapp, detalles } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'daismeljesusr@gmail.com',
    subject: `Nuevo Cliente: ${nombre} - ${servicio}`,
    html: `
      <h3>Nuevo mensaje desde el formulario de contacto</h3>
      <p><strong>Nombre:</strong> ${nombre}</p>
      <p><strong>Empresa:</strong> ${empresa}</p>
      <p><strong>Servicio:</strong> ${servicio}</p>
      <p><strong>WhatsApp:</strong> ${whatsapp}</p>
      <p><strong>Detalles:</strong> ${detalles}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, mensaje: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error detallado de Nodemailer:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});