const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

// Transporte Nodemailer (Puerto 587 TLS)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Ruta de envío de formulario
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

// Ruta por defecto compatible con Express v5 (catch-all)
app.get('/(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});