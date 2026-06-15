const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('=== TEST DE EMAIL ===');
console.log('Usuario:', process.env.SMTP_USER);
console.log('Host:', process.env.SMTP_HOST);
console.log('Puerto:', process.env.SMTP_PORT);
console.log('=====================\n');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function test() {
    try {
        // Verificar conexión
        await transporter.verify();
        console.log('✅ Conexión SMTP exitosa!');
        
        // Enviar email de prueba
        await transporter.sendMail({
            from: `"Test Oura" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: 'Test de configuración',
            text: 'Si recibes esto, el email funciona correctamente!'
        });
        console.log('✅ Email enviado correctamente!');
        
    } catch (error) {
        console.log('❌ ERROR:', error.message);
        console.log('\nPosibles soluciones:');
        if (error.message.includes('535')) {
            console.log('1. Verificación en dos pasos NO está activada');
            console.log('2. Contraseña de aplicación incorrecta');
            console.log('3. Ve a: https://myaccount.google.com/apppasswords');
        }
    }
}

test();