"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Importação do Link para o botão voltar
import Header from '@/components/Header/Header';
import StudentCard from '@/components/StudentCard/StudentCard';
import styles from './buscar.module.css';

export default function BuscarAlunoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [resultados, setResultados] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.replace('/login');
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return; 

    setIsLoading(true);
    setHasSearched(true);

    try {
      const token = localStorage.getItem('token');
      const url = `https://aulastrapi.onrender.com/api/alunos?filters[nome][$containsi]=${searchTerm}&populate=*`;
      
      const response = await fetch(url, {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        router.replace('/login');
        return;
      }

      if (response.ok) {
        const { data } = await response.json();
        setResultados(data);
      }
    } catch (erro) {
      console.error("Erro ao buscar aluno:", erro);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Header />
      
      <div className={styles.container}>
        
        {/* Usamos o Wrapper para manter o botão alinhado com a caixa */}
        <div className={styles.searchWrapper}>
          {/* BOTÃO VOLTAR AQUI */}
          <Link href="/" className={styles.btnVoltar}>
            &#8592; Voltar ao Menu
          </Link>

          <div className={styles.searchBox} style={{ marginBottom: 0 }}>
            <h2 style={{ marginBottom: '15px', color: '#333' }}>Buscar Aluno</h2>
            <form onSubmit={handleSearch} className={styles.formGroup}>
              <input 
                type="text" 
                className={styles.input}
                placeholder="Digite o nome do aluno..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className={styles.btnSearch} disabled={isLoading}>
                {isLoading ? 'Buscando...' : 'Pesquisar'}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.resultsGrid}>
          {resultados.length > 0 ? (
            resultados.map((aluno) => (
              <StudentCard 
                key={aluno.id}
                documentId={aluno.documentId}
                nome={aluno.nome}
                turma={aluno.turma}
                nota={aluno.nota}
                foto={aluno.foto}
                modulos={aluno.modulos}
              />
            ))
          ) : (
            hasSearched && !isLoading && (
              <p className={styles.message}>Nenhum aluno encontrado com o nome "{searchTerm}".</p>
            )
          )}
        </div>
      </div>
    </main>
  );
}
