// Funções utilitárias do projeto

export const formatTimestamp = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('pt-BR');
};

export const calculateMouthRatio = (
  _landmarks: Array<{ x: number; y: number; z: number }>
): number => {
  // Implementação será adicionada na Fase 4
  return 0;
};

export const isOnline = (): Promise<boolean> => {
  // Implementação será adicionada na Fase 5
  return Promise.resolve(true);
};
