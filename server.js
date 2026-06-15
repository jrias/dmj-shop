const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(__dirname));
app.use('/medios', express.static(path.join(__dirname, 'medios')));

// Productos
const productos = [
    { id: 1, nombre: "Oura Ring Horizon - Silber", precio: 329, imagen: "/medios/Imagenes/model_hand.jpg", color: "Silber" },
    { id: 2, nombre: "Oura Ring Horizon - Schwarz", precio: 329, imagen: "/medios/Imagenes/ni.jpg", color: "Schwarz" },
    { id: 3, nombre: "Oura Ring Heritage - Gold", precio: 349, imagen: "/medios/Imagenes/Sk.jpg", color: "Gold" },
    { id: 4, nombre: "Oura Ring Heritage - Stealth", precio: 399, imagen: "/medios/Imagenes/royce.jpg", color: "Stealth" },
    { id: 5, nombre: "Oura Ring Gen3 - Roségold", precio: 379, imagen: "/medios/Imagenes/model_hand.jpg", color: "Roségold" },
    { id: 6, nombre: "Oura Lade-Station", precio: 59, imagen: "/medios/Imagenes/ni.jpg", color: "Weiß" }
];

// Endpoint: Listar productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// Guardar pedidos en archivo local
function guardarPedidoLocal(pedido) {
    const pedidosFile = path.join(__dirname, 'pedidos.json');
    let pedidos = [];
    
    if (fs.existsSync(pedidosFile)) {
        const data = fs.readFileSync(pedidosFile);
        pedidos = JSON.parse(data);
    }
    
    pedidos.push(pedido);
    fs.writeFileSync(pedidosFile, JSON.stringify(pedidos, null, 2));
    console.log(`\n📦 NUEVO PEDIDO #${pedido.id}`);
    console.log(`   Cliente: ${pedido.cliente.nombre} (${pedido.cliente.email})`);
    console.log(`   Total: €${pedido.total.toFixed(2)}`);
    console.log(`   Guardado en: pedidos.json\n`);
}

// Endpoint: Crear pedido
app.post('/api/pedidos', async (req, res) => {
    try {
        const { items, cliente, total } = req.body;

        if (!items || !items.length || !cliente || !cliente.email) {
            return res.status(400).json({ error: 'Faltan datos del pedido' });
        }

        const pedido = {
            id: Date.now(),
            items,
            cliente: {
                nombre: cliente.nombre,
                email: cliente.email,
                telefono: cliente.telefono || '',
                direccion: cliente.direccion || ''
            },
            total: total || items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
            estado: 'pendiente',
            fecha: new Date().toISOString()
        };

        // Guardar localmente
        guardarPedidoLocal(pedido);

        // Intentar enviar email (opcional)
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: parseInt(process.env.SMTP_PORT) || 587,
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                });

                const adminHtml = `
                    <h2>Neue Bestellung #${pedido.id}</h2>
                    <p><strong>Kunde:</strong> ${pedido.cliente.nombre}</p>
                    <p><strong>Email:</strong> ${pedido.cliente.email}</p>
                    <p><strong>Telefon:</strong> ${pedido.cliente.telefono || '-'}</p>
                    <h3>Produkte:</h3>
                    <ul>
                        ${items.map(item => `<li>${item.nombre} x${item.cantidad} = €${(item.precio * item.cantidad).toFixed(2)}</li>`).join('')}
                    </ul>
                    <h3>Total: €${pedido.total.toFixed(2)}</h3>
                `;

                await transporter.sendMail({
                    from: `"Oura Shop" <${process.env.SMTP_USER}>`,
                    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
                    subject: `Neue Bestellung #${pedido.id}`,
                    html: adminHtml
                });

                console.log('✅ Email enviado al admin');
            } catch (emailError) {
                console.log('⚠️ Email no enviado:', emailError.message);
            }
        }

        res.json({ 
            exito: true, 
            pedidoId: pedido.id, 
            mensaje: 'Pedido recibido. Te contactaremos pronto.'
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al procesar el pedido' });
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`✅ Servidor funcionando!`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`========================================\n`);
});