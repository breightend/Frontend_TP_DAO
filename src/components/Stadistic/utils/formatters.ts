export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("es-AR").format(value);
};

export const formatDate = (value: string): string => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatPeriodo = (periodo: string): string => {
  // Convert "2024-Q1" to "2024 - Trimestre 1"
  const match = periodo.match(/^(\d{4})-Q(\d)$/);
  if (match) {
    const [, year, quarter] = match;
    return `${year} - Trimestre ${quarter}`;
  }
  return periodo;
};

export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Error desconocido";
}
