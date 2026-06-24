// ============================================
// META PIXEL - CONFIGURACIÓN
// ============================================

// Reemplaza con tu Pixel ID
const PIXEL_ID = '2470164843459727';

// Cargar el Pixel de Meta
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

// Inicializar el Pixel
fbq('init', PIXEL_ID);
fbq('track', 'PageView');

// ============================================
// EVENTOS DE CONVERSIÓN
// ============================================

function trackAddToCart(product) {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'AddToCart', {
            content_name: product.name,
            content_ids: [product.id],
            content_type: 'product',
            value: product.price,
            currency: 'MXN'
        });
        console.log('📊 Meta Pixel: AddToCart -', product.name);
    }
}

function trackInitiateCheckout(total, items) {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'InitiateCheckout', {
            value: total,
            currency: 'MXN',
            num_items: items.length
        });
        console.log('📊 Meta Pixel: InitiateCheckout');
    }
}

function trackPurchase(orderData) {
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Purchase', {
            value: orderData.total,
            currency: 'MXN',
            content_ids: orderData.items.map(item => item.id),
            content_type: 'product',
            num_items: orderData.items.length
        });
        console.log('📊 Meta Pixel: Purchase - Orden #' + orderData.id);
    }
}

console.log('✅ Meta Pixel cargado correctamente');