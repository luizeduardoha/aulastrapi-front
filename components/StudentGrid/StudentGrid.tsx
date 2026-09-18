"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StudentCard from '../StudentCard/StudentCard';
import styles from './StudentGrid.module.css';

const API_URL = 'https://aulastrapi.onrender.com/api/alunos?populate=*';

export default function StudentGrid() {
  const [students, setStudents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const response = await fetch(API_URL, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          router.replace('/login');
          return;
        }

        if (response.status === 403) {
          setError('Seu usuário está autenticado, mas não tem permissão para consultar os alunos.');
          return;
        }

        if (!response.ok) throw new Error('Falha ao conectar à API');
        
        const { data } = await response.json();
        setStudents(data);
      } catch (err) {
        setError('Erro ao carregar os alunos. Verifique se a API no Strapi está rodando.');
        console.error(err);
      }
    };

    fetchStudents();
  }, [router]);

  if (error) {
    return <p className={styles.errorMsg}>{error}</p>;
  }

  return (
    <div className={styles.gridContainer}>
      {students.map((aluno) => (
        <StudentCard 
          key={aluno.id}
          documentId={aluno.documentId}
          nome={aluno.nome}
          turma={aluno.turma}
          nota={aluno.nota}
          foto={aluno.foto}
          modulos={aluno.modulos}
        />
      ))}
    </div>
  );
}
