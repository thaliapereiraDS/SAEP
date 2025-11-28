'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Erro ao fazer login");
                return;
            }

            localStorage.setItem("user", username);
            localStorage.setItem("userId", data.id); // Armazena o ID do usuário

            router.push("/"); // Redireciona pós-login
        } catch (err) {
            setError("Erro de conexão com o servidor.");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-grayCustom-50">
            <div className="w-full max-w-md bg-white border border-grayCustom-100 p-8">

                <h1 className="text-3xl font-semibold text-rose-700 text-center mb-6">
                    ProTools
                </h1>

                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block mb-1 text-grayCustom-600">Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border border-grayCustom-300 focus:outline-none focus:border-rose-500"
                            placeholder="Digite seu usuário"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-grayCustom-600">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-grayCustom-300 focus:outline-none focus:border-rose-500"
                            placeholder="Digite sua senha"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 bg-rose-500 hover:bg-rose-700 transition text-white font-medium"
                    >
                        Entrar
                    </button>
                </form>

                <p className="text-center text-grayCustom-600 text-sm mt-5">
                    © {new Date().getFullYear()}  ProTools
                </p>
            </div>
        </div>
    );
}
