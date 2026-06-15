// PRODUCTOS
const products = [
    { id: 1, name: "RoyceDerm Face cream", price: 329, image: "https://placehold.co/400x400/eeeeee/333333?text=RoyceDerm", color: "Silber" },
    { id: 2, name: "Sumvx Hair Serum", price: 329, image: "https://placehold.co/400x400/eeeeee/333333?text=Sumvx", color: "Schwarz" },
    { id: 3, name: "KL Ranko Cream", price: 349, image: "https://placehold.co/400x400/eeeeee/333333?text=KL+Ranko", color: "Gold" },
];

let cart = [];

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-color">${product.color}</p>
                <p class="product-price">$-${product.price}</p>
                <button onclick="addToCart(${product.id})">In den Warenkorb</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showToast(`${product.name} wurde hinzugefügt!`);
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        saveCart();
        updateCartUI();
    }
}

function removeItem(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('ouraCart', JSON.stringify(cart));
    updateCartCount();
}

function loadCart() {
    const saved = localStorage.getItem('ouraCart');
    if (saved) cart = JSON.parse(saved);
    updateCartUI();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function updateCartUI() {
    updateCartCount();
    
    const sidebarContent = document.getElementById('cartSidebarContent');
    if (!sidebarContent) return;
    
    if (cart.length === 0) {
        sidebarContent.innerHTML = `<div class="empty-cart"><p>🛒 Dein Warenkorb ist leer</p></div>`;
        return;
    }
    
    const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    
    sidebarContent.innerHTML = `
        <div class="cart-items-list">
            ${cart.map(item => `
                <div class="cart-sidebar-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">€${item.price}</div>
                        <div class="cart-item-quantity">
                            <button onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeItem(${item.id})">✕</button>
                </div>
            `).join('')}
        </div>
        <div class="cart-sidebar-footer">
            <div class="cart-total">
                <span>Gesamt</span>
                <span>€${total.toFixed(2)}</span>
            </div>
            <button class="btn-dark" onclick="openCheckout()">Zur Kasse</button>
        </div>
    `;
}

// Formulario de contacto
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        
        try {
            const response = await fetch('/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });
            
            if (response.ok) {
                contactForm.innerHTML = `
                    <div class="contact-success">
                        <div class="success-icon">✅</div>
                        <h3>¡Mensaje enviado!</h3>
                        <p>Gracias por contactarnos. Te responderemos pronto.</p>
                    </div>
                `;
            }
        } catch (error) {
            alert('Error al enviar el mensaje');
        }
    });
}

function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('active');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('active');
}

function openCheckout() {
    if (cart.length === 0) {
        showToast('Warenkorb ist leer!');
        return;
    }
    closeCart();
    const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    document.getElementById('orderSummary').innerHTML = `
        <h3>Bestellübersicht</h3>
        ${cart.map(i => `<p>${i.name} x${i.quantity} = €${(i.price * i.quantity).toFixed(2)}</p>`).join('')}
        <hr><p><strong>Gesamt: €${total.toFixed(2)}</strong></p>
    `;
    document.getElementById('checkoutModal').style.display = 'block';
}

function closeModals() {
    document.getElementById('checkoutModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'none';
}

async function submitOrder(e) {
    e.preventDefault();
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    
    if (!name || !email) {
        showToast('Bitte Name und Email angeben');
        return;
    }
    
    const orderData = {
        items: cart.map(i => ({ id: i.id, nombre: i.name, precio: i.price, cantidad: i.quantity })),
        cliente: { nombre: name, email: email, telefono: phone, direccion: address },
        total: cart.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    };
    
    try {
        const res = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const result = await res.json();
        if (res.ok && result.exito) {
            cart = [];
            saveCart();
            updateCartUI();
            closeModals();
            document.getElementById('successModal').style.display = 'block';
        } else {
            showToast('Fehler bei der Bestellung');
        }
    } catch (error) {
        showToast('Verbindungsfehler');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    loadCart();
    document.getElementById('cartBtn').onclick = openCart;
    document.getElementById('closeCartBtn').onclick = closeCart;
    document.getElementById('cartOverlay').onclick = closeCart;
    document.querySelectorAll('.close-checkout, .close-success').forEach(btn => {
        btn.onclick = closeModals;
    });
    document.getElementById('checkoutForm').onsubmit = submitOrder;
    document.getElementById('closeSuccessBtn').onclick = () => {
        document.getElementById('successModal').style.display = 'none';
    };
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModals();
    };
});