declare module "jspdf-autotable" {
  import type { jsPDF } from "jspdf";

  export type AutoTableTheme = "striped" | "grid" | "plain";

  export interface AutoTableStyles {
    font?: string;
    fontStyle?: "normal" | "bold" | "italic" | "bolditalic";
    fontSize?: number;
    cellPadding?: number | number[];
    cellWidth?: number | "wrap" | "auto";
    textColor?: number | string | number[];
    fillColor?: number | string | number[];
    lineColor?: number | string | number[];
    lineWidth?: number;
    halign?: "left" | "center" | "right" | "justify";
    valign?: "top" | "middle" | "bottom";
  }

  export interface AutoTableMarginConfig {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }

  export interface AutoTableHookData {
    table: {
      finalY: number;
    };
    doc: jsPDF;
    pageNumber: number;
  }

  export interface AutoTableOptions {
    startY?: number;
    theme?: AutoTableTheme;
    head?: unknown[][];
    body?: unknown[][];
    styles?: AutoTableStyles;
    headStyles?: AutoTableStyles;
    bodyStyles?: AutoTableStyles;
    alternateRowStyles?: AutoTableStyles;
    columnStyles?: Record<string | number, AutoTableStyles>;
    margin?: number | AutoTableMarginConfig;
    showHead?: "everyPage" | "firstPage" | "never";
    showFoot?: "everyPage" | "lastPage" | "never";
    didDrawPage?: (hookData: AutoTableHookData) => void;
  }

  export default function autoTable(doc: jsPDF, options: AutoTableOptions): void;
}

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number;
    };
  }
}
