"use client";

import { useRouter } from 'next/navigation';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login'); // Redireciona para a página de login
  };

  return (
    <header className={styles.header}>
      <h1>Alunos Cadastrados</h1>
      <div className={styles.logoutContainer}>
        <button onClick={handleLogout} className={styles.btnSair}>
          Sair
        </button>
      </div>
    </header>
  );
}