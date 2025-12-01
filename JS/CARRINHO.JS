const products = [
    {
        id: 1,
        name: "Batata Minecraft",
        description: "Batata frita crocante inspirada no universo Minecraft.",
        price: 6.67,
        image: "img/FFmine.png"
    },
    {
        id: 2,
        name: "Bolo Crime & Carmesim",
        description: "Bolo com textura aveludada e sabor intenso, inspirado na obra clássica de Dostoiévski.",
        price: 24.99,
        image: "img/Crimeecastigo.png"
    },
    {
        id: 3,
        name: "Sticks de Frango Breaking Bad",
        description: "Tiras de frango crocantes com um tempero especial que vai viciar seu paladar.",
        price: 13.99,
        image: "img/sticksBB.png"
    },
    {
        id: 4,
        name: "Waffle de Xadrez",
        description: "Delicioso waffle com design inspirado no clássico jogo de xadrez.",
        price: 14.99,
        image: "img/wafllechess.png"
    },
    {
        id: 5,
        name: "Cookie Wandinha",
        description: "Delicioso cookie com design inspirado na série Wandinha.",
        price: 8.99,
        image: "img/cookiewandinha.png"
    },
    {
        id: 6,
        name: "Combo Revolução dos Bichos",
        description: "Delicioso combo com itens inspirados no clássico literário de George Orwell.",
        price: 60.99,
        image: "img/comborevdosb.png"
    }
];

// Carrinho de compras
let cart = [];

// Elementos DOM
const productList = document.getElementById('productList');
const cartItemsList = document.getElementById('cartItemsList');
const emptyCart = document.getElementById('emptyCart');
const cartContent = document.getElementById('cartContent');
const cartBadge = document.getElementById('cartBadge');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const totalElement = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const productModalTitle = document.getElementById('productModalTitle');
const productModalImage = document.getElementById('productModalImage');
const productModalName = document.getElementById('productModalName');
const productModalDescription = document.getElementById('productModalDescription');
const productModalPrice = document.getElementById('productModalPrice');
const productQuantity = document.getElementById('productQuantity');
const decreaseQuantity = document.getElementById('decreaseQuantity');
const increaseQuantity = document.getElementById('increaseQuantity');
const addToCartModal = document.getElementById('addToCartModal');

// Produto selecionado atualmente no modal
let currentProduct = null;

// Inicialização
document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    loadCartFromStorage();
    updateCartUI();

    // Event Listeners
    checkoutBtn.addEventListener('click', checkout);
    clearCartBtn.addEventListener('click', clearCart);
    decreaseQuantity.addEventListener('click', () => updateQuantity(-1));
    increaseQuantity.addEventListener('click', () => updateQuantity(1));
    addToCartModal.addEventListener('click', addCurrentProductToCart);
});

// Carregar produtos na página
function loadProducts() {
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-md-6 col-lg-4';
        productCard.innerHTML = `
                    <div class="card h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text flex-grow-1">${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center mt-auto">
                                <span class="product-price">R$ ${product.price.toFixed(2)}</span>
                                <div>
                                    <button class="btn btn-sm btn-outline-primary view-product" data-id="${product.id}">
                                        <i class="bi bi-eye"></i>
                                    </button>
                                    <button class="btn btn-sm btn-primary add-to-cart" data-id="${product.id}">
                                        <i class="bi bi-cart-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        productList.appendChild(productCard);
    });

    // Adicionar event listeners aos botões
    document.querySelectorAll('.view-product').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
            openProductModal(productId);
        });
    });

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
            addToCart(productId, 1);
        });
    });
}

// Abrir modal de produto
function openProductModal(productId) {
    currentProduct = products.find(p => p.id === productId);

    if (currentProduct) {
        productModalTitle.textContent = currentProduct.name;
        productModalImage.src = currentProduct.image;
        productModalName.textContent = currentProduct.name;
        productModalDescription.textContent = currentProduct.description;
        productModalPrice.textContent = `R$ ${currentProduct.price.toFixed(2)}`;
        productQuantity.value = 1;

        productModal.show();
    }
}

// Atualizar quantidade no modal
function updateQuantity(change) {
    let newQuantity = parseInt(productQuantity.value) + change;
    if (newQuantity < 1) newQuantity = 1;
    productQuantity.value = newQuantity;
}

// Adicionar produto atual ao carrinho
function addCurrentProductToCart() {
    if (currentProduct) {
        const quantity = parseInt(productQuantity.value);
        addToCart(currentProduct.id, quantity);
        productModal.hide();

        // Feedback visual
        const toast = document.createElement('div');
        toast.className = 'position-fixed bottom-0 end-0 p-3';
        toast.style.zIndex = '11';
        toast.innerHTML = `
                    <div class="toast show" role="alert">
                        <div class="toast-header">
                            <i class="bi bi-check-circle text-success me-2"></i>
                            <strong class="me-auto">Sucesso</strong>
                            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                        </div>
                        <div class="toast-body">
                            ${quantity}x ${currentProduct.name} adicionado(s) ao carrinho!
                        </div>
                    </div>
                `;
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }
}

// Adicionar produto ao carrinho
function addToCart(productId, quantity) {
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCartToStorage();
    updateCartUI();
}

// Remover item do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

// Atualizar quantidade de um item no carrinho
function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        updateCartUI();
    }
}

// Limpar carrinho
function clearCart() {
    if (cart.length === 0) return;

    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = [];
        saveCartToStorage();
        updateCartUI();
    }
}

// Finalizar compra
function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    alert('Compra finalizada com sucesso! Obrigado pela preferência.');
    cart = [];
    saveCartToStorage();
    updateCartUI();
}

// Atualizar interface do carrinho
function updateCartUI() {
    // Atualizar badge
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;

    // Mostrar/ocultar carrinho vazio
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartContent.style.display = 'block';

        // Atualizar lista de itens
        cartItemsList.innerHTML = '';

        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                        <div class="row align-items-center">
                            <div class="col-3">
                                <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                            </div>
                            <div class="col-9">
                                <h6 class="mb-1">${item.name}</h6>
                                <p class="mb-1 product-price">R$ ${item.price.toFixed(2)}</p>
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="quantity-controls">
                                        <button class="quantity-btn decrease" data-id="${item.id}">
                                            <i class="bi bi-dash"></i>
                                        </button>
                                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                        <button class="quantity-btn increase" data-id="${item.id}">
                                            <i class="bi bi-plus"></i>
                                        </button>
                                    </div>
                                    <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
            cartItemsList.appendChild(cartItem);
        });

        // Adicionar event listeners aos controles de quantidade
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
                const item = cart.find(item => item.id === productId);
                if (item) {
                    updateCartItemQuantity(productId, item.quantity - 1);
                }
            });
        });

        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
                const item = cart.find(item => item.id === productId);
                if (item) {
                    updateCartItemQuantity(productId, item.quantity + 1);
                }
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = parseInt(e.target.getAttribute('data-id'));
                const newQuantity = parseInt(e.target.value);
                updateCartItemQuantity(productId, newQuantity);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').getAttribute('data-id'));
                removeFromCart(productId);
            });
        });

        // Calcular totais
        const shipping = subtotal > 200 ? 0 : 15.99;
        const total = subtotal + shipping;

        // Atualizar elementos de total
        subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        shippingElement.textContent = shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`;
        totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }
}

// Salvar carrinho no localStorage
function saveCartToStorage() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Carregar carrinho do localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}