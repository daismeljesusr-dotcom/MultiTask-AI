const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const dns = require('dns');

// Forzar a Node.js a priorizar las direcciones IPv4 sobre IPv6
dns.setDefaultResultOrder('ipv4first');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración del transporte Nodemailer usando IPv4 explícito
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

// Ruta del formulario de contacto
app.post('/api/contacto', async (req, res) => {
  const { nombre, empresa, servicio, whatsapp, detalles } = req.body || {};

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'daismeljesusr@gmail.com',
    subject: `Nuevo Cliente: ${nombre || 'Sin nombre'} - ${servicio || 'Contacto'}`,
    html: `
      <h3>Nuevo mensaje desde el formulario de contacto</h3>
      <p><strong>Nombre:</strong> ${nombre || 'N/A'}</p>
      <p><strong>Empresa:</strong> ${empresa || 'N/A'}</p>
      <p><strong>Servicio:</strong> ${servicio || 'N/A'}</p>
      <p><strong>WhatsApp:</strong> ${whatsapp || 'N/A'}</p>
      <p><strong>Detalles:</strong> ${detalles || 'N/A'}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito');
    return res.status(200).json({ success: true, mensaje: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Manejo genérico para servir index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
});