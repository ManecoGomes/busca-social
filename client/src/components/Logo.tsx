interface LogoProps {
  className?: string;
  variant?: "full" | "icon";
  width?: number;
  height?: number;
}

export function Logo({ className = "", variant = "full", width, height }: LogoProps) {
  if (variant === "icon") {
    const size = width || height || 60;
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Círculo externo azul */}
        <path
          d="M100 20 C150 20, 180 50, 180 100 C180 150, 150 180, 100 180"
          stroke="#1E88E5"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Círculo interno verde */}
        <path
          d="M100 40 C60 40, 30 70, 30 110 C30 150, 60 180, 100 180"
          stroke="#6BB344"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Lupa - círculo */}
        <circle
          cx="95"
          cy="90"
          r="35"
          stroke="#1E88E5"
          strokeWidth="10"
          fill="none"
        />
        
        {/* Lupa - cabo */}
        <path
          d="M120 115 L145 140"
          stroke="#1E88E5"
          strokeWidth="10"
          strokeLinecap="round"
        />
        
        {/* Pin de localização */}
        <g transform="translate(125, 65)">
          <path
            d="M0 0 C-8 0, -12 4, -12 10 C-12 16, -8 20, 0 28 C8 20, 12 16, 12 10 C12 4, 8 0, 0 0 Z"
            fill="#6BB344"
          />
          <circle cx="0" cy="9" r="4" fill="white" />
        </g>
        
        {/* Detalhe curvo verde dentro da lupa */}
        <path
          d="M75 85 C75 85, 85 75, 95 75"
          stroke="#6BB344"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // Variant "full" - Logo completo com texto
  const defaultWidth = width || 300;
  const defaultHeight = height || 120;
  
  return (
    <svg
      width={defaultWidth}
      height={defaultHeight}
      viewBox="0 0 500 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ícone */}
      <g transform="translate(50, 20)">
        {/* Círculo externo azul */}
        <path
          d="M50 5 C87.5 5, 115 27.5, 115 55 C115 82.5, 87.5 105, 50 105"
          stroke="#1E88E5"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Círculo interno verde */}
        <path
          d="M50 15 C30 15, 10 35, 10 55 C10 75, 30 95, 50 95"
          stroke="#6BB344"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Lupa - círculo */}
        <circle
          cx="47"
          cy="47"
          r="22"
          stroke="#1E88E5"
          strokeWidth="7"
          fill="none"
        />
        
        {/* Lupa - cabo */}
        <path
          d="M62 62 L78 78"
          stroke="#1E88E5"
          strokeWidth="7"
          strokeLinecap="round"
        />
        
        {/* Pin de localização */}
        <g transform="translate(68, 32)">
          <path
            d="M0 0 C-5 0, -7.5 2.5, -7.5 6 C-7.5 9.5, -5 12, 0 17 C5 12, 7.5 9.5, 7.5 6 C7.5 2.5, 5 0, 0 0 Z"
            fill="#6BB344"
          />
          <circle cx="0" cy="5.5" r="2.5" fill="white" />
        </g>
        
        {/* Detalhe curvo verde dentro da lupa */}
        <path
          d="M37 44 C37 44, 43 38, 48 38"
          stroke="#6BB344"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Texto "Busca" em verde */}
      <text
        x="165"
        y="95"
        fontFamily="Arial, sans-serif"
        fontSize="58"
        fontWeight="bold"
        fill="#6BB344"
      >
        Busca
      </text>

      {/* Texto "Social" em azul - espaçado */}
      <text
        x="340"
        y="95"
        fontFamily="Arial, sans-serif"
        fontSize="58"
        fontWeight="bold"
        fill="#1E88E5"
      >
        Social
      </text>

      {/* Curva verde embaixo de "Busca" */}
      <path
        d="M165 105 Q230 115, 295 105"
        stroke="#6BB344"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
