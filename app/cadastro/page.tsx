"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login/login.module.css';

export default function CadastroPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Novos estados para os Termos de Uso
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trava de segurança extra
    if (!termsAccepted) {
      setError('Você precisa aceitar os Termos de Uso para continuar.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://aulastrapi.onrender.com/api/auth/local/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.jwt) {
        localStorage.setItem('token', data.jwt);
        router.push('/');
      } else {
        setError(data.error?.message || 'Erro ao criar conta.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
      console.error('Erro no cadastro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Função disparada quando o usuário clica no "OK" dentro do Modal
  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    setShowTerms(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Criar Nova Conta</h1>
        
        <form onSubmit={handleRegister}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>Nome de Usuário</label>
            <input
              type="text"
              id="username"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input
              type="email"
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
              minLength={6}
            />
          </div>

          {/* Caixinha dos Termos de Uso (Agora Blindada!) */}
          <div className={styles.checkboxGroup}>
            <input 
              type="checkbox" 
              checked={termsAccepted}
              readOnly 
              onClick={() => setShowTerms(true)} /* Se tentar clicar na caixa, abre o modal */
            />
            <label>
              Li e concordo com os{' '}
              <span 
                className={styles.linkTermos} 
                onClick={() => setShowTerms(true)}
              >
                Termos de Uso
              </span>
            </label>
          </div>
          
          {/* O botão só fica ativo se a caixinha estiver marcada */}
          <button 
            type="submit" 
            className={styles.btnLogin} 
            disabled={isLoading || !termsAccepted}
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar e Entrar'}
          </button>
          
          {error && <p className={styles.errorMsg}>{error}</p>}
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link href="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 500 }}>
            Já tem uma conta? Faça Login
          </Link>
        </div>
      </div>

      {/* --- O MODAL DOS TERMOS DE USO --- */}
      {showTerms && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Termos de Uso</h2>
            <div className={styles.modalText}>
              <p><strong>1. Aceitação dos Termos</strong></p>
              <p>Ao acessar e utilizar o App da Turma, você concorda em cumprir estes termos e condições.</p>
              <br />
              <p><strong>2. Uso do Sistema</strong></p>
              <p>Este sistema é de uso exclusivo para fins educacionais. É proibido o cadastro de informações ofensivas ou irreais.</p>
              <br />
              <p><strong>3. Privacidade dos Dados</strong></p>
              <p>As fotos (avatares) e notas cadastradas são de responsabilidade do usuário e ficam armazenadas em nosso servidor (Strapi).</p>
              <br />
              <p><strong>4. Encerramento de Conta</strong></p>
              <p>O professor se reserva o direito de excluir qualquer conta que viole as regras do laboratório.</p>
            </div>
            
            <button type="button" className={styles.btnLogin} onClick={handleAcceptTerms}>
              OK, Eu concordo
            </button>
          </div>
        </div>
      )}

    </div>
  );
}