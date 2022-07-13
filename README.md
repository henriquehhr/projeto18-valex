## ↪️ Rotas

```yml
POST /cards/new
    - Rota para criar um novo cartão
    - headers: { "x-api-key": "xxxxxxx" }
    - body:{
        "employeeId": 1,
        "cardType": "groceries"
      }
```

```yml
PUT /cards/activate
    - Rota para ativar cartão
    - headers: {}
    - body:{
        "cardId": 1,
        "CVV": "123",
        "password": "1234"
      }
```

   ```yml
GET /cards/:cardId/balance
    - Rota para visualizar o extrato do cartão
    - headers: {}
    - body:{}
```

```yml 
PUT /cards/freeze
    - Rota para bloquear o cartão
    - headers: {}
    - body: {
        "cardId": 1,
        "password": "1234"
      }
```
    
```yml 
PUT /cards/unfreeze
    - Rota para desbloquear o cartão
    - headers: {}
    - body: {
        "cardId": 1,
        "password": "1234"
      }
```

```yml 
POST /payments
    - Rota para inserir uma nova compra
    - headers: {}
    - body: {
        "cardId": 1,
        "businessId": 1,
        "amount": 50000,
        "password": "1234"
      }
```

```yml 
POST /recharges
    - Rota para inserir uma nova recarga
    - headers: { "x-api-key": "xxxxxxx" }
    - body: {
        "cardId": 1,
        "amount": 50000
      }
```