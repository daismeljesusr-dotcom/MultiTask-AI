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
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Ruta que procesa el formulario de contacto
app.post('/api/contacto', async (req, res) => {
    const { nombre, empresa, servicio, whatsapp, detalles } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'daismeljesusr@gmail.com', // Aquí recibirás los leads
        subject: `Nuevo Cliente: ${nombre} - ${servicio}`,
        html: `
            <h2>Nuevo Mensaje desde la Web</h2>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Empresa:</strong> ${empresa}</p>
            <p><strong>Servicio:</strong> ${servicio}</p>
            <p><strong>WhatsApp:</strong> ${whatsapp}</p>
            <p><strong>Detalles:</strong> ${detalles || 'Sin detalles'}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Enviado con éxito' });
    } catch (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en el puerto ${PORT}`);
});