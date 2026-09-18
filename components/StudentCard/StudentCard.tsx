"use client";

import { useState } from 'react';
import styles from './StudentCard.module.css';

// 1. Atualizamos a tipagem para receber o array de módulos
interface StudentProps {
  documentId: string;
  nome: string;
  turma: string;
  nota: number;
  foto?: {
    url: string;
  };
  modulos?: {
    documentId: string;
    nome: string;
  }[]; // Array de objetos contendo o ID e o Nome do módulo
}

const STRAPI_BASE_URL = 'https://aulastrapi.onrender.com';

export default function StudentCard({ documentId, nome, turma, nota, foto, modulos }: StudentProps) {
  const [showNota, setShowNota] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNota, setCurrentNota] = useState(nota);
  const [isSaving, setIsSaving] = useState(false);

  // Se o aluno tiver foto, usa o link direto do Cloudinary. Se não, usa o Avatar.
  const fotoUrl = foto?.url 
    ? foto.url 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=0D8ABC&color=fff&size=128`;

  const handleSaveNota = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://aulastrapi.onrender.com/api/alunos/${documentId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { nota: Number(currentNota) }
        })
      });

      if (response.ok) {
        setIsEditing(false);
        alert('Nota atualizada com sucesso!');
      } else {
        alert('Erro ao atualizar. Verifique as permissões.');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro de conexão.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.avatarContainer}>
        <img src={fotoUrl} alt={`Foto de ${nome}`} />
      </div>
      
      <div className={styles.info}>
        <div className={styles.nome}>{nome}</div>
        <div className={styles.turma}>Turma: {turma}</div>

        {/* 2. RENDERIZAÇÃO DOS MÓDULOS (BADGES) */}
        {modulos && modulos.length > 0 && (
          <div className={styles.badgesContainer}>
            {modulos.map((modulo) => (
              <span key={modulo.documentId} className={styles.badge}>
                {modulo.nome}
              </span>
            ))}
          </div>
        )}
        
        <button 
          className={showNota ? styles.btnNotaActive : styles.btnNota} 
          onClick={() => setShowNota(!showNota)}
        >
          {showNota ? 'Ocultar Nota' : 'Ver Nota'}
        </button>
        
        {/* Lógica de Nota/Edição continua igualzinha... */}
        {showNota && !isEditing && (
          <div className={styles.notaDisplay}>
            Nota: {currentNota}
            <button className={styles.btnEditInline} onClick={() => setIsEditing(true)}>
              ✏️ Editar Nota
            </button>
          </div>
        )}

        {showNota && isEditing && (
          <div className={styles.editContainer}>
            <input 
              type="number" 
              step="0.1" 
              className={styles.inputNota}
              value={currentNota}
              onChange={(e) => setCurrentNota(Number(e.target.value))}
            />
            <div className={styles.actionButtons}>
              <button className={styles.btnSave} onClick={handleSaveNota} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
              <button className={styles.btnCancel} onClick={() => { setIsEditing(false); setCurrentNota(nota); }} disabled={isSaving}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
