module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/store.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Hardcoded data store for the coffee shop
__turbopack_context__.s([
    "addProduct",
    ()=>addProduct,
    "categories",
    ()=>categories,
    "createOrder",
    ()=>createOrder,
    "createUser",
    ()=>createUser,
    "deleteProduct",
    ()=>deleteProduct,
    "findUserByEmail",
    ()=>findUserByEmail,
    "getAllOrders",
    ()=>getAllOrders,
    "getUserOrders",
    ()=>getUserOrders,
    "orders",
    ()=>orders,
    "products",
    ()=>products,
    "updateOrderStatus",
    ()=>updateOrderStatus,
    "updateProduct",
    ()=>updateProduct,
    "users",
    ()=>users
]);
const categories = [
    {
        id: '1',
        name: 'Espresso',
        slug: 'espresso'
    },
    {
        id: '2',
        name: 'Frappe',
        slug: 'frappe'
    },
    {
        id: '3',
        name: 'Iced Coffee',
        slug: 'iced-coffee'
    },
    {
        id: '4',
        name: 'Catering',
        slug: 'catering'
    },
    {
        id: '5',
        name: 'Gelato',
        slug: 'gelato'
    }
];
const products = [
    {
        id: '1',
        name: 'Double Espresso',
        category: 'espresso',
        price: 59.99,
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        image: '/products/double-espresso.png',
        badge: '#1 Selling',
        rating: 4.9,
        reviews: 2424
    },
    {
        id: '2',
        name: 'Caramel Frappe',
        category: 'frappe',
        price: 59.99,
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        image: '/products/caramel-frappe.png',
        badge: '#2 Selling',
        rating: 4.8,
        reviews: 1856
    },
    {
        id: '3',
        name: 'Iced Coffee',
        category: 'iced-coffee',
        price: 59.99,
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        image: '/products/iced-coffee.png',
        badge: '#3 Selling',
        rating: 4.7,
        reviews: 1645
    },
    {
        id: '4',
        name: 'Latte Macchiato',
        category: 'espresso',
        price: 49.99,
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        image: '/products/latte.png',
        rating: 4.6,
        reviews: 1234
    },
    {
        id: '5',
        name: 'Mocha Frappe',
        category: 'frappe',
        price: 64.99,
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        image: '/products/mocha-frappe.png',
        rating: 4.8,
        reviews: 1567
    },
    {
        id: '6',
        name: 'Cold Brew',
        category: 'iced-coffee',
        price: 54.99,
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        image: '/products/cold-brew.png',
        rating: 4.9,
        reviews: 1987
    },
    {
        id: '7',
        name: 'Vanilla Gelato',
        category: 'gelato',
        price: 39.99,
        description: 'Life is like GELATO, enjoy it before it melts.',
        image: '/products/vanilla-gelato.png',
        rating: 4.7,
        reviews: 987
    },
    {
        id: '8',
        name: 'Americano',
        category: 'espresso',
        price: 44.99,
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        image: '/products/americano.png',
        rating: 4.5,
        reviews: 876
    },
    {
        id: '9',
        name: 'Cappuccino',
        category: 'espresso',
        price: 52.99,
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        image: '/products/cappuccino.png',
        rating: 4.8,
        reviews: 1432
    },
    {
        id: '10',
        name: 'Strawberry Frappe',
        category: 'frappe',
        price: 62.99,
        description: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.',
        image: '/products/strawberry-frappe.png',
        rating: 4.6,
        reviews: 1123
    }
];
let users = [
    {
        id: 'user_1',
        email: 'demo@alowishus.com',
        password: 'demo123',
        name: 'Demo User',
        createdAt: new Date()
    },
    {
        id: 'user_2',
        email: 'admin@alowishus.com',
        password: 'admin123',
        name: 'Admin User',
        createdAt: new Date()
    }
];
let orders = [];
const findUserByEmail = (email)=>{
    return users.find((user)=>user.email === email);
};
const createUser = (email, password, name)=>{
    const user = {
        id: `user_${Date.now()}`,
        email,
        password,
        name,
        createdAt: new Date()
    };
    users.push(user);
    return user;
};
const createOrder = (userId, items)=>{
    const total = items.reduce((sum, item)=>sum + item.price * item.quantity, 0);
    const order = {
        id: `order_${Date.now()}`,
        userId,
        items,
        total,
        status: 'completed',
        createdAt: new Date()
    };
    orders.push(order);
    return order;
};
const getUserOrders = (userId)=>{
    return orders.filter((order)=>order.userId === userId);
};
const getAllOrders = ()=>{
    return orders;
};
const updateOrderStatus = (orderId, status)=>{
    const order = orders.find((o)=>o.id === orderId);
    if (order) {
        order.status = status;
    }
    return order;
};
const addProduct = (product)=>{
    const newProduct = {
        ...product,
        id: `product_${Date.now()}`
    };
    products.push(newProduct);
    return newProduct;
};
const updateProduct = (id, updates)=>{
    const index = products.findIndex((p)=>p.id === id);
    if (index !== -1) {
        products[index] = {
            ...products[index],
            ...updates
        };
        return products[index];
    }
    return null;
};
const deleteProduct = (id)=>{
    const index = products.findIndex((p)=>p.id === id);
    if (index !== -1) {
        products.splice(index, 1);
        return true;
    }
    return false;
};
}),
"[project]/app/api/admin/products/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-route] (ecmascript)");
;
;
async function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["products"]);
}
async function POST(request) {
    try {
        const body = await request.json();
        const newProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addProduct"])(body);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newProduct, {
            status: 201
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create product'
        }, {
            status: 500
        });
    }
}
async function PUT(request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        const updatedProduct = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateProduct"])(id, updates);
        if (!updatedProduct) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Product not found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updatedProduct);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to update product'
        }, {
            status: 500
        });
    }
}
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Product ID required'
            }, {
                status: 400
            });
        }
        const deleted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deleteProduct"])(id);
        if (!deleted) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Product not found'
            }, {
                status: 404
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to delete product'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cc60ffc3._.js.map