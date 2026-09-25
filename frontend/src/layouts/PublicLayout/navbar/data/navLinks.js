const navLinks = [
    {
        id: 'home',
        name: 'হোম',
        path: '/',
        type: 'single',
    },

    {
        id: 'get-involved',
        name: 'অংশ নিন',
        type: 'mega',

        preview: {
            title: 'আমাদের সাথে অংশ নিন',
            desc: 'দান, স্বেচ্ছাসেবা ও অংশীদারিত্বের মাধ্যমে মানুষের পাশে দাঁড়ান।',
            highlight: 'মানুষের পাশে দাঁড়ানোর সুযোগ খুঁজে নিন',
            image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80',
            cta: '/donate',
        },

        groups: [
            {
                title: 'আপনি যা করতে পারেন',
                items: [
                    {
                        id: 'donate',
                        name: 'দান করুন',
                        desc: 'যাদের সহায়তা প্রয়োজন, তাদের পাশে দাঁড়ান।',
                        path: '/donate',
                    },
                    {
                        id: 'volunteer',
                        name: 'স্বেচ্ছাসেবী হোন',
                        desc: 'স্বেচ্ছাসেবী হিসেবে মানুষের পাশে কাজ করুন।',
                        path: '/volunteer',
                    },
                    {
                        id: 'partner',
                        name: 'অংশীদার হোন',
                        desc: 'আপনার প্রতিষ্ঠান বা সংগঠন নিয়ে আমাদের সাথে কাজ করুন।',
                        path: '/partner',
                    },
                ],
            },

            {
                title: 'সহায়তা প্রয়োজন?',
                items: [
                    {
                        id: 'request-help',
                        name: 'সহায়তার আবেদন করুন',
                        desc: 'আপনার প্রয়োজনের কথা আমাদের জানান।',
                        path: '/request-help',
                    },
                    {
                        id: 'how-it-works',
                        name: 'কীভাবে কাজ করে',
                        desc: 'কীভাবে আমরা মানুষের কাছে সহায়তা পৌঁছে দিই তা জানুন।',
                        path: '/how-it-works',
                    },
                ],
            },
        ],
    },

    {
        id: 'explore',
        name: 'দেখুন',
        type: 'mega',

        preview: {
            title: 'আমাদের কার্যক্রম দেখুন',
            desc: 'চলমান ক্যাম্পেইন, জরুরি প্রয়োজন এবং মানুষের জীবনে আসা পরিবর্তনের গল্প জানুন।',
            highlight: 'কোন উদ্যোগে আপনার সহায়তা সবচেয়ে বেশি কাজে আসতে পারে, দেখুন',
            image: 'https://hopeww.org.bd/wp-content/uploads/2022/07/Refief-2022-2-1024x576.jpg',
            cta: '/campaigns',
        },

        groups: [
            {
                title: 'ক্যাম্পেইন',
                items: [
                    {
                        id: 'browse-campaigns',
                        name: 'সব ক্যাম্পেইন',
                        desc: 'চলমান সহায়তা ও দানের ক্যাম্পেইনগুলো দেখুন।',
                        path: '/campaigns',
                    },
                    {
                        id: 'featured',
                        name: 'নির্বাচিত ক্যাম্পেইন',
                        desc: 'গুরুত্বপূর্ণ ও অগ্রাধিকারপ্রাপ্ত উদ্যোগগুলো দেখুন।',
                        path: '/campaigns/featured',
                    },
                    {
                        id: 'urgent',
                        name: 'জরুরি সহায়তা',
                        desc: 'এই মুহূর্তে যেসব মানুষের দ্রুত সহায়তা প্রয়োজন, সেগুলো দেখুন।',
                        path: '/campaigns/urgent',
                    },
                ],
            },

            {
                title: 'আরও দেখুন',
                items: [
                    {
                        id: 'categories',
                        name: 'সহায়তার ক্ষেত্র',
                        desc: 'খাদ্য, শিক্ষা, স্বাস্থ্যসহ বিভিন্ন সহায়তার ক্ষেত্র দেখুন।',
                        path: '/categories',
                    },
                    {
                        id: 'stories',
                        name: 'পরিবর্তনের গল্প',
                        desc: 'সহায়তার মাধ্যমে বদলে যাওয়া মানুষের গল্প পড়ুন।',
                        path: '/stories',
                    },
                ],
            },
        ],
    },

    {
        id: 'about',
        name: 'আমাদের সম্পর্কে',
        type: 'mega',

        preview: {
            title: 'Stand For People সম্পর্কে',
            desc: 'আমাদের লক্ষ্য, কাজ এবং এই প্ল্যাটফর্মের পেছনে থাকা মানুষদের সম্পর্কে জানুন।',
            highlight: 'বিশ্বাস ও স্বচ্ছতার ভিত্তিতে আমরা কাজ করি',
            image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
            cta: '/about',
        },

        groups: [
            {
                title: 'আমাদের সম্পর্কে',
                items: [
                    {
                        id: 'overview',
                        name: 'পরিচিতি',
                        desc: 'Stand For People কী এবং আমরা কীভাবে কাজ করি তা জানুন।',
                        path: '/about',
                    },
                    {
                        id: 'mission',
                        name: 'আমাদের লক্ষ্য',
                        desc: 'কেন আমরা কাজ করি এবং কী পরিবর্তন আনতে চাই তা জানুন।',
                        path: '/about/mission',
                    },
                    {
                        id: 'story',
                        name: 'আমাদের গল্প',
                        desc: 'কীভাবে Stand For People-এর যাত্রা শুরু হয়েছে তা জানুন।',
                        path: '/about/story',
                    },
                    {
                        id: 'team',
                        name: 'আমাদের টিম',
                        desc: 'এই উদ্যোগের পেছনে কাজ করা মানুষদের সাথে পরিচিত হোন।',
                        path: '/about/team',
                    },
                ],
            },

            {
                title: 'স্বচ্ছতা ও বিশ্বাস',
                items: [
                    {
                        id: 'impact',
                        name: 'আমাদের প্রভাব',
                        desc: 'আমাদের কার্যক্রম মানুষের জীবনে কী পরিবর্তন আনছে তা দেখুন।',
                        path: '/impact',
                    },
                    {
                        id: 'reports',
                        name: 'প্রতিবেদন',
                        desc: 'আমাদের আর্থিক ও কার্যক্রমের তথ্য দেখুন।',
                        path: '/reports',
                    },
                    {
                        id: 'safety',
                        name: 'বিশ্বাস ও নিরাপত্তা',
                        desc: 'যাচাই প্রক্রিয়া ও নিরাপত্তা ব্যবস্থা সম্পর্কে জানুন।',
                        path: '/trust-safety',
                    },
                ],
            },
        ],
    },

    {
        id: 'account',
        name: 'অ্যাকাউন্ট',
        type: 'single',
        path: '/account',
    },
];

export default navLinks;