'use client'

import Link from "next/dist/client/link";
import { useEffect, useState } from "react";

export default function Header() {
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // Evita erro no SSR
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUsername(storedUser);
            }
        }

        // Listener caso user seja alterado em outra parte da app
        const handler = () => {
            const updatedUser = localStorage.getItem("user");
            setUsername(updatedUser);
        };

        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    return (
        <header className="w-full px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-rose-700">
                ProTools
            </h1>
            <nav>
                <ul className="flex gap-2">
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/products">Produtos</Link>
                    </li>
                    <li>
                        <Link href="/estoque">Estoque</Link>
                    </li>
                </ul>
            </nav>
            

            <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center font-semibold uppercase">
                    {username ? username.charAt(0) : "?"}
                </div>

                <span className="text-gray-700 font-medium">
                    {username ? username : "Carregando..."}
                </span>
                <span>
                    <Link
                        href="/login"
                        className="text-rose-600 hover:underline ml-4"
                        onClick={() => {
                            localStorage.clear();
                        }}
                    >
                        Sair
                    </Link>
                </span>
            </div>
        </header>
    );
}
