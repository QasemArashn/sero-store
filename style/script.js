
/* =========================================
   بيانات منتجات متجر سيرو
   ========================================= */

const products = {

    1: {
        name: "منتج سيرو الأول",
        price: 10000,
        image: "images/product1.jpg",
        description:
            "وصف تفصيلي لمنتج سيرو الأول. يمكنك تعديل هذا النص ووضع معلومات المنتج الحقيقية هنا.",
        specifications: [
            "جودة عالية",
            "تصميم عملي",
            "مناسب للاستخدام اليومي"
        ]
    },

    2: {
        name: "منتج سيرو الثاني",
        price: 15000,
        image: "images/product2.jpg",
        description:
            "وصف تفصيلي لمنتج سيرو الثاني. يمكنك تعديل هذا النص ووضع معلومات المنتج الحقيقية هنا.",
        specifications: [
            "تصميم أنيق",
            "جودة ممتازة",
            "سهل الاستخدام"
        ]
    },

    3: {
        name: "منتج سيرو الثالث",
        price: 20000,
        image: "images/product3.jpg",
        description:
            "وصف تفصيلي لمنتج سيرو الثالث. يمكنك تعديل هذا النص ووضع معلومات المنتج الحقيقية هنا.",
        specifications: [
            "خامة ممتازة",
            "تصميم مميز",
            "استخدام سهل"
        ]
    }

};

/* =========================================
   عرض المنتجات تلقائيًا في الصفحة الرئيسية
   ========================================= */

function displayProducts() {

    const container =
        document.getElementById("productsContainer");

    if (!container) {
        return;
    }


    container.innerHTML = "";


    Object.entries(products).forEach(
        ([id, product]) => {

            const card =
                document.createElement("div");

            card.className = "product-card";

            card.dataset.name =
                product.name;


            card.innerHTML = `

                <div
                    class="product-image"
                    onclick="openProduct(${id})">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy">

                </div>


                <div class="product-info">

                    <h3>
                        ${product.name}
                    </h3>


                    <p>
                        ${product.description}
                    </p>


                    <div class="product-bottom">

                        <span class="price">
                            ${product.price.toLocaleString("ar-YE")}
                            ريال
                        </span>


                        <button
                            class="order-button"
                            onclick="
                                event.stopPropagation();
                                addToCart(
                                    '${product.name.replace(/'/g, "\\'")}',
                                    ${product.price}
                                );
                            ">

                            🛒 أضف للسلة

                        </button>

                    </div>

                </div>

            `;


            /* الضغط على البطاقة */

            card.addEventListener(
                "click",
                function () {

                    openProduct(id);

                }
            );


            container.appendChild(card);

        }
    );

}


/* =========================================
   تشغيل عرض المنتجات
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayProducts();

        updateCart();

    }
);





/* =========================================
   متجر سيرو - نظام السلة والبحث
   ========================================= */

// السلة
let cart = JSON.parse(localStorage.getItem("seroCart")) || [];


/* =========================================
   إضافة منتج إلى السلة
   ========================================= */

function addToCart(name, price) {

    const existingProduct = cart.find(
        product => product.name === name
    );

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    saveCart();
    updateCart();

    // فتح السلة بعد الإضافة
    showCart();
}


/* =========================================
   حفظ السلة
   ========================================= */

function saveCart() {

    localStorage.setItem(
        "seroCart",
        JSON.stringify(cart)
    );
}


/* =========================================
   تحديث السلة
   ========================================= */

function updateCart() {

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");

    if (!cartItems || !cartCount || !cartTotal) {
        return;
    }


    // عدد المنتجات
    const totalQuantity = cart.reduce(
        (total, product) => total + product.quantity,
        0
    );

    cartCount.textContent = totalQuantity;


    // السلة فارغة
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">
                السلة فارغة حاليًا 🛒
            </div>
        `;

        cartTotal.textContent = "0 ريال";

        return;
    }


    // عرض المنتجات
    cartItems.innerHTML = "";

    let total = 0;


    cart.forEach((product, index) => {

        const productTotal =
            product.price * product.quantity;

        total += productTotal;


        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `
            <div class="cart-item-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.price.toLocaleString("ar-YE")} ريال
                </p>

            </div>


            <div class="cart-item-controls">

                <button
                    onclick="increaseQuantity(${index})">
                    +
                </button>

                <span>
                    ${product.quantity}
                </span>

                <button
                    onclick="decreaseQuantity(${index})">
                    -
                </button>

            </div>


            <div class="cart-item-total">

                ${productTotal.toLocaleString("ar-YE")} ريال

            </div>


            <button
                class="remove-item"
                onclick="removeFromCart(${index})"
                aria-label="حذف المنتج">
                🗑️
            </button>
        `;


        cartItems.appendChild(item);

    });


    // الإجمالي
    cartTotal.textContent =
        total.toLocaleString("ar-YE") + " ريال";
}


/* =========================================
   زيادة الكمية
   ========================================= */

function increaseQuantity(index) {

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += 1;

    saveCart();
    updateCart();
}


/* =========================================
   إنقاص الكمية
   ========================================= */

function decreaseQuantity(index) {

    if (!cart[index]) {
        return;
    }


    if (cart[index].quantity > 1) {

        cart[index].quantity -= 1;

    } else {

        cart.splice(index, 1);

    }

    saveCart();
    updateCart();
}


/* =========================================
   حذف منتج من السلة
   ========================================= */

function removeFromCart(index) {

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart();
    updateCart();
}


/* =========================================
   فتح السلة
   ========================================= */

function showCart() {

    const overlay =
        document.getElementById("cartOverlay");

    const sidebar =
        document.getElementById("cartSidebar");


    if (!overlay || !sidebar) {
        return;
    }


    overlay.classList.add("active");

    sidebar.classList.add("active");

    document.body.classList.add("cart-open");
}


/* =========================================
   إغلاق السلة
   ========================================= */

function closeCart() {

    const overlay =
        document.getElementById("cartOverlay");

    const sidebar =
        document.getElementById("cartSidebar");


    if (!overlay || !sidebar) {
        return;
    }


    overlay.classList.remove("active");

    sidebar.classList.remove("active");

    document.body.classList.remove("cart-open");
}


/* =========================================
   البحث عن المنتجات
   ========================================= */

function searchProducts() {

    const input =
        document.getElementById("searchInput");

    const products =
        document.querySelectorAll(".product-card");


    if (!input) {
        return;
    }


    const searchText =
        input.value.trim().toLowerCase();


    products.forEach(product => {

        const name =
            product.dataset.name?.toLowerCase() || "";

        if (name.includes(searchText)) {

            product.style.display = "";

        } else {

            product.style.display = "none";

        }

    });
}


/* =========================================
   فتح صفحة تفاصيل المنتج
   ========================================= */

function openProduct(productId) {

    window.location.href =
        `product.html?id=${productId}`;
}


/* =========================================
   إرسال الطلب إلى واتساب
   ========================================= */

function sendOrderToWhatsApp() {

    if (cart.length === 0) {

        alert("السلة فارغة حاليًا 🛒");

        return;
    }


    let message =
        "مرحبًا، أريد طلب المنتجات التالية من متجر سيرو:%0A%0A";


    let total = 0;


    cart.forEach((product, index) => {

        const productTotal =
            product.price * product.quantity;

        total += productTotal;


        message +=
            `${index + 1}. ${product.name}%0A`;

        message +=
            `الكمية: ${product.quantity}%0A`;

        message +=
            `السعر: ${product.price.toLocaleString("ar-YE")} ريال%0A`;

        message +=
            `الإجمالي: ${productTotal.toLocaleString("ar-YE")} ريال%0A%0A`;

    });


    message +=
        `الإجمالي الكلي: ${total.toLocaleString("ar-YE")} ريال%0A%0A`;

    message +=
        "أرجو التواصل معي لإتمام الطلب.";


    const whatsappURL =
        `https://wa.me/qr/YDFGDYJZYL34H1?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );
}




/* =========================================
   صفحة تفاصيل المنتج
   ========================================= */
/* =========================================
   صفحة تفاصيل المنتج
   ========================================= */

function loadProductDetails() {

    const productName =
        document.getElementById("productName");

    // إذا لم نكن في صفحة تفاصيل المنتج
    if (!productName) {
        return;
    }


    /* قراءة رقم المنتج من الرابط */

    const urlParams =
        new URLSearchParams(
            window.location.search
        );

    const productId =
        urlParams.get("id");


    /* البحث عن المنتج */

    const product =
        products[productId];


    /* إذا كان المنتج غير موجود */

    if (!product) {

        productName.textContent =
            "المنتج غير موجود";

        document.getElementById(
            "productDescription"
        ).textContent =
            "عذرًا، لم نتمكن من العثور على هذا المنتج.";

        return;
    }


    /* =====================================
       عرض بيانات المنتج
       ===================================== */

    // اسم المنتج
    productName.textContent =
        product.name;


    // السعر
    document.getElementById(
        "productPrice"
    ).textContent =
        product.price.toLocaleString("ar-YE")
        + " ريال";


    // الوصف
    document.getElementById(
        "productDescription"
    ).textContent =
        product.description;


    /* =====================================
       صورة المنتج
       ===================================== */

    const productImage =
        document.getElementById(
            "productImage"
        );


    if (productImage) {

        productImage.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}">
        `;

    }


    /* =====================================
       المواصفات
       ===================================== */

    const specifications =
        document.getElementById(
            "productSpecifications"
        );


    if (specifications) {

        specifications.innerHTML = "";


        product.specifications.forEach(
            specification => {

                const li =
                    document.createElement("li");

                li.textContent =
                    specification;

                specifications.appendChild(li);

            }
        );

    }


    /* =====================================
       كمية المنتج
       ===================================== */

    let quantity = 1;


    const quantityDisplay =
        document.getElementById(
            "productQuantity"
        );


    const increaseButton =
        document.getElementById(
            "increaseQuantity"
        );


    const decreaseButton =
        document.getElementById(
            "decreaseQuantity"
        );


    /* زيادة الكمية */

    if (increaseButton) {

        increaseButton.onclick = function () {

            quantity++;

            if (quantityDisplay) {

                quantityDisplay.textContent =
                    quantity;

            }

        };

    }


    /* إنقاص الكمية */

    if (decreaseButton) {

        decreaseButton.onclick = function () {

            if (quantity > 1) {

                quantity--;

                if (quantityDisplay) {

                    quantityDisplay.textContent =
                        quantity;

                }

            }

        };

    }


    /* =====================================
       زر إضافة المنتج إلى السلة
       ===================================== */

    const addButton =
        document.getElementById(
            "addProductButton"
        );


    if (addButton) {

        addButton.onclick = function () {

            /*
             * إضافة المنتج بعدد الكمية المحددة
             */

            for (
                let i = 0;
                i < quantity;
                i++
            ) {

                addToCart(
                    product.name,
                    product.price
                );

            }

        };

    }

}

/* =========================================
   تشغيل وظائف المتجر عند تحميل الصفحة
   ========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // تحديث السلة
        updateCart();

        // عرض المنتجات في الصفحة الرئيسية
        displayProducts();

        // تحميل تفاصيل المنتج إذا كنا في product.html
        loadProductDetails();

    }
);