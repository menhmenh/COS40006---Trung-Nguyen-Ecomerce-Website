(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/about/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AboutPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
'use client';
;
;
// Dữ liệu Timeline dựa trên thông tin bạn cung cấp
const timelineData = [
    {
        year: "2023",
        content: "Opening Representative Office in Korea • Building Buon Ma Thuot into the 'Global Coffee City' • Launching 'La Forêt en ville' hotel complex and 'The World Coffee Center' • Celebrating 20 years of G7 conquering the globe.",
        image: "/images/2023-event.png",
        align: "left"
    },
    {
        year: "2022",
        content: "Launching Trung Nguyen Legend Coffee World in Vietnam and China • Announcing the 'Awakening Lifestyle' journey • Forbes honors Trung Nguyen Legend as an 'Awakening Brand' • Premiering the world's first coffee dance drama.",
        image: "/images/2022-event.png",
        align: "right"
    },
    {
        year: "2021",
        content: "Celebrating 25th Anniversary (1996 – 2021) • Inaugurating Tesla and Cantata model houses and utility complexes in the Coffee City urban area.",
        image: "/images/2021-event.png",
        align: "left"
    },
    {
        year: "2020",
        content: "Launching the art performance show of 3 Coffee Civilizations: Ottoman – Roman – Zen combined with 3D Mapping technology.",
        image: "/images/2020-event.png",
        align: "right"
    },
    {
        year: "2019",
        content: "Embark on the Journey from the Heart, the Journey of Great Ambition – Entrepreneurship for Nation Building, to the most remote mountainous and island regions of our country.",
        image: "/images/2019-event.png",
        align: "right"
    },
    {
        year: "2018",
        content: "Inauguration of the World Coffee Museum in Buon Ma Thuot • Launch of the Trung Nguyen Legend brand and its new, distinctive, special, and unique product line – the new generation of Trung Nguyen Legend coffee.",
        image: "/images/2018-event.png",
        align: "right"
    },
    {
        year: "2017",
        content: "Trung Nguyên Legend officially opens its representative office in Shanghai (China), one of the world's leading commercial and financial centers. • Launches the E-Coffee Model: Specialized Coffee System – Energy Coffee – Life-Changing Coffee.",
        image: "/images/2017-event.png",
        align: "right"
    },
    {
        year: "2016",
        content: "Celebrating 20 years of the Journey of Service, announcing a new Name, Vision, and Mission • Launching Trung Nguyen Legend Café – The Energy Coffee That Changes Life, becoming the largest coffee chain in Southeast Asia • Donating 2 million life-changing books in the Journey of Great Ambition – Entrepreneurship for National Development to Vietnamese youth",
        image: "/images/2016-event.png",
        align: "right"
    },
    {
        year: "2013",
        content: "G7 celebrates its 10th anniversary, marking 3 years of market share leadership and popularity. The Journey to Great Ambition – Nation-Building Entrepreneurship initiative spreads widely with the Future Innovation Competition and the 2nd Vietnam Aspiration Innovation Day, attracting 100,000 participants.",
        image: "/images/2013-event.png",
        align: "right"
    },
    {
        year: "2012",
        content: "The most beloved coffee brand among Vietnamese consumers. Trung Nguyen Coffee is the number one brand in Vietnam with the largest number of coffee consumers. 11 million out of 17 million Vietnamese households purchase Trung Nguyen coffee products. • Launched the Journey to Great Ambition – Entrepreneurship for National Development campaign with the Creative Festival for Vietnamese Aspirations attracting over 50,000 participants.",
        image: "/images/2012-event.png",
        align: "right"
    },
    {
        year: "2010",
        content: "Trung Nguyen coffee products are exported to more than 60 countries and territories worldwide, including the US, Canada, Russia, the UK, Germany, Japan, China, and ASEAN countries.",
        image: "/images/2010-event.png",
        align: "right"
    },
    {
        year: "2003",
        content: "The G7 instant coffee product was launched at the G7 Instant Coffee Festival held at the Reunification Palace on November 23, 2003, which attracted thousands of participants and made its mark with a blind taste test and direct voting for the most preferred instant coffee product between G7 and a major global coffee brand. The results showed that 89% of respondents chose G7 as their favorite.",
        image: "/images/2003-event.png",
        align: "right"
    },
    {
        year: "2001",
        content: "Successful franchising in Japan and Singapore • Announcing the slogan: Unleashing Creativity, with products crafted from the finest coffee beans, modern technology, unique and unreplicable Eastern secrets, combined with unparalleled passion, Trung Nguyen has conquered consumers nationwide.",
        image: "/images/2001-event.png",
        align: "right"
    },
    {
        year: "1998",
        content: "The establishment of the first Trung Nguyen coffee shop in Ho Chi Minh City marked the beginning of the Trung Nguyen chain of coffee shops across Vietnam and in countries around the world.",
        image: "/images/1998-event.png",
        align: "right"
    },
    {
        year: "1996",
        content: "On June 16, 1996, Chairman Dang Le Nguyen Vu founded Trung Nguyen in Buon Ma Thuot – the coffee capital of Vietnam – with initial capital consisting of a rickety bicycle, fueled by the unwavering belief and determination of youth, and the aspiration to build a renowned coffee brand and spread the flavor of Vietnamese coffee throughout the world.",
        image: "/images/1996-event.png",
        align: "right"
    }
];
function AboutPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "bg-[#FDFCF0] min-h-screen pb-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "py-20 bg-[#3E2723] text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-[#C5A059] text-5xl md:text-6xl font-bold uppercase tracking-widest mb-4",
                        children: "Development History"
                    }, void 0, false, {
                        fileName: "[project]/app/about/page.tsx",
                        lineNumber: 106,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-24 h-1 bg-[#C5A059] mx-auto mb-8"
                    }, void 0, false, {
                        fileName: "[project]/app/about/page.tsx",
                        lineNumber: 109,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center gap-8 text-white/60 uppercase text-xs font-bold tracking-widest",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hover:text-[#C5A059] cursor-pointer",
                                children: "Founder's Message"
                            }, void 0, false, {
                                fileName: "[project]/app/about/page.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "hover:text-[#C5A059] cursor-pointer",
                                children: "Vision & Mission"
                            }, void 0, false, {
                                fileName: "[project]/app/about/page.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[#C5A059] border-b border-[#C5A059] pb-1",
                                children: "Development History"
                            }, void 0, false, {
                                fileName: "[project]/app/about/page.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/about/page.tsx",
                        lineNumber: 112,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/about/page.tsx",
                lineNumber: 105,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "container mx-auto px-4 py-20 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#C5A059]/30 hidden md:block -translate-x-1/2"
                    }, void 0, false, {
                        fileName: "[project]/app/about/page.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-24 md:space-y-0",
                        children: timelineData.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `flex flex-col md:flex-row items-center gap-8 md:gap-0 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full md:w-5/12 space-y-4 px-4 md:px-12",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-5xl md:text-7xl font-light italic text-[#3E2723]/20 font-serif",
                                                children: item.year
                                            }, void 0, false, {
                                                fileName: "[project]/app/about/page.tsx",
                                                lineNumber: 130,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[#5D4037] leading-relaxed text-lg",
                                                children: item.content
                                            }, void 0, false, {
                                                fileName: "[project]/app/about/page.tsx",
                                                lineNumber: 133,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/about/page.tsx",
                                        lineNumber: 129,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative z-10 w-12 h-12 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-4 h-4 bg-[#3E2723] rotate-45 border-2 border-[#C5A059]"
                                        }, void 0, false, {
                                            fileName: "[project]/app/about/page.tsx",
                                            lineNumber: 140,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/about/page.tsx",
                                        lineNumber: 139,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full md:w-5/12 px-4 md:px-12",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative h-[300px] w-full  grayscale hover:grayscale-0 transition-all duration-500",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: item.image,
                                                alt: item.year,
                                                fill: true,
                                                className: "object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/app/about/page.tsx",
                                                lineNumber: 146,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/about/page.tsx",
                                            lineNumber: 145,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/about/page.tsx",
                                        lineNumber: 144,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, index, true, {
                                fileName: "[project]/app/about/page.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/about/page.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/about/page.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/about/page.tsx",
        lineNumber: 103,
        columnNumber: 5
    }, this);
}
_c = AboutPage;
var _c;
__turbopack_context__.k.register(_c, "AboutPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_about_page_tsx_d589ce86._.js.map