"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header/Header';
import styles from './menu.module.css';

export default function MenuPrincipal() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.replace('/login');
  }, [router]);

  // Verificação de segurança: Só fica aqui se estiver logado
  return (
    <main>
      <Header />
      
      <div className={styles.container}>
        <h2 className={styles.title}>O que você deseja fazer?</h2>
        
        <div className={styles.cardsContainer}>
          {/* Cartão 1: Vai para a rota que movemos no Passo 1 */}
          <Link href="/alunos" className={styles.optionCard}>
            <div className={styles.icon}>👥</div>
            <div className={styles.cardTitle}>Ver Todos os Alunos</div>
            <div className={styles.cardDesc}>
              Visualizar a grade completa de alunos cadastrados na turma do Senac.
            </div>
          </Link>

          {/* Cartão 2: Vai para uma futura rota de busca */}
          <Link href="/buscar" className={styles.optionCard}>
            <div className={styles.icon}>🔍</div>
            <div className={styles.cardTitle}>Buscar Aluno Específico</div>
            <div className={styles.cardDesc}>
              Pesquisar um aluno específico para consultar suas notas e informações.
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
