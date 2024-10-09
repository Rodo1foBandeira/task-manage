// Exemplo de um botão de logout em um componente React
"use client";
import { IconButton, Tooltip, TooltipProps } from "@mui/material";
import { signOut } from "next-auth/react";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const LogoutButton = ({ ...props } : Omit<TooltipProps, "children" | "title">) => {
  const handleSignOut = () => {
    confirm("Deseja realmente deslogar?") &&
      signOut({
        callbackUrl: "/", // Redireciona para a página de login ou onde desejar
      });
  };

  return (
    <Tooltip title="Sair" { ...props }>
      <IconButton aria-label="editar tarefa" size="small" onClick={handleSignOut}>
        <ExitToAppIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LogoutButton;
