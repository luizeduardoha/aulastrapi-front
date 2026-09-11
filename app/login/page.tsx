"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://aulastrapi.onrender.com/api/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        // Sucesso! Salva o token no navegador
        localStorage.setItem('token', data.jwt);
        // Manda o usuário para a tela dos alunos (nossa Home)
        router.push('/');
      } else {
        // O Strapi retorna erro se as credenciais forem inválidas
        setError('E-mail ou senha inválidos.');
      }
    } catch (err) {
      setError('Erro de conexão. O servidor (Strapi) está rodando?');
      console.error('Erro no login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Acesso Restrito</h1>
        
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Usuário ou E-mail</label>
            <input
              type="text"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Senha</label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className={styles.btnLogin} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          
          
          {error && <p className={styles.errorMsg}>{error}</p>}
        </form>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/cadastro" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}