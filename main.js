// ============================================
// PRODUCTOS - PRECIOS REALES
// ============================================

const products = [
    { id: 1, name: "RoyceDerm Face Cream", price: 78000, image: "/Medios/Imagenes/royce.jpeg", color: "Silber", subtitle: "Tratamiento para Seborrheic Dermatitis", description: "Alivio calmante para enrojecimiento, descamación y placas. Fórmula avanzada para el cuidado de la piel sensible." },
    { id: 2, name: "Biotin Hair Serum", price: 72000, image: "/Medios/Imagenes/biotinrohs.jpeg", color: "Schwarz", subtitle: "Fortalecimiento y Crecimiento Capilar", description: "Fórmula con Biotina y Romero para fortalecer el cabello, estimular el crecimiento y prevenir la caída." },
    { id: 3, name: "Ranko Moisturizing Cream", price: 72000, image: "/Medios/Imagenes/rankomc.jpeg", color: "Gold", subtitle: "Hidratación Profunda", description: "Crema humectante de alta eficacia para una hidratación duradera. Ideal para pieles secas y sensibles." },
];

// ============================================
// DATOS DE PACKS CON PRECIOS REALES
// ============================================

const packsData = [
    {
        id: 1,
        name: "RoyceDerm",
        subtitle: "Face Cream",
        image: "/Medios/Imagenes/royce.jpeg",
        packs: [
            {
                name: "Tratamiento Básico",
                units: 1,
                price: 78000,
                description: "Prueba el producto",
                savings: 0,
                savingsPercent: 30,
                freeShipping: true,
                level: "basico"
            },
            {
                name: "Pack Dúo",
                units: 2,
                price: 110000,
                description: "Con este combo completas el tratamiento",
                savings: 46000,
                savingsPercent: 42,
                freeShipping: true,
                level: "duo"
            }
        ],
        family: {
            name: "Pack Familiar",
            price: 139000,
            description: "Con este combo alcanzas mejores resultados",
            savings: 95000,
            savingsPercent: 60,
            freeShipping: true
        }
    },
    {
        id: 2,
        name: "Biotin",
        subtitle: "Hair Serum",
        image: "/Medios/Imagenes/biotinrohs.jpeg",
        packs: [
            {
                name: "Tratamiento Básico",
                units: 1,
                price: 72000,
                description: "Prueba el producto",
                savings: 0,
                savingsPercent: 30,
                freeShipping: true,
                level: "basico"
            },
            {
                name: "Pack Dúo",
                units: 2,
                price: 105000,
                description: "Con este combo completas el tratamiento",
                savings: 39000,
                savingsPercent: 27,
                freeShipping: true,
                level: "duo"
            }
        ],
        family: {
            name: "Pack Familiar",
            price: 129000,
            description: "Con este combo alcanzas mejores resultados",
            savings: 87000,
            savingsPercent: 40,
            freeShipping: true
        }
    },
    {
        id: 3,
        name: "Ranko",
        subtitle: "Moisturizing Cream",
        image: "/Medios/Imagenes/rankomc.jpeg",
        packs: [
            {
                name: "Tratamiento Básico",
                units: 1,
                price: 72000,
                description: "Prueba el producto",
                savings: 0,
                savingsPercent: 30,
                freeShipping: true,
                level: "basico"
            },
            {
                name: "Pack Dúo",
                units: 2,
                price: 105000,
                description: "Con este combo completas el tratamiento",
                savings: 39000,
                savingsPercent: 27,
                freeShipping: true,
                level: "duo"
            }
        ],
        family: {
            name: "Pack Familiar",
            price: 129000,
            description: "Con este combo alcanzas mejores resultados",
            savings: 87000,
            savingsPercent: 40,
            freeShipping: true
        }
    }
];

let cart = [];

// ============================================
// VARIABLES PARA EL MODAL DE CONFIRMACIÓN
// ============================================

let pendingProductId = null;
let pendingPackIndex = null;
let pendingIsFamily = false;
let pendingPackName = '';

// ============================================
// OBTENER LINK DEL PRODUCTO
// ============================================

function getProductLink(productId) {
    const links = {
        1: "roycederm.html",
        2: "biotin.html",
        3: "ranko.html"
    };
    return links[productId] || "#";
}

function getProductName(productId) {
    const names = {
        1: "RoyceDerm",
        2: "Biotin",
        3: "Ranko"
    };
    return names[productId] || "";
}

// ============================================
// MODAL DE CONFIRMACIÓN PARA AGREGAR OTRO PACK
// ============================================

function openConfirmModal(productName, packName, productId, packIndex, isFamily = false) {
    const modal = document.getElementById('confirmModal');
    const messageEl = document.getElementById('confirmMessage');

    if (!modal) return;

    if (messageEl) {
        messageEl.innerHTML = `Ya tienes un pack de <strong>${productName}</strong> en tu carrito. ¿Quieres agregar también <strong>${packName}</strong>?`;
    }

    pendingProductId = productId;
    pendingPackIndex = packIndex;
    pendingIsFamily = isFamily;
    pendingPackName = packName;

    modal.style.display = 'block';
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'none';
    pendingProductId = null;
    pendingPackIndex = null;
    pendingIsFamily = false;
    pendingPackName = '';
}

function addPackWithConfirm(productId, packIndex, packName) {
    const product = packsData.find(p => p.id === productId);
    if (!product) return;

    let newItemId;
    if (packIndex !== undefined && packIndex !== null) {
        newItemId = `${productId}-${packIndex}`;
    } else {
        newItemId = `${productId}-family`;
    }

    const existingItem = cart.find(item => item.id === newItemId);

    if (existingItem) {
        showToast(`Ya tienes ${packName} en tu carrito. Se ha aumentado la cantidad.`);
        if (packIndex !== undefined && packIndex !== null) {
            addPackToCart(productId, packIndex);
        } else {
            addFamilyToCart(productId);
        }
        return;
    }

    const hasOtherPacks = cart.some(item => {
        return (item.id.startsWith(`${productId}-`) || item.id === `${productId}`) && item.id !== newItemId;
    });

    let newPackFullName = packName;
    if (packIndex !== undefined && packIndex !== null) {
        const pack = product.packs[packIndex];
        if (pack) newPackFullName = `${product.name} - ${pack.name}`;
    } else {
        newPackFullName = `${product.name} - ${product.family.name}`;
    }

    if (hasOtherPacks) {
        openConfirmModal(product.name, newPackFullName, productId, packIndex, packIndex === null);
    } else {
        if (packIndex !== undefined && packIndex !== null) {
            addPackToCart(productId, packIndex);
        } else {
            addFamilyToCart(productId);
        }
    }
}

// ============================================
// RENDER PRODUCTOS (INDEX)
// ============================================

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="location.href='${getProductLink(product.id)}'">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
            </div>
        </div>
    `).join('');
}

// ============================================
// RENDER PRODUCTO DETALLE (PÁGINA INDIVIDUAL)
// ============================================

function renderProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const descuentoFicticio = 0.30;
    const precioOriginalFicticio = Math.round(product.price / (1 - descuentoFicticio));

    const imageEl = document.querySelector('.product-detail-image img');
    const titleEl = document.querySelector('.product-detail-info h1');
    const subtitleEl = document.querySelector('.product-detail-subtitle');
    const descEl = document.querySelector('.product-detail-description');
    const originalPriceEl = document.querySelector('.price-original');
    const currentPriceEl = document.querySelector('.price-current');
    const addBtn = document.querySelector('.btn-add-to-cart');

    if (imageEl) {
        imageEl.src = product.image;
        imageEl.alt = product.name;
    }
    if (titleEl) titleEl.textContent = product.name;
    if (subtitleEl) subtitleEl.textContent = product.subtitle || '';
    if (descEl) descEl.textContent = product.description || '';
    if (originalPriceEl) originalPriceEl.textContent = `$${precioOriginalFicticio.toLocaleString()}`;
    if (currentPriceEl) currentPriceEl.textContent = `$${product.price.toLocaleString()}`;
    if (addBtn) addBtn.onclick = () => addToCart(product.id);

    renderProductPacks(productId);
    renderProductVideo(productId);
}

function renderProductPacks(productId) {
    const gridId = `packsGrid${getProductName(productId)}`;
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const productData = packsData.find(p => p.id === productId);
    if (!productData) return;

    grid.innerHTML = `
        <div class="pack-card">
            <div class="pack-card-header" style="background-image: url('${productData.image}'); background-size: cover; background-position: center; background-color: #f5f5f5;">
                <div class="pack-card-header-overlay">
                    <h3>${productData.name}</h3>
                    <span class="pack-subtitle">${productData.subtitle}</span>
                </div>
            </div>
            <div class="pack-options">
                ${productData.packs.map((pack, index) => `
                    <div class="pack-option ${pack.level}" onclick="addPackWithConfirm(${productData.id}, ${index}, '${pack.name}')">
                        <div class="pack-name-row">
                            <span class="pack-name">${pack.name}</span>
                            <span class="pack-units">(${pack.units} Unidad${pack.units > 1 ? 'es' : ''})</span>
                        </div>
                        <div class="pack-price-row">
                            <span class="pack-price">$${pack.price.toLocaleString()}</span>
                            <span class="pack-description">${pack.description}</span>
                        </div>
                        ${pack.freeShipping ? `<div class="pack-shipping-badge">🚚 Envío gratis incluido</div>` : ''}
                        ${pack.savings > 0 ? `
                            <div class="pack-savings">
                                <span class="savings-label">🟢 AHORRAS</span>
                                <span class="savings-amount">$${pack.savings.toLocaleString()}</span>
                                <span class="savings-percent">${pack.savingsPercent}% dto.</span>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                <div class="pack-family" onclick="addPackWithConfirm(${productData.id}, null, '${productData.family.name}')">
                    <span class="family-tag">⭐ RECOMENDADO</span>
                    <div class="family-badge">🎯 MEJOR OPCIÓN</div>
                    <div class="family-name">${productData.family.name}</div>
                    <div class="family-price">$${productData.family.price.toLocaleString()}</div>
                    <div class="family-desc">${productData.family.description}</div>
                    <div class="family-shipping-badge">🚚 Envío gratis incluido</div>
                    <div class="family-savings">
                        <span class="savings-amount">AHORRAS $${productData.family.savings.toLocaleString()}</span>
                        <span class="savings-percent">${productData.family.savingsPercent}% dto.</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// RENDER VIDEO INFORMATIVO DEL PRODUCTO
// ============================================

function renderProductVideo(productId) {
    const videoContainer = document.getElementById('productVideoContainer');
    if (!videoContainer) return;
    videoContainer.style.display = 'none';
    videoContainer.innerHTML = `
        <div style="text-align:center;padding:40px;color:#999;">
            <p>🎬 Contenido en preparación</p>
        </div>
    `;
}

// ============================================
// RENDER PACKS (INDEX)
// ============================================

function renderPacks() {
    const grid = document.getElementById('packsGrid');
    if (!grid) return;

    grid.innerHTML = packsData.map(product => `
        <div class="pack-card">
            <div class="pack-card-header" style="background-image: url('${product.image}'); background-size: cover; background-position: center; background-color: #f5f5f5;">
                <div class="pack-card-header-overlay">
                    <h3>${product.name}</h3>
                    <span class="pack-subtitle">${product.subtitle}</span>
                </div>
            </div>
            <div class="pack-options">
                ${product.packs.map((pack, index) => `
                    <div class="pack-option ${pack.level}" onclick="addPackWithConfirm(${product.id}, ${index}, '${pack.name}')">
                        <div class="pack-name-row">
                            <span class="pack-name">${pack.name}</span>
                            <span class="pack-units">(${pack.units} Unidad${pack.units > 1 ? 'es' : ''})</span>
                        </div>
                        <div class="pack-price-row">
                            <span class="pack-price">$${pack.price.toLocaleString()}</span>
                            <span class="pack-description">${pack.description}</span>
                        </div>
                        ${pack.freeShipping ? `<div class="pack-shipping-badge">🚚 Envío gratis incluido</div>` : ''}
                        ${pack.savings > 0 ? `
                            <div class="pack-savings">
                                <span class="savings-label">🟢 AHORRAS</span>
                                <span class="savings-amount">$${pack.savings.toLocaleString()}</span>
                                <span class="savings-percent">${pack.savingsPercent}% dto.</span>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
                <div class="pack-family" onclick="addPackWithConfirm(${product.id}, null, '${product.family.name}')">
                    <span class="family-tag">⭐ RECOMENDADO</span>
                    <div class="family-badge">🎯 MEJOR OPCIÓN</div>
                    <div class="family-name">${product.family.name}</div>
                    <div class="family-price">$${product.family.price.toLocaleString()}</div>
                    <div class="family-desc">${product.family.description}</div>
                    <div class="family-shipping-badge">🚚 Envío gratis incluido</div>
                    <div class="family-savings">
                        <span class="savings-amount">AHORRAS $${product.family.savings.toLocaleString()}</span>
                        <span class="savings-percent">${product.family.savingsPercent}% dto.</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// FUNCIONES PARA PACKS
// ============================================

function addPackToCart(productId, packIndex) {
    const product = packsData.find(p => p.id === productId);
    if (!product) return;

    const pack = product.packs[packIndex];
    if (!pack) return;

    const productName = `${product.name} - ${pack.name}`;
    const itemId = `${productId}-${packIndex}`;
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: itemId,
            name: productName,
            price: pack.price,
            quantity: 1,
            image: product.image,
            description: pack.description
        });
    }

    saveCart();
    updateCartDisplay();
    renderCartSidebar();
    openCartModal();
}

function addFamilyToCart(productId) {
    const product = packsData.find(p => p.id === productId);
    if (!product) return;

    const pack = product.family;
    const productName = `${product.name} - ${pack.name}`;
    const itemId = `${productId}-family`;
    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: itemId,
            name: productName,
            price: pack.price,
            quantity: 1,
            image: product.image,
            description: pack.description
        });
    }

    saveCart();
    updateCartDisplay();
    renderCartSidebar();
    openCartModal();
}

function addAllPacks(productId) {
    const product = packsData.find(p => p.id === productId);
    if (!product) return;

    product.packs.forEach((pack, index) => {
        const productName = `${product.name} - ${pack.name}`;
        const itemId = `${productId}-${index}`;
        const existingItem = cart.find(item => item.id === itemId);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                id: itemId,
                name: productName,
                price: pack.price,
                quantity: 1,
                image: product.image,
                description: pack.description
            });
        }
    });

    const familyPack = product.family;
    const familyName = `${product.name} - ${familyPack.name}`;
    const itemId = `${productId}-family`;
    const existingFamily = cart.find(item => item.id === itemId);

    if (existingFamily) {
        existingFamily.quantity = (existingFamily.quantity || 1) + 1;
    } else {
        cart.push({
            id: itemId,
            name: familyName,
            price: familyPack.price,
            quantity: 1,
            image: product.image,
            description: familyPack.description
        });
    }

    saveCart();
    updateCartDisplay();
    renderCartSidebar();
    openCartModal();
}

// ============================================
// CARRITO - FUNCIONES PRINCIPALES
// ============================================

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            color: product.color
        });
    }

    // ✅ Evento de Meta Pixel - Purchase (con nombres de productos)
    if (typeof fbq !== 'undefined') {
        // Crear un array con los nombres de los productos
        const productNames = items.map(item => item.nombre).join(', ');

        fbq('track', 'Purchase', {
            value: total,
            currency: 'COP',
            content_ids: items.map(item => item.id),
            content_name: productNames,  // ✅ Nombres de los productos
            content_type: 'product',
            num_items: items.length,
            contents: items.map(item => ({
                id: item.id,
                quantity: item.cantidad,
                item_price: item.precio,
                product_name: item.nombre
            }))
        });
        console.log('📊 Meta Pixel: Purchase -', productNames);
    }

    saveCart();
    updateCartDisplay();
    renderCartSidebar();
    openCartModal();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => String(i.id) === String(productId));
    if (item) {
        item.quantity = (item.quantity || 1) + change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => String(i.id) !== String(productId));
        }
        saveCart();
        updateCartDisplay();
        renderCartSidebar();
        renderCartModalItems();
    }
}

function removeItem(productId) {
    cart = cart.filter(i => String(i.id) !== String(productId));
    saveCart();
    updateCartDisplay();
    renderCartSidebar();
    renderCartModalItems();
}

function saveCart() {
    localStorage.setItem('ouraCart', JSON.stringify(cart));
    updateCartCount();
}

function loadCart() {
    const saved = localStorage.getItem('ouraCart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
    updateCartDisplay();
    renderCartSidebar();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const el = document.getElementById('cartCount');
    if (el) el.textContent = count;
}

function updateCartDisplay() {
    updateCartCount();
}

// ============================================
// CARRITO SIDEBAR
// ============================================

function renderCartSidebar() {
    const sidebarContent = document.getElementById('cartSidebarContent');
    if (!sidebarContent) return;

    if (cart.length === 0) {
        sidebarContent.innerHTML = `<div class="empty-cart"><p>🛒 Su carrito de compras esta vacio</p></div>`;
        return;
    }

    const subtotalReal = cart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
    let descuentoTotal = 0;

    cart.forEach(item => {
        let packDescuento = 0;
        for (const product of packsData) {
            const packIndex = product.packs.findIndex((p, index) => `${product.id}-${index}` === item.id);
            if (packIndex !== -1) {
                packDescuento = product.packs[packIndex].savingsPercent || 0;
                break;
            }
            if (`${product.id}-family` === item.id) {
                packDescuento = product.family.savingsPercent || 0;
                break;
            }
        }
        const itemTotal = item.price * (item.quantity || 1);
        const descuentoItem = itemTotal * (packDescuento / 100);
        descuentoTotal += descuentoItem;
    });

    const descuentoPorcentajeTotal = subtotalReal > 0 ? Math.round((descuentoTotal / subtotalReal) * 100) : 0;

    sidebarContent.innerHTML = `
        <div class="cart-items-list">
            ${cart.map(item => {
        const precioReal = item.price * (item.quantity || 1);
        let packDescuento = 0;
        for (const product of packsData) {
            const packIndex = product.packs.findIndex((p, index) => `${product.id}-${index}` === item.id);
            if (packIndex !== -1) {
                packDescuento = product.packs[packIndex].savingsPercent || 0;
                break;
            }
            if (`${product.id}-family` === item.id) {
                packDescuento = product.family.savingsPercent || 0;
                break;
            }
        }
        const precioOriginalFicticio = packDescuento > 0 ? Math.round(precioReal / (1 - (packDescuento / 100))) : precioReal;
        return `
                <div class="cart-sidebar-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">
                            ${packDescuento > 0 ? `
                                <span style="text-decoration: line-through; color: #999; font-size: 0.8rem; margin-right: 8px;">$${precioOriginalFicticio.toLocaleString()}</span>
                            ` : ''}
                            <span style="color: #00B894; font-weight: 700; font-size: 1rem;">$${precioReal.toLocaleString()}</span>
                            ${packDescuento > 0 ? `<span style="color: #ff4444; font-size: 0.6rem; margin-left: 4px;">-${packDescuento}%</span>` : ''}
                        </div>
                        <div class="cart-item-quantity">
                            <button onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity || 1}</span>
                            <button onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-item" onclick="removeItem('${item.id}')">✕</button>
                </div>
            `}).join('')}
        </div>
        <div class="cart-sidebar-summary">
            <div class="summary-row">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value">$${subtotalReal.toLocaleString()}</span>
            </div>
            <div class="summary-row discount">
                <span class="summary-label">Descuento</span>
                <span class="summary-value">-$${Math.round(descuentoTotal).toLocaleString()} (${descuentoPorcentajeTotal}%)</span>
            </div>
            <div class="summary-row shipping">
                <span class="summary-label">Envío</span>
                <span class="summary-value">Gratis</span>
            </div>
            <div class="summary-row total">
                <span class="summary-label">Total</span>
                <span class="summary-value">$${subtotalReal.toLocaleString()}</span>
            </div>
        </div>
        <div class="cart-sidebar-footer">
            <button class="btn-dark" onclick="openCheckout()">Pedir</button>
        </div>
    `;
}

// ============================================
// CART MODAL EMERGENTE
// ============================================

function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    renderCartModalItems();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function renderCartModalItems() {
    const container = document.getElementById('cartModalItems');
    const subtotalEl = document.getElementById('modalSubtotal');
    const descuentoEl = document.getElementById('modalDescuento');
    const totalEl = document.getElementById('modalTotal');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;font-size:1.1rem;">🛒 Tu carrito está vacío</p>';
        if (subtotalEl) subtotalEl.textContent = '$0';
        if (descuentoEl) descuentoEl.textContent = '$0';
        if (totalEl) totalEl.textContent = '$0';
        return;
    }

    const subtotalReal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    let descuentoTotal = 0;

    cart.forEach(item => {
        let packDescuento = 0;
        for (const product of packsData) {
            const packIndex = product.packs.findIndex((p, index) => `${product.id}-${index}` === item.id);
            if (packIndex !== -1) {
                packDescuento = product.packs[packIndex].savingsPercent || 0;
                break;
            }
            if (`${product.id}-family` === item.id) {
                packDescuento = product.family.savingsPercent || 0;
                break;
            }
        }
        if (packDescuento === 0) {
            const product = products.find(p => p.id === parseInt(item.id));
            if (product) {
                const productData = packsData.find(p => p.id === product.id);
                if (productData && productData.packs.length > 0) {
                    packDescuento = productData.packs[0].savingsPercent || 0;
                }
            }
        }
        const itemTotal = item.price * (item.quantity || 1);
        const descuentoItem = itemTotal * (packDescuento / 100);
        descuentoTotal += descuentoItem;
        item._descuentoPorcentaje = packDescuento;
    });

    const descuentoPorcentajeTotal = subtotalReal > 0 ? Math.round((descuentoTotal / subtotalReal) * 100) : 0;

    container.innerHTML = cart.map(item => {
        const precioReal = item.price * (item.quantity || 1);
        const descuentoItem = item._descuentoPorcentaje || 0;
        const precioOriginalFicticio = Math.round(precioReal / (1 - (descuentoItem / 100)));
        return `
        <div class="cart-modal-item">
            <div class="cart-modal-item-info">
                <div class="cart-modal-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-modal-item-details">
                    <div class="cart-modal-item-name">
                        ${item.name}
                        <span class="cart-modal-item-discount-badge">-${descuentoItem}%</span>
                    </div>
                    <div class="cart-modal-item-quantity">
                        <button onclick="updateModalQuantity('${item.id}', -1)">−</button>
                        <span id="modal-qty-${item.id}">${item.quantity || 1}</span>
                        <button onclick="updateModalQuantity('${item.id}', 1)">+</button>
                        <button class="remove-btn" onclick="removeModalItem('${item.id}')">✕</button>
                    </div>
                </div>
            </div>
            <div class="cart-modal-item-price-wrapper">
                <div class="cart-modal-item-original-price">$${precioOriginalFicticio.toLocaleString()}</div>
                <div class="cart-modal-item-price">$${precioReal.toLocaleString()}</div>
            </div>
        </div>
    `}).join('');

    const summaryHTML = `
        <div class="cart-modal-summary">
            <div class="summary-row">
                <span class="summary-label">Subtotal</span>
                <span class="summary-value" id="modalSubtotal">$${subtotalReal.toLocaleString()}</span>
            </div>
            <div class="summary-row discount">
                <span class="summary-label">Descuento</span>
                <span class="summary-value" id="modalDescuento">-$${Math.round(descuentoTotal).toLocaleString()} (${descuentoPorcentajeTotal}%)</span>
            </div>
            <div class="summary-row shipping">
                <span class="summary-label">Envío</span>
                <span class="summary-value">Gratis</span>
            </div>
            <div class="summary-row total">
                <span class="summary-label">Total</span>
                <span class="summary-value" id="modalTotal">$${subtotalReal.toLocaleString()}</span>
            </div>
        </div>
    `;

    const existingSummary = document.querySelector('.cart-modal-summary');
    if (existingSummary) {
        existingSummary.outerHTML = summaryHTML;
    } else {
        container.insertAdjacentHTML('afterend', summaryHTML);
    }
}

function updateModalQuantity(productId, change) {
    const item = cart.find(i => String(i.id) === String(productId));
    if (item) {
        item.quantity = (item.quantity || 1) + change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => String(i.id) !== String(productId));
        }
        saveCart();
        updateCartDisplay();
        renderCartSidebar();
        renderCartModalItems();
    }
}

function removeModalItem(productId) {
    cart = cart.filter(i => String(i.id) !== String(productId));
    saveCart();
    updateCartDisplay();
    renderCartSidebar();
    renderCartModalItems();
}

// ============================================
// CHECKOUT
// ============================================

function openCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
}

function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

function openCheckout() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío');
        return;
    }
    closeCart();
    openCartModal();

    // ✅ Evento de Meta Pixel - InitiateCheckout
    if (typeof fbq !== 'undefined') {
        const total = cart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
        fbq('track', 'InitiateCheckout', {
            value: total,
            currency: 'COP',
            num_items: cart.length
        });
    }
}

function closeModals() {
    const checkout = document.getElementById('checkoutModal');
    const success = document.getElementById('successModal');
    if (checkout) checkout.style.display = 'none';
    if (success) success.style.display = 'none';
}

// ============================================
// SUBMIT PEDIDOS
// ============================================

async function submitOrder(e) {
    e.preventDefault();
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;

    if (!name) {
        showToast('Por favor completa nombre');
        return;
    }

    const orderData = {
        items: cart.map(i => ({ id: i.id, nombre: i.name, precio: i.price, cantidad: i.quantity || 1 })),
        cliente: { nombre: name, email: email, telefono: phone, direccion: address },
        total: cart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0)
    };

    try {
        const res = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const result = await res.json();
        if (res.ok && result.exito) {
            // ✅ Evento de Meta Pixel - Purchase (compra completada)
            if (typeof fbq !== 'undefined') {
                const items = cart.map(i => ({
                    id: i.id,
                    nombre: i.name,
                    precio: i.price,
                    cantidad: i.quantity || 1
                }));
                const productNames = items.map(item => item.nombre).join(', ');

                fbq('track', 'Purchase', {
                    value: orderData.total,
                    currency: 'COP',
                    content_ids: items.map(item => item.id),
                    content_name: productNames,
                    content_type: 'product',
                    num_items: items.length,
                    contents: items.map(item => ({
                        id: item.id,
                        quantity: item.cantidad,
                        item_price: item.precio,
                        product_name: item.nombre
                    }))
                });
                console.log('📊 Meta Pixel: Purchase -', productNames);
            }

            cart = [];
            saveCart();
            updateCartDisplay();
            renderCartSidebar();
            closeModals();
            document.getElementById('successModal').style.display = 'block';
        } else {
            showToast('Error al procesar el pedido');
        }
    } catch (error) {
        showToast('Error de conexión');
    }
}

async function submitOrderModal(phone, name, email, address, city, neighborhood) {
    const fullName = name;
    const items = cart.map(item => ({
        id: item.id,
        nombre: item.name,
        precio: item.price,
        cantidad: item.quantity || 1
    }));
    const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const direccionCompleta = `${address}, ${neighborhood}, ${city}`;
    const orderData = {
        items: items,
        cliente: {
            nombre: fullName,
            email: email,
            telefono: phone,
            direccion: direccionCompleta,
            ciudad: city,
            barrio: neighborhood
        },
        total: total
    };

    try {
        const response = await fetch('/api/pedidos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const result = await response.json();
        if (response.ok && result.exito) {
            // ✅ Evento de Meta Pixel - Purchase
            if (typeof fbq !== 'undefined') {
                const productNames = items.map(item => item.nombre).join(', ');
                
                fbq('track', 'Purchase', {
                    value: total,
                    currency: 'COP',
                    content_ids: items.map(item => item.id),
                    content_name: productNames,
                    content_type: 'product',
                    num_items: items.length,
                    contents: items.map(item => ({
                        id: item.id,
                        quantity: item.cantidad,
                        item_price: item.precio,
                        product_name: item.nombre
                    }))
                });
                console.log('📊 Meta Pixel: Purchase -', productNames);
            }

            cart = [];
            saveCart();
            updateCartDisplay();
            renderCartSidebar();
            closeCartModal();
            document.getElementById('successModal').style.display = 'block';
        } else {
            showToast('Error al procesar el pedido');
        }
    } catch (error) {
        showToast('Error de conexión');
    }
}

// ============================================
// TOAST
// ============================================

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

// ============================================
// EVENTOS DEL MODAL DE CONFIRMACIÓN Y DOM
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // ============================================
    // MODAL DE CONFIRMACIÓN
    // ============================================

    const cancelBtn = document.getElementById('cancelConfirmBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeConfirmModal);
    }

    const acceptBtn = document.getElementById('acceptConfirmBtn');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            if (pendingProductId !== null) {
                if (pendingPackIndex !== undefined && pendingPackIndex !== null) {
                    addPackToCart(pendingProductId, pendingPackIndex);
                } else if (pendingIsFamily) {
                    addFamilyToCart(pendingProductId);
                }

                saveCart();
                updateCartDisplay();
                renderCartSidebar();
                renderCartModalItems();
            }
            closeConfirmModal();
        });
    }

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function (e) {
        const modal = document.getElementById('confirmModal');
        if (e.target === modal) {
            closeConfirmModal();
        }
    });

    // ============================================
    // INICIALIZACIÓN DE LA PÁGINA
    // ============================================

    renderProducts();
    renderPacks();
    loadCart();

    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) cartBtn.onclick = openCart;

    const closeCartBtn = document.getElementById('closeCartBtn');
    if (closeCartBtn) closeCartBtn.onclick = closeCart;

    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) cartOverlay.onclick = closeCart;

    document.querySelectorAll('.close-checkout, .close-success').forEach(btn => {
        btn.onclick = closeModals;
    });

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) checkoutForm.onsubmit = submitOrder;

    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    if (closeSuccessBtn) {
        closeSuccessBtn.onclick = () => {
            document.getElementById('successModal').style.display = 'none';
        };
    }

    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModals();
        if (e.target.classList.contains('cart-modal')) closeCartModal();
    };

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
                showToast('Error al enviar el mensaje');
            }
        });
    }

    const closeModalBtn = document.getElementById('closeCartModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCartModal);
    }

    const modalForm = document.getElementById('modalCheckoutForm');
    if (modalForm) {
        modalForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const phone = document.getElementById('modalPhone').value;
            const name = document.getElementById('modalName').value;
            const email = document.getElementById('modalEmail').value;
            const address = document.getElementById('modalAddress').value;
            const city = document.getElementById('modalCity').value;
            const neighborhood = document.getElementById('modalNeighborhood').value;

            if (!phone || !name || !address || !city || !neighborhood) {
                showToast('Por favor completa todos los campos');
                return;
            }

            await submitOrderModal(phone, name, email, address, city, neighborhood);
        });
    }

    const continueBtn = document.querySelector('.continue-shopping');
    if (continueBtn) {
        continueBtn.addEventListener('click', closeCart);
    }
});