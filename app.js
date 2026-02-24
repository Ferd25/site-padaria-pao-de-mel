// ============================================
// PRODUCT DATA
// ============================================
const products = [
    {
        id: 1,
        name: 'Pão Francês',
        description: 'Crocante por fora, macio por dentro. O tradicional pãozinho fresquinho de cada dia.',
        price: 1.00,
        unit: 'un',
        category: 'paes',
        image: 'images/pao_frances.png',
        badge: 'Mais Vendido'
    },
    {
        id: 2,
        name: 'Broa de Fubá',
        description: 'Receita tradicional mineira com fubá selecionado e um toque caseiro especial.',
        price: 29.00,
        unit: 'Kg',
        category: 'paes',
        image: 'images/broa_fuba.png',
        badge: ''
    },
    {
        id: 3,
        name: 'Bolo de Chocolate',
        description: 'Bolo retangular de chocolate com cobertura cremosa, cortado em pedaços generosos.',
        price: 3.00,
        unit: 'un',
        category: 'bolos',
        image: 'images/chocolate_cake.png',
        badge: 'Especial'
    },
    {
        id: 4,
        name: 'Rosquinhas de Creme',
        description: 'Rosquinhas douradas e macias com saborosa cobertura de creme.',
        price: 0.80,
        unit: 'un',
        category: 'doces',
        image: 'images/rosquinhas_creme.png',
        badge: 'Novidade'
    },
    {
        id: 5,
        name: 'Pão de Leite',
        description: 'Pãozinho fofinho e levemente adocicado, perfeito para o café da manhã.',
        price: 1.50,
        unit: 'un',
        category: 'paes',
        image: 'images/pao_de_leite.png',
        badge: ''
    },
    {
        id: 6,
        name: 'Broa com Gotas de Chocolate',
        description: 'A clássica broa de fubá com irresistíveis gotas de chocolate derretido.',
        price: 2.50,
        unit: 'un',
        category: 'doces',
        image: 'images/broa_chocolate.png',
        badge: 'Favorito'
    },
    {
        id: 7,
        name: 'Bolo de Cenoura',
        description: 'Bolo de cenoura fofinho com generosa cobertura de ganache de chocolate.',
        price: 3.00,
        unit: 'un',
        category: 'bolos',
        image: 'images/bolo_cenoura.png',
        badge: ''
    },
    {
        id: 8,
        name: 'Salgados Sortidos',
        description: 'Coxinha, empada e pastel assado de frango — os salgados mais pedidos da casa.',
        price: 6.00,
        unit: 'un',
        category: 'salgados',
        image: 'images/salgados_sortidos.png',
        badge: 'Novidade'
    },
    {
        id: 9,
        name: 'Pão de Knor',
        description: 'Pão macio e saboroso ideal para o café da tarde.',
        price: 1.50,
        unit: 'un',
        category: 'paes',
        image: 'images/pao_knor_mortadela.png',
        badge: ''
    }
];

// ============================================
// STATE
// ============================================
let cart = [];
let activeCategory = 'all';

// ============================================
// DOM ELEMENTS
// ============================================
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const mobileToggle = document.getElementById('mobileToggle');
const productsGrid = document.getElementById('productsGrid');
const categoryTabs = document.getElementById('categoryTabs');
const cartModal = document.getElementById('cartModal');
const cartBody = document.getElementById('cartBody');
const cartFooter = document.getElementById('cartFooter');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const floatingCart = document.getElementById('floatingCart');
const floatingCartCount = document.getElementById('floatingCartCount');

// ============================================
// NAVBAR SCROLL
// ============================================
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Show/hide floating cart after scrolling past hero
    if (currentScroll > 500) {
        floatingCart.classList.add('visible');
    } else {
        floatingCart.classList.remove('visible');
    }

    lastScroll = currentScroll;
});

// ============================================
// MOBILE MENU
// ============================================
mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ============================================
// RENDER PRODUCTS
// ============================================
function renderProducts(category = 'all') {
    const filtered = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    productsGrid.innerHTML = '';

    filtered.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.category = product.category;
        card.style.transitionDelay = `${index * 0.1}s`;

        card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <button class="product-favorite" aria-label="Favoritar ${product.name}">♡</button>
      </div>
      <div class="product-info">
        <div class="product-category-tag">${getCategoryLabel(product.category)}</div>
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')} <small>/${product.unit || 'un'}</small></div>
          <button class="btn-add-cart" data-id="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">
            + Adicionar
          </button>
        </div>
      </div>
    `;

        productsGrid.appendChild(card);

        // Trigger animation
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                card.classList.add('visible');
            });
        });
    });

    // Attach add-to-cart events
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Attach favorite events
    document.querySelectorAll('.product-favorite').forEach(btn => {
        btn.addEventListener('click', handleFavorite);
    });
}

function getCategoryLabel(cat) {
    const labels = {
        paes: 'Pães',
        doces: 'Doces',
        bolos: 'Bolos & Tortas',
        salgados: 'Salgados'
    };
    return labels[cat] || cat;
}

// ============================================
// CATEGORY TABS
// ============================================
categoryTabs.addEventListener('click', (e) => {
    if (!e.target.classList.contains('category-tab')) return;

    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    e.target.classList.add('active');

    activeCategory = e.target.dataset.category;
    renderProducts(activeCategory);
});

// ============================================
// CART LOGIC
// ============================================
function handleAddToCart(e) {
    const btn = e.currentTarget;
    const productId = parseInt(btn.dataset.id);
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const isKg = product.unit === 'Kg';
    const step = isKg ? 0.1 : 1;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty = parseFloat((existing.qty + step).toFixed(2));
    } else {
        cart.push({ ...product, qty: step });
    }

    // Button feedback
    btn.classList.add('added');
    btn.textContent = '✓ Adicionado';
    setTimeout(() => {
        btn.classList.remove('added');
        btn.textContent = '+ Adicionar';
    }, 1500);

    updateCartUI();
    showToast(`${product.name} adicionado ao carrinho!`);
}

function handleFavorite(e) {
    const btn = e.currentTarget;
    if (btn.textContent === '♡') {
        btn.textContent = '♥';
        btn.style.color = '#e74c3c';
    } else {
        btn.textContent = '♡';
        btn.style.color = '';
    }
}

function formatQtyDisplay(item) {
    if (item.unit === 'Kg') {
        const grams = Math.round(item.qty * 1000);
        return grams >= 1000 ? `${(grams / 1000).toFixed(1).replace('.', ',')}Kg` : `${grams}g`;
    }
    return item.qty;
}

function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => item.unit === 'Kg' ? sum + 1 : sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update count badges (navbar + floating)
    cartCountEl.textContent = totalItems;
    floatingCartCount.textContent = totalItems;
    cartCountEl.classList.remove('bump');
    floatingCartCount.classList.remove('bump');
    void cartCountEl.offsetWidth; // Force reflow
    cartCountEl.classList.add('bump');
    floatingCartCount.classList.add('bump');

    // Pulse effect when cart has items
    if (totalItems > 0) {
        floatingCart.classList.add('has-items');
    } else {
        floatingCart.classList.remove('has-items');
    }

    // Render cart items
    if (cart.length === 0) {
        cartBody.innerHTML = `
      <div class="cart-empty">
        <div class="empty-icon">🛒</div>
        <p>Seu carrinho está vazio</p>
      </div>
    `;
        cartFooter.style.display = 'none';
    } else {
        cartBody.innerHTML = cart.map(item => {
            const isKg = item.unit === 'Kg';
            const priceLabel = isKg ? `R$ ${item.price.toFixed(2).replace('.', ',')}/Kg` : `R$ ${item.price.toFixed(2).replace('.', ',')}`;
            const subtotal = (item.price * item.qty).toFixed(2).replace('.', ',');
            const qtyDisplay = formatQtyDisplay(item);
            return `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" />
        </div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${priceLabel}</p>
          ${isKg ? `<p class="cart-item-subtotal">Subtotal: R$ ${subtotal}</p>` : ''}
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" data-id="${item.id}" data-action="decrease">−</button>
          <span class="cart-item-qty ${isKg ? 'cart-item-weight' : ''}">${qtyDisplay}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="increase">+</button>
          <span class="cart-item-remove" data-id="${item.id}" title="Remover">🗑</span>
        </div>
      </div>
    `;
        }).join('');

        cartFooter.style.display = 'block';
        cartTotalEl.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

        // Minimum order validation (R$10)
        const minOrderEl = document.getElementById('minOrderWarning');
        if (totalPrice < 10) {
            checkoutBtn.disabled = true;
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.cursor = 'not-allowed';
            if (!minOrderEl) {
                const warning = document.createElement('p');
                warning.id = 'minOrderWarning';
                warning.style.cssText = 'color:#e74c3c;font-size:0.85rem;text-align:center;margin-top:12px;';
                warning.textContent = `Pedido mínimo de R$ 10,00. Faltam R$ ${(10 - totalPrice).toFixed(2).replace('.', ',')}`;
                cartFooter.appendChild(warning);
            } else {
                minOrderEl.textContent = `Pedido mínimo de R$ 10,00. Faltam R$ ${(10 - totalPrice).toFixed(2).replace('.', ',')}`;
            }
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.style.opacity = '1';
            checkoutBtn.style.cursor = 'pointer';
            if (minOrderEl) minOrderEl.remove();
        }

        // Attach qty events
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', handleQtyChange);
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', handleRemoveItem);
        });
    }
}

function handleQtyChange(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const action = e.currentTarget.dataset.action;
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const isKg = item.unit === 'Kg';
    const step = isKg ? 0.1 : 1;

    if (action === 'increase') {
        item.qty = parseFloat((item.qty + step).toFixed(2));
    } else {
        item.qty = parseFloat((item.qty - step).toFixed(2));
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }

    updateCartUI();
}

function handleRemoveItem(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

// ============================================
// MODAL
// ============================================
openCartBtn.addEventListener('click', () => {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

floatingCart.addEventListener('click', () => {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

closeCartBtn.addEventListener('click', closeModal);

cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) closeModal();
});

function closeModal() {
    cartModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ============================================
// CHECKOUT
// ============================================
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Enforce minimum order
    if (totalPrice < 10) {
        showToast('Pedido mínimo de R$ 10,00!');
        return;
    }

    // Build WhatsApp message
    let message = '🍞 *Encomenda Panificadora Pão de Mel*\n\n';
    cart.forEach(item => {
        const isKg = item.unit === 'Kg';
        const qtyLabel = isKg ? formatQtyDisplay(item) : `x${item.qty}`;
        message += `• ${item.name} ${qtyLabel} — R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}\n`;
    });
    message += `\n💰 *Total: R$ ${totalPrice.toFixed(2).replace('.', ',')}*`;
    message += '\n\nGostaria de finalizar esta encomenda!';

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/553532672238?text=${encoded}`;

    // Show success toast and redirect
    showToast('Redirecionando para WhatsApp...');
    closeModal();

    setTimeout(() => {
        window.open(whatsappUrl, '_blank');
    }, 800);

    // Clear cart
    cart = [];
    updateCartUI();
});

// ============================================
// TOAST
// ============================================
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// SMOOTH SCROLL for anchor links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    initRevealAnimations();
});
