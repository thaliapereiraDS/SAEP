"use client";

import { useEffect, useState } from "react";

export default function StockMovementPage() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [operationType, setOperationType] = useState("Input");
  const [operationDate, setOperationDate] = useState("");

  const [message, setMessage] = useState("");
  const [alertLow, setAlertLow] = useState(false);

  const userId = localStorage.getItem("userId");
  console.log(userId);


  // Carrega produtos em ordem alfabética
  useEffect(() => {
    async function fetchProducts() {
      const res = await fetch("http://localhost:8000/api/products/", {
        credentials: "include",
      });

      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);

  async function registerMovement() {
    if (!productId || !quantity || !operationDate) {
      setMessage("Preencha todos os campos.");
      return;
    }

    const res = await fetch("http://localhost:8000/api/stock/movement/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        product: productId,
        quantity_moved: quantity,
        operation_type: operationType,
        operation_date: operationDate,
        movement_responsible: userId,
      }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
    setAlertLow(data.low_stock_alert || false);
  }

  return (
    <div className="min-h-screen bg-rose-50 p-10">
      <div className="w-fit mx-auto">
        <h1 className="text-2xl font-semibold text-rose-700 mb-8">
          Movimentação de Estoque
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-sm max-w-lg">
          {/* Seleção do Produto */}
          <label className="block font-medium text-sm text-rose-700">
            Produto
          </label>
          <select
            className="w-full mt-1 p-2 border rounded"
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">Selecione um produto</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Tipo */}
          <label className="block mt-4 font-medium text-sm text-rose-700">
            Tipo de Movimentação
          </label>
          <select
            className="w-full mt-1 p-2 border rounded"
            value={operationType}
            onChange={(e) => setOperationType(e.target.value)}
          >
            <option value="Input">Entrada</option>
            <option value="Output">Saída</option>
          </select>

          {/* Quantidade */}
          <label className="block mt-4 font-medium text-sm text-rose-700">
            Quantidade
          </label>
          <input
            type="number"
            min={0}
            className="w-full mt-1 p-2 border rounded"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          {/* Data */}
          <label className="block mt-4 font-medium text-sm text-rose-700">
            Data da Movimentação
          </label>
          <input
            type="datetime-local"
            className="w-full mt-1 p-2 border rounded"
            onChange={(e) => setOperationDate(e.target.value)}
          />

          <button
            onClick={registerMovement}
            className="mt-6 w-full bg-rose-700 text-white py-2 rounded hover:bg-rose-600"
          >
            Registrar Movimentação
          </button>

          {/* Mensagem */}
          {message && (
            <p className="mt-4 text-sm font-medium text-gray-700">{message}</p>
          )}

          {/* Alerta */}
          {alertLow && (
            <p className="mt-2 text-sm text-red-600 font-semibold">
              ⚠ Estoque abaixo do mínimo!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
