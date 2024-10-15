"use client";
import { Box, CircularProgress, IconButton, Tooltip } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import * as actionsAbstratas from "@/lib/data/actionsAbstratas";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BtnExcluir({ id, nome, entidade }: { id: number; nome: string; entidade: "Cliente" | "Projeto" | "Tarefa" }) {
  const { push } = useRouter();
  const [ loading, setLoading ] = useState(false);
  const excluir = async () => {
    if (confirm(`Excluir ${nome}?`)) {
      setLoading(true);
      await actionsAbstratas.excluir4Btn(entidade, id);
      alert(`${entidade} excluida(o)`);
      setLoading(false);
      push("/tarefas")
    }
  };

  const ButtonWithProgress = () => {
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress
          size={40}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-20px', // Metade do tamanho para centralizar
            marginLeft: '-20px',
            zIndex: 1, // CircularProgress por baixo
          }}
        />
        <DeleteForeverIcon
          sx={{
            position: 'relative',
            zIndex: 2, // Botão por cima
          }}
        />
      </Box>
    );
  }

  return (
    <Tooltip title={entidade}>
      <IconButton size="small" onClick={excluir}>
        { loading ? <ButtonWithProgress /> : <DeleteForeverIcon />}        
      </IconButton>
    </Tooltip>
  );
}
