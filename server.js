const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();

// Middlewares para procesar JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde la raíz del proyecto y desde /public si existe
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración del transporte Nodemailer
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

// Ruta de prueba para verificar que el backend responda
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando correctamente' });
});

// Ruta que procesa el formulario de contacto
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
    console.log('Correo enviado exitosamente');
    return res.status(200).json({ success: true, mensaje: 'Correo enviado con éxito' });
  } catch (error) {
    console.error('Error detallado de envío:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Ruta genérica para servir el index.html principal
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado correctamente en el puerto ${PORT}`);
});