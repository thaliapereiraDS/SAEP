"use client";

import { useEffect, useState } from "react";
import Header from "../components/header/page";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    // Form fields
    const [name, setName] = useState("");
    const [current, setCurrent] = useState("");
    const [minimum, setMinimum] = useState("");
    const [description, setDescription] = useState("");

    async function fetchProducts(query = "") {
        const url = query
            ? `http://localhost:8000/api/products/?name=${query}`
            : `http://localhost:8000/api/products/`;

        const res = await fetch(url, {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await res.json();
        if (res.ok) setProducts(data);
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    function openCreateModal() {
        setEditId(null);
        setName("");
        setCurrent("");
        setMinimum("");
        setDescription("");
        setModalOpen(true);
    }

    function openEditModal(product: any) {
        setEditId(product.id);
        setName(product.name);
        setCurrent(product.current_quantity);
        setMinimum(product.minimum_quantity);
        setDescription(product.description || "");
        setModalOpen(true);
    }

    async function handleSave() {
        if (!name || !current || !minimum) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        const payload = {
            name,
            current_quantity: current,
            minimum_quantity: minimum,
            description,
        };

        const url = editId
            ? `http://localhost:8000/api/products/${editId}/`
            : `http://localhost:8000/api/products/`;

        const method = editId ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            fetchProducts();
            setModalOpen(false);
        } else {
            alert("Erro ao salvar. Verifique os dados.");
        }
    }

    async function handleDelete(id: number) {
        if (!confirm("Tem certeza que deseja excluir?")) return;

        const res = await fetch(
            `http://localhost:8000/api/products/${id}/`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        if (res.ok) fetchProducts();
        else alert("Erro ao excluir");
    }

    function handleSearchSubmit() {
        fetchProducts(search);
    }

    return (
        <div className="min-h-screen bg-rose-50">
            <div className="max-w-4xl mx-auto px-6 py-10">
                <h1 className="text-2xl font-semibold text-rose-700 mb-6">
                    Produtos
                </h1>

                {/* Busca + botão criar */}
                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-white border border-rose-200"
                    />

                    <button
                        onClick={handleSearchSubmit}
                        className="px-5 py-2 rounded-lg bg-rose-700 text-white"
                    >
                        Buscar
                    </button>

                    <button
                        onClick={openCreateModal}
                        className="px-5 py-2 rounded-lg border border-rose-300 text-rose-700 bg-white hover:bg-rose-100"
                    >
                        Novo
                    </button>
                </div>

                {/* Tabela */}
                <div className="bg-white border border-rose-100 p-4 shadow-sm rounded-xl">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-rose-100/40 text-rose-700">
                                <th className="p-3 text-left">Nome</th>
                                <th className="p-3 text-left">Atual</th>
                                <th className="p-3 text-left">Mínimo</th>
                                <th className="p-3 text-left">Descrição</th>
                                <th className="p-3 text-left">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="text-gray-700">
                            {products.map((p: any) => {
                                const low = p.current_quantity < p.minimum_quantity;

                                return (
                                    <tr
                                        key={p.id}
                                        className={`border-b hover:bg-rose-50 ${low ? "bg-rose-300/20" : ""}`}
                                    >
                                        <td className="p-3">{p.name}</td>
                                        <td className={`p-3 ${low ? "text-rose-700 font-semibold" : ""}`}>
                                            {p.current_quantity}
                                        </td>
                                        <td className="p-3">{p.minimum_quantity}</td>
                                        <td className="p-3">{p.description || "—"}</td>

                                        <td className="p-3 flex gap-3">
                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="text-rose-700 hover:underline"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="text-gray-600 hover:underline"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md border border-rose-100">
                        <h2 className="text-lg font-semibold text-rose-700 mb-4">
                            {editId ? "Editar Produto" : "Novo Produto"}
                        </h2>

                        <div className="flex flex-col gap-3">
                            <input
                                className="border border-rose-200 p-2 rounded-lg"
                                placeholder="Nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <input
                                className="border border-rose-200 p-2 rounded-lg"
                                placeholder="Quantidade atual"
                                type="number"
                                value={current}
                                onChange={(e) => setCurrent(e.target.value)}
                            />

                            <input
                                className="border border-rose-200 p-2 rounded-lg"
                                placeholder="Quantidade mínima"
                                type="number"
                                value={minimum}
                                onChange={(e) => setMinimum(e.target.value)}
                            />

                            <textarea
                                className="border border-rose-200 p-2 rounded-lg"
                                placeholder="Descrição (opcional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            {/* Botões */}
                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-lg bg-rose-700 text-white"
                                >
                                    Salvar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
