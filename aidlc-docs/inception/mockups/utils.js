// ローカルストレージのキー
const CART_KEY = 'ec_cart';
const USER_KEY = 'ec_user';

// カート管理
function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }

    saveCart(cart);
}

function updateCartItemQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.productId === productId);

    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart(cart);
        }
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartCount();
}

function getCartTotal() {
    const cart = getCart();
    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            total += product.price * item.quantity;
        }
    });

    return total;
}

function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const count = getCartItemCount();
        countElement.textContent = count;
    }
}

// ユーザー管理
function getCurrentUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
        localStorage.removeItem(USER_KEY);
    }
    currentUser = user;
}

function logout() {
    setCurrentUser(null);
    window.location.href = 'index.html';
}

// ページ読み込み時にユーザー情報を復元
document.addEventListener('DOMContentLoaded', function() {
    currentUser = getCurrentUser();
    updateCartCount();
    updateHeaderForUser();
});

// ヘッダーをユーザー状態に応じて更新
function updateHeaderForUser() {
    const nav = document.querySelector('header nav');
    if (!nav) return;

    const user = getCurrentUser();

    if (user) {
        // ログイン済みの場合
        nav.innerHTML = `
            <a href="index.html">商品一覧</a>
            <a href="cart.html">カート <span id="cart-count" class="badge">0</span></a>
            <a href="order-history.html">注文履歴</a>
            <a href="#" onclick="logout(); return false;">ログアウト</a>
        `;
    } else {
        // 未ログインの場合
        nav.innerHTML = `
            <a href="index.html">商品一覧</a>
            <a href="cart.html">カート <span id="cart-count" class="badge">0</span></a>
            <a href="login.html">ログイン</a>
            <a href="register.html">新規登録</a>
        `;
    }

    updateCartCount();
}

// 商品をIDから取得
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

// URLパラメータ取得
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 在庫チェック
function checkStock(productId, quantity) {
    const product = getProductById(productId);
    return product && product.stock >= quantity;
}

// 在庫を減らす（モック）
function reduceStock(productId, quantity) {
    const product = getProductById(productId);
    if (product) {
        product.stock -= quantity;
    }
}

// 書籍カバー画像を生成
function generateBookCover(product, width = 200, height = 280) {
    // カテゴリごとの色パレット
    const colorPalettes = {
        tech: ['#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'],
        novel: ['#e74c3c', '#e67e22', '#16a085', '#8e44ad', '#c0392b'],
        business: ['#34495e', '#2c3e50', '#7f8c8d', '#95a5a6', '#d35400']
    };

    // 商品IDに基づいて色を決定
    const palette = colorPalettes[product.category] || colorPalettes.tech;
    const colorIndex = (product.id - 1) % palette.length;
    const mainColor = palette[colorIndex];

    // タイトルを折り返し
    const maxLineLength = 12;
    const titleWords = product.title.split('');
    const titleLines = [];
    let currentLine = '';

    for (let i = 0; i < titleWords.length; i++) {
        if (currentLine.length < maxLineLength) {
            currentLine += titleWords[i];
        } else {
            titleLines.push(currentLine);
            currentLine = titleWords[i];
        }
    }
    if (currentLine) titleLines.push(currentLine);

    // SVG生成
    const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景 -->
            <rect width="${width}" height="${height}" fill="${mainColor}"/>

            <!-- 装飾的なライン -->
            <rect x="10" y="20" width="${width - 20}" height="4" fill="rgba(255,255,255,0.3)"/>
            <rect x="10" y="${height - 24}" width="${width - 20}" height="4" fill="rgba(255,255,255,0.3)"/>

            <!-- タイトル -->
            <text x="${width / 2}" y="60" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="white" text-anchor="middle">
                ${titleLines.slice(0, 3).map((line, i) => `<tspan x="${width / 2}" dy="${i === 0 ? 0 : 24}">${line}</tspan>`).join('')}
            </text>

            <!-- 著者名 -->
            <text x="${width / 2}" y="${height - 60}" font-family="Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.9)" text-anchor="middle">
                ${product.author}
            </text>

            <!-- 出版社 -->
            <text x="${width / 2}" y="${height - 40}" font-family="Arial, sans-serif" font-size="11" fill="rgba(255,255,255,0.7)" text-anchor="middle">
                ${product.publisher}
            </text>
        </svg>
    `;

    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}
