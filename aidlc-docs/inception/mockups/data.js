// 商品データ
const products = [
    {
        id: 1,
        title: 'JavaScript完全ガイド',
        author: '山田太郎',
        publisher: '技術出版社',
        isbn: '978-4-12345-678-9',
        price: 3800,
        stock: 12,
        category: 'tech',
        description: 'JavaScriptの基礎から応用まで、実践的なテクニックを網羅した決定版。ES2023の最新機能も詳しく解説しています。'
    },
    {
        id: 2,
        title: 'Pythonデータ分析入門',
        author: '佐藤花子',
        publisher: 'データサイエンス出版',
        isbn: '978-4-23456-789-0',
        price: 3200,
        stock: 8,
        category: 'tech',
        description: 'Pythonを使ったデータ分析の基礎から機械学習の実践まで。豊富なサンプルコードで学べます。'
    },
    {
        id: 3,
        title: 'リーダブルコード',
        author: '鈴木一郎',
        publisher: 'ソフトウェア書房',
        isbn: '978-4-34567-890-1',
        price: 2800,
        stock: 0,
        category: 'tech',
        description: '読みやすいコードの書き方を徹底解説。チーム開発で役立つコーディング規約とベストプラクティス。'
    },
    {
        id: 4,
        title: 'ドメイン駆動設計入門',
        author: '田中次郎',
        publisher: 'アーキテクチャ出版',
        isbn: '978-4-45678-901-2',
        price: 4200,
        stock: 15,
        category: 'tech',
        description: 'DDDの基本概念から実践的な設計パターンまで。大規模システム開発に必須の知識を体系的に学べます。'
    },
    {
        id: 5,
        title: 'ハリー・ポッターと賢者の石',
        author: 'J.K.ローリング',
        publisher: 'ファンタジー書房',
        isbn: '978-4-56789-012-3',
        price: 1800,
        stock: 25,
        category: 'novel',
        description: '魔法学校ホグワーツでの冒険が始まる！世界中で愛される魔法ファンタジーシリーズ第1巻。'
    },
    {
        id: 6,
        title: '人間失格',
        author: '太宰治',
        publisher: '文芸出版',
        isbn: '978-4-67890-123-4',
        price: 800,
        stock: 30,
        category: 'novel',
        description: '日本文学の名作。人間の本質を深く問いかける不朽の名作。'
    },
    {
        id: 7,
        title: 'ノルウェイの森',
        author: '村上春樹',
        publisher: '現代文学社',
        isbn: '978-4-78901-234-5',
        price: 1600,
        stock: 18,
        category: 'novel',
        description: '青春と喪失を描いた村上春樹の代表作。世界中で読まれる現代文学の傑作。'
    },
    {
        id: 8,
        title: '7つの習慣',
        author: 'スティーブン・R・コヴィー',
        publisher: 'ビジネス書房',
        isbn: '978-4-89012-345-6',
        price: 2400,
        stock: 22,
        category: 'business',
        description: '世界的ベストセラーの自己啓発書。効果的な人生を送るための原則を解説。'
    },
    {
        id: 9,
        title: 'ゼロ秒思考',
        author: '赤羽雄二',
        publisher: 'ビジネス出版',
        isbn: '978-4-90123-456-7',
        price: 1600,
        stock: 3,
        category: 'business',
        description: 'A4メモ書きで思考力と決断力を鍛える実践的メソッド。マッキンゼー流の思考法を公開。'
    },
    {
        id: 10,
        title: 'イシューからはじめよ',
        author: '安宅和人',
        publisher: 'ビジネス思考社',
        isbn: '978-4-01234-567-8',
        price: 1900,
        stock: 14,
        category: 'business',
        description: '本当に解くべき問題（イシュー）を見極める力を養う。コンサルティング思考の真髄。'
    },
    {
        id: 11,
        title: 'React実践入門',
        author: '伊藤三郎',
        publisher: 'フロントエンド出版',
        isbn: '978-4-12345-678-0',
        price: 3500,
        stock: 10,
        category: 'tech',
        description: 'Reactの基礎から実践的なアプリケーション開発まで。Hooksやパフォーマンス最適化も解説。'
    },
    {
        id: 12,
        title: 'クラウドネイティブ入門',
        author: '渡辺五郎',
        publisher: 'インフラ書房',
        isbn: '978-4-23456-789-1',
        price: 3900,
        stock: 7,
        category: 'tech',
        description: 'Kubernetes、Docker、マイクロサービスなど、クラウドネイティブ技術を体系的に学べる。'
    },
    {
        id: 13,
        title: '吾輩は猫である',
        author: '夏目漱石',
        publisher: '古典文学社',
        isbn: '978-4-34567-890-2',
        price: 700,
        stock: 40,
        category: 'novel',
        description: '猫の視点から人間社会を風刺した名作。日本近代文学の傑作。'
    },
    {
        id: 14,
        title: '告白',
        author: '湊かなえ',
        publisher: 'ミステリー出版',
        isbn: '978-4-45678-901-3',
        price: 1700,
        stock: 16,
        category: 'novel',
        description: '衝撃的な展開と緻密な心理描写。読み始めたら止まらないミステリー小説。'
    },
    {
        id: 15,
        title: 'ファクトフルネス',
        author: 'ハンス・ロスリング',
        publisher: '教養書房',
        isbn: '978-4-56789-012-4',
        price: 1980,
        stock: 20,
        category: 'business',
        description: 'データに基づいて世界を正しく見る習慣。思い込みを排除し、事実を見る目を養う。'
    },
    {
        id: 16,
        title: 'エッセンシャル思考',
        author: 'グレッグ・マキューン',
        publisher: '自己啓発出版',
        isbn: '978-4-67890-123-5',
        price: 1800,
        stock: 0,
        category: 'business',
        description: '「より少なく、しかしより良く」を実現する。本当に重要なことに集中するための思考法。'
    },
    {
        id: 17,
        title: 'アルゴリズム図鑑',
        author: '高橋七郎',
        publisher: 'プログラミング出版',
        isbn: '978-4-78901-234-6',
        price: 2800,
        stock: 11,
        category: 'tech',
        description: 'イラストと図解で理解するアルゴリズムとデータ構造。プログラマー必携の1冊。'
    },
    {
        id: 18,
        title: 'データベース設計入門',
        author: '中村八郎',
        publisher: 'データベース書房',
        isbn: '978-4-89012-345-7',
        price: 3300,
        stock: 9,
        category: 'tech',
        description: '正規化からパフォーマンスチューニングまで。実践的なデータベース設計の技法を解説。'
    },
    {
        id: 19,
        title: '君の名は。',
        author: '新海誠',
        publisher: 'アニメ文庫',
        isbn: '978-4-90123-456-8',
        price: 650,
        stock: 35,
        category: 'novel',
        description: '映画「君の名は。」の原作小説。時空を超えた二人の運命の物語。'
    },
    {
        id: 20,
        title: 'アジャイルサムライ',
        author: 'ジョナサン・ラスマセン',
        publisher: 'アジャイル出版',
        isbn: '978-4-01234-567-9',
        price: 2800,
        stock: 13,
        category: 'tech',
        description: 'アジャイル開発の本質を理解する。チーム開発を成功に導く実践的なガイド。'
    }
];

// ユーザーデータ（モック）
let currentUser = null;

// 注文履歴データ（モック）
const orderHistory = [
    {
        id: 'ORD-2024-001',
        date: '2024-11-20',
        status: '配送済み',
        total: 6800,
        items: [
            { productId: 1, quantity: 1, price: 3800 },
            { productId: 8, quantity: 1, price: 2400 },
            { productId: 6, quantity: 1, price: 800 }
        ],
        shippingAddress: {
            name: '山田太郎',
            zipCode: '123-4567',
            address: '東京都渋谷区example 1-2-3',
            phone: '090-1234-5678'
        }
    },
    {
        id: 'ORD-2024-002',
        date: '2024-11-15',
        status: '配送済み',
        total: 5400,
        items: [
            { productId: 4, quantity: 1, price: 4200 },
            { productId: 9, quantity: 1, price: 1600 }
        ],
        shippingAddress: {
            name: '山田太郎',
            zipCode: '123-4567',
            address: '東京都渋谷区example 1-2-3',
            phone: '090-1234-5678'
        }
    }
];
