# PACT 定義 (Consumer-Driven Contract Tests)

## 概要
本ドキュメントでは、シンプルECサイトの各ユニット間の連携を表すPACT（Provider And Consumer Tests）定義を記載します。
コンシューマ駆動契約テストにより、各ユニットが独立して開発・テスト・デプロイできることを保証します。

## PACT定義の構造

各PACT定義は以下の要素を含みます：
- **Consumer**: APIやイベントを利用する側のユニット
- **Provider**: APIやイベントを提供する側のユニット
- **Interaction**: 具体的なリクエスト/レスポンスまたはイベントの契約

---

## 1. 在庫管理 → 商品カタログ管理

### PACT 1.1: 商品の在庫状態取得

```json
{
  "consumer": {
    "name": "Product Catalog"
  },
  "provider": {
    "name": "Inventory Management"
  },
  "interactions": [
    {
      "description": "商品の在庫状態を取得する",
      "providerState": "商品ID 'P001' が在庫5冊で存在する",
      "request": {
        "method": "GET",
        "path": "/api/inventory/products/P001",
        "headers": {
          "Content-Type": "application/json"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "productId": "P001",
          "quantity": 5,
          "status": "in_stock",
          "stockLevel": "low"
        }
      }
    },
    {
      "description": "在庫切れ商品の在庫状態を取得する",
      "providerState": "商品ID 'P002' が在庫0で存在する",
      "request": {
        "method": "GET",
        "path": "/api/inventory/products/P002",
        "headers": {
          "Content-Type": "application/json"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "productId": "P002",
          "quantity": 0,
          "status": "out_of_stock",
          "stockLevel": "none"
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "3.0.0"
    }
  }
}
```

### PACT 1.2: 複数商品の在庫状態を一括取得

```json
{
  "consumer": {
    "name": "Product Catalog"
  },
  "provider": {
    "name": "Inventory Management"
  },
  "interactions": [
    {
      "description": "複数商品の在庫状態を一括取得する",
      "providerState": "商品ID 'P001', 'P002', 'P003' が存在する",
      "request": {
        "method": "POST",
        "path": "/api/inventory/products/batch",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "productIds": ["P001", "P002", "P003"]
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "inventories": [
            {
              "productId": "P001",
              "quantity": 5,
              "status": "in_stock",
              "stockLevel": "low"
            },
            {
              "productId": "P002",
              "quantity": 0,
              "status": "out_of_stock",
              "stockLevel": "none"
            },
            {
              "productId": "P003",
              "quantity": 20,
              "status": "in_stock",
              "stockLevel": "high"
            }
          ]
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "3.0.0"
    }
  }
}
```

---

## 2. 在庫管理 → ショッピングカート管理

### PACT 2.1: カート追加時の在庫チェック

```json
{
  "consumer": {
    "name": "Shopping Cart"
  },
  "provider": {
    "name": "Inventory Management"
  },
  "interactions": [
    {
      "description": "商品追加時に在庫が十分にあることを確認する",
      "providerState": "商品ID 'P001' が在庫10冊で存在する",
      "request": {
        "method": "POST",
        "path": "/api/inventory/products/P001/check",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "requestedQuantity": 3
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "productId": "P001",
          "requestedQuantity": 3,
          "available": true,
          "currentStock": 10,
          "message": "在庫は十分にあります"
        }
      }
    },
    {
      "description": "商品追加時に在庫が不足していることを確認する",
      "providerState": "商品ID 'P001' が在庫2冊で存在する",
      "request": {
        "method": "POST",
        "path": "/api/inventory/products/P001/check",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "requestedQuantity": 5
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "productId": "P001",
          "requestedQuantity": 5,
          "available": false,
          "currentStock": 2,
          "message": "在庫が不足しています。現在の在庫数: 2冊"
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "3.0.0"
    }
  }
}
```

---

## 3. 在庫管理 → 注文・決済管理

### PACT 3.1: 注文確定時の在庫減算（イベント駆動）

```json
{
  "consumer": {
    "name": "Inventory Management"
  },
  "provider": {
    "name": "Order & Payment"
  },
  "interactions": [
    {
      "description": "注文確定イベントを受信して在庫を減算する",
      "providerState": "注文ID 'O001' が確定された",
      "contents": {
        "pact:content-type": "application/json",
        "eventType": "OrderConfirmed",
        "eventId": "e12345",
        "timestamp": "2025-11-26T10:30:00Z",
        "orderId": "O001",
        "items": [
          {
            "productId": "P001",
            "quantity": 2
          },
          {
            "productId": "P002",
            "quantity": 1
          }
        ]
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "4.0.0"
    },
    "type": "async"
  }
}
```

### PACT 3.2: 在庫減算API（同期）

```json
{
  "consumer": {
    "name": "Order & Payment"
  },
  "provider": {
    "name": "Inventory Management"
  },
  "interactions": [
    {
      "description": "注文確定時に在庫を減算する",
      "providerState": "商品ID 'P001' が在庫10冊、'P002' が在庫5冊で存在する",
      "request": {
        "method": "POST",
        "path": "/api/inventory/reserve",
        "headers": {
          "Content-Type": "application/json",
          "X-Idempotency-Key": "O001"
        },
        "body": {
          "orderId": "O001",
          "items": [
            {
              "productId": "P001",
              "quantity": 2
            },
            {
              "productId": "P002",
              "quantity": 1
            }
          ]
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "orderId": "O001",
          "reserved": true,
          "items": [
            {
              "productId": "P001",
              "quantity": 2,
              "remainingStock": 8
            },
            {
              "productId": "P002",
              "quantity": 1,
              "remainingStock": 4
            }
          ],
          "timestamp": "2025-11-26T10:30:00Z"
        }
      }
    },
    {
      "description": "在庫不足で減算が失敗する",
      "providerState": "商品ID 'P001' が在庫1冊で存在する",
      "request": {
        "method": "POST",
        "path": "/api/inventory/reserve",
        "headers": {
          "Content-Type": "application/json",
          "X-Idempotency-Key": "O002"
        },
        "body": {
          "orderId": "O002",
          "items": [
            {
              "productId": "P001",
              "quantity": 5
            }
          ]
        }
      },
      "response": {
        "status": 409,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "orderId": "O002",
          "reserved": false,
          "error": "INSUFFICIENT_STOCK",
          "message": "在庫が不足しています",
          "items": [
            {
              "productId": "P001",
              "requestedQuantity": 5,
              "availableQuantity": 1
            }
          ]
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "3.0.0"
    }
  }
}
```

### PACT 3.3: 在庫減算完了イベント（イベント駆動）

```json
{
  "consumer": {
    "name": "Order & Payment"
  },
  "provider": {
    "name": "Inventory Management"
  },
  "interactions": [
    {
      "description": "在庫減算完了イベントを受信する",
      "providerState": "注文ID 'O001' の在庫減算が完了した",
      "contents": {
        "pact:content-type": "application/json",
        "eventType": "InventoryReserved",
        "eventId": "e67890",
        "timestamp": "2025-11-26T10:30:01Z",
        "orderId": "O001",
        "reserved": true,
        "items": [
          {
            "productId": "P001",
            "quantity": 2,
            "remainingStock": 8
          },
          {
            "productId": "P002",
            "quantity": 1,
            "remainingStock": 4
          }
        ]
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "4.0.0"
    },
    "type": "async"
  }
}
```

---

## 4. 商品カタログ管理 → ショッピングカート管理

### PACT 4.1: 商品情報取得

```json
{
  "consumer": {
    "name": "Shopping Cart"
  },
  "provider": {
    "name": "Product Catalog"
  },
  "interactions": [
    {
      "description": "カート表示のため商品情報を取得する",
      "providerState": "商品ID 'P001' が存在する",
      "request": {
        "method": "GET",
        "path": "/api/products/P001",
        "headers": {
          "Content-Type": "application/json"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "productId": "P001",
          "title": "クリーンアーキテクチャ",
          "author": "Robert C. Martin",
          "price": 3520,
          "imageUrl": "https://example.com/images/P001.jpg",
          "isbn": "978-4048930659"
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "3.0.0"
    }
  }
}
```

### PACT 4.2: 複数商品情報の一括取得

```json
{
  "consumer": {
    "name": "Shopping Cart"
  },
  "provider": {
    "name": "Product Catalog"
  },
  "interactions": [
    {
      "description": "カート内の複数商品の情報を一括取得する",
      "providerState": "商品ID 'P001', 'P002' が存在する",
      "request": {
        "method": "POST",
        "path": "/api/products/batch",
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "productIds": ["P001", "P002"]
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "products": [
            {
              "productId": "P001",
              "title": "クリーンアーキテクチャ",
              "author": "Robert C. Martin",
              "price": 3520,
              "imageUrl": "https://example.com/images/P001.jpg"
            },
            {
              "productId": "P002",
              "title": "リファクタリング",
              "author": "Martin Fowler",
              "price": 4840,
              "imageUrl": "https://example.com/images/P002.jpg"
            }
          ]
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "3.0.0"
    }
  }
}
```

---

## 5. ショッピングカート管理 → 注文・決済管理

### PACT 5.1: カート内容取得

```json
{
  "consumer": {
    "name": "Order & Payment"
  },
  "provider": {
    "name": "Shopping Cart"
  },
  "interactions": [
    {
      "description": "注文確認のためカート内容を取得する",
      "providerState": "ユーザー 'U001' のカートに商品が2点ある",
      "request": {
        "method": "GET",
        "path": "/api/carts/U001",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer token123"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "userId": "U001",
          "items": [
            {
              "productId": "P001",
              "quantity": 2,
              "price": 3520
            },
            {
              "productId": "P002",
              "quantity": 1,
              "price": 4840
            }
          ],
          "totalAmount": 11880
        }
      }
    },
    {
      "description": "空のカートを取得する",
      "providerState": "ユーザー 'U002' のカートが空",
      "request": {
        "method": "GET",
        "path": "/api/carts/U002",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer token456"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "userId": "U002",
          "items": [],
          "totalAmount": 0
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "3.0.0"
    }
  }
}
```

### PACT 5.2: 注文確定後のカートクリア（イベント駆動）

```json
{
  "consumer": {
    "name": "Shopping Cart"
  },
  "provider": {
    "name": "Order & Payment"
  },
  "interactions": [
    {
      "description": "注文確定イベントを受信してカートをクリアする",
      "providerState": "注文ID 'O001' が確定された",
      "contents": {
        "pact:content-type": "application/json",
        "eventType": "OrderConfirmed",
        "eventId": "e12345",
        "timestamp": "2025-11-26T10:30:00Z",
        "orderId": "O001",
        "userId": "U001"
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "4.0.0"
    },
    "type": "async"
  }
}
```

---

## 6. 注文・決済管理 → ユーザー管理

### PACT 6.1: 注文履歴取得

```json
{
  "consumer": {
    "name": "User Management"
  },
  "provider": {
    "name": "Order & Payment"
  },
  "interactions": [
    {
      "description": "ユーザーの注文履歴を取得する",
      "providerState": "ユーザー 'U001' が2件の注文履歴を持つ",
      "request": {
        "method": "GET",
        "path": "/api/orders",
        "query": "userId=U001",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer token123"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "userId": "U001",
          "orders": [
            {
              "orderId": "O002",
              "orderDate": "2025-11-26T10:30:00Z",
              "totalAmount": 8360,
              "status": "completed"
            },
            {
              "orderId": "O001",
              "orderDate": "2025-11-20T14:15:00Z",
              "totalAmount": 11880,
              "status": "completed"
            }
          ]
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "3.0.0"
    }
  }
}
```

### PACT 6.2: 注文詳細取得

```json
{
  "consumer": {
    "name": "User Management"
  },
  "provider": {
    "name": "Order & Payment"
  },
  "interactions": [
    {
      "description": "特定の注文の詳細情報を取得する",
      "providerState": "注文ID 'O001' が存在する",
      "request": {
        "method": "GET",
        "path": "/api/orders/O001",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer token123"
        }
      },
      "response": {
        "status": 200,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "orderId": "O001",
          "userId": "U001",
          "orderDate": "2025-11-20T14:15:00Z",
          "status": "completed",
          "items": [
            {
              "productId": "P001",
              "productTitle": "クリーンアーキテクチャ",
              "quantity": 2,
              "price": 3520,
              "subtotal": 7040
            },
            {
              "productId": "P002",
              "productTitle": "リファクタリング",
              "quantity": 1,
              "price": 4840,
              "subtotal": 4840
            }
          ],
          "shippingAddress": {
            "name": "山田太郎",
            "postalCode": "100-0001",
            "address": "東京都千代田区千代田1-1",
            "phone": "03-1234-5678"
          },
          "totalAmount": 11880
        }
      }
    }
  ],
  "metadata": {
    "pactSpecification": {
      "version": "3.0.0"
    }
  }
}
```

---

## イベント駆動契約の一覧

### イベントフロー図

```
Order & Payment ─[OrderConfirmed]→ Inventory Management
                                 → Shopping Cart

Inventory Management ─[InventoryReserved]→ Order & Payment
                     ─[InventoryDepleted]→ Product Catalog
```

### イベント定義

#### OrderConfirmed イベント

```json
{
  "eventType": "OrderConfirmed",
  "schema": {
    "eventId": "string (UUID)",
    "timestamp": "string (ISO 8601)",
    "orderId": "string",
    "userId": "string",
    "items": [
      {
        "productId": "string",
        "quantity": "integer"
      }
    ],
    "totalAmount": "number"
  },
  "publishers": ["Order & Payment"],
  "subscribers": ["Inventory Management", "Shopping Cart"]
}
```

#### InventoryReserved イベント

```json
{
  "eventType": "InventoryReserved",
  "schema": {
    "eventId": "string (UUID)",
    "timestamp": "string (ISO 8601)",
    "orderId": "string",
    "reserved": "boolean",
    "items": [
      {
        "productId": "string",
        "quantity": "integer",
        "remainingStock": "integer"
      }
    ]
  },
  "publishers": ["Inventory Management"],
  "subscribers": ["Order & Payment"]
}
```

#### InventoryDepleted イベント

```json
{
  "eventType": "InventoryDepleted",
  "schema": {
    "eventId": "string (UUID)",
    "timestamp": "string (ISO 8601)",
    "productId": "string",
    "previousQuantity": "integer",
    "currentQuantity": "integer"
  },
  "publishers": ["Inventory Management"],
  "subscribers": ["Product Catalog"]
}
```

---

## PACT テストの実装ガイドライン

### 1. テストの実行順序

1. **Provider 側のテスト**: 各ユニットが契約通りのAPIを提供していることを確認
2. **Consumer 側のテスト**: 各ユニットが契約通りにAPIを利用していることを確認
3. **統合テスト**: 実際のシステムで契約が守られていることを確認

### 2. Provider State の管理

各プロバイダーは、テスト用の状態をセットアップするエンドポイントを提供する必要があります：

```
POST /pact-states
{
  "state": "商品ID 'P001' が在庫10冊で存在する"
}
```

### 3. 非同期イベントのテスト

- メッセージブローカー（RabbitMQ, Kafka等）を使用する場合、PACT v4の非同期メッセージング契約を使用
- イベントのスキーマと構造を検証
- イベントの順序保証が必要な場合は、追加の契約を定義

### 4. バージョニング戦略

- PACT定義にバージョン番号を含める
- 後方互換性のない変更を行う際は、新しいバージョンのPACTを作成
- 古いバージョンのサポート期間を明確にする

### 5. CI/CDパイプラインへの統合

1. 各ユニットのビルド時にConsumer PACTテストを実行
2. PACTファイルをPact Brokerに公開
3. Provider側のビルド時に、公開されたPACTに対してProviderテストを実行
4. すべてのPACTテストが成功した場合のみデプロイを許可

---

## 関連ドキュメント

- [コンテキストマップ](context_map.md)
- [ユニット1: 商品カタログ管理](units/01_product_catalog.md)
- [ユニット2: ショッピングカート管理](units/02_shopping_cart.md)
- [ユニット3: 注文・決済管理](units/03_order_payment.md)
- [ユニット4: ユーザー管理](units/04_user_management.md)
- [ユニット5: 在庫管理](units/05_inventory_management.md)

---

*最終更新: 2025-11-26*
