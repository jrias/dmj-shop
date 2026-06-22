const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ✅ Importar Brevo correctamente
const brevo = require('@getbrevo/brevo');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(__dirname));
app.use('/Medios', express.static(path.join(__dirname, 'Medios')));
app.use('/medios', express.static(path.join(__dirname, 'Medios')));

// Productos
const productos = [
    { id: 1, nombre: "RoyceDerm Face cream", precio: 78000, imagen: "/Medios/Imagenes/royce.jpeg", color: "Silber" },
    { id: 2, nombre: "Biotin Hair Serum", precio: 72000, imagen: "/Medios/Imagenes/biotinrohs.jpeg", color: "Schwarz" },
    { id: 3, nombre: "Ranko Moisturizing Cream", precio: 72000, imagen: "/Medios/Imagenes/rankomc.jpeg", color: "Gold" },
];

app.get('/api/productos', (req, res) => {
    res.json(productos);
});

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
    console.log(`   Cliente: ${pedido.cliente.nombre} (${pedido.cliente.email || 'sin email'})`);
    console.log(`   Total: $${pedido.total.toFixed(2)} MXN`);
    console.log(`   Guardado en: pedidos.json\n`);
}

app.post('/api/pedidos', async (req, res) => {
    try {
        const { items, cliente, total } = req.body;

        if (!items || !items.length || !cliente || !cliente.nombre) {
            return res.status(400).json({ error: 'Faltan datos del pedido' });
        }

        const pedido = {
            id: Date.now(),
            items,
            cliente: {
                nombre: cliente.nombre,
                email: cliente.email || '',
                telefono: cliente.telefono || '',
                direccion: cliente.direccion || '',
                ciudad: cliente.ciudad || '',
                barrio: cliente.barrio || ''
            },
            total: total || items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0),
            estado: 'pendiente',
            fecha: new Date().toISOString()
        };

        guardarPedidoLocal(pedido);

        // ✅ Enviar email con la API de Brevo (CORRECTO)
        try {
            console.log('📧 Intentando enviar email con Brevo API...');
            
            // Crear instancia de la API
            const apiInstance = new brevo.TransactionalEmailsApi();
            
            // Configurar API Key
            apiInstance.setApiKey(brevo.TransactionalEmailsApi.ApiKeys.apiKey, process.env.BREVO_API_KEY);

            // Crear el contenido del email para el admin
            const adminEmail = new brevo.SendSmtpEmail();
            adminEmail.subject = `🛍️ Nuevo pedido #${pedido.id}`;
            adminEmail.sender = { name: "MCD Shop", email: "djmmar9@gmail.com" };
            adminEmail.to = [{ email: "djmmar9@gmail.com" }];
            adminEmail.htmlContent = `
                <h2>¡Nuevo pedido!</h2>
                <p><strong>Cliente:</strong> ${pedido.cliente.nombre}</p>
                <p><strong>Email:</strong> ${pedido.cliente.email || 'No proporcionado'}</p>
                <p><strong>Teléfono:</strong> ${pedido.cliente.telefono || 'N/A'}</p>
                <p><strong>Dirección:</strong> ${pedido.cliente.direccion || 'N/A'}</p>
                <h3>Productos:</h3>
                <ul>${items.map(item => `<li>${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)} MXN</li>`).join('')}</ul>
                <h3>Total: $${pedido.total.toFixed(2)} MXN</h3>
            `;

            // Enviar email al admin
            await apiInstance.sendTransacEmail(adminEmail);
            console.log('✅ Email al admin enviado');

            // Enviar email al cliente (si tiene email)
            if (pedido.cliente.email) {
                const customerEmail = new brevo.SendSmtpEmail();
                customerEmail.subject = `✅ Pedido #${pedido.id} recibido - MCD Shop`;
                customerEmail.sender = { name: "MCD Shop", email: "djmmar9@gmail.com" };
                customerEmail.to = [{ email: pedido.cliente.email }];
                customerEmail.htmlContent = `
                    <h2>¡Gracias ${pedido.cliente.nombre}!</h2>
                    <p>Hemos recibido tu pedido #${pedido.id} y lo procesaremos pronto.</p>
                    <h3>Resumen de tu compra:</h3>
                    <ul>${items.map(item => `<li>${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)} MXN</li>`).join('')}</ul>
                    <p><strong>Total: $${pedido.total.toFixed(2)} MXN</strong></p>
                    <p>¡Gracias por confiar en MCD Shop!</p>
                `;
                await apiInstance.sendTransacEmail(customerEmail);
                console.log('✅ Email al cliente enviado');
            }

        } catch (emailError) {
            console.log('❌ Error al enviar email:', emailError.message);
            if (emailError.response) {
                console.log('📝 Respuesta del servidor:', JSON.stringify(emailError.response.body, null, 2));
            }
            console.log('   El pedido se guardó pero no se envió el email.');
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

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n========================================`);
    console.log(`✅ Servidor funcionando en puerto ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`========================================\n`);
});