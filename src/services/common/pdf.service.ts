import { Injectable } from '@nestjs/common';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TableCell, TDocumentDefinitions } from 'pdfmake/interfaces';

// Use TDocumentDefinitions from pdfmake for better type safety
export type PdfDocumentDefinition = TDocumentDefinitions;

export interface PdfOptions {
  filename?: string;
  format?: 'buffer' | 'stream' | 'base64';
}

@Injectable()
export class PdfService {
  constructor() {
    pdfMake.vfs = pdfFonts.vfs;
  }
  async generatePdf(
    documentDefinition: PdfDocumentDefinition,
    options: PdfOptions = {},
  ): Promise<Buffer | string> {
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = pdfMake.createPdf(documentDefinition);

        if (options.format === 'base64') {
          pdfDoc.getBase64((data) => {
            resolve(data);
          });
        } else {
          pdfDoc.getBuffer((buffer) => {
            resolve(buffer);
          });
        }
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  async generatePdfStream(
    documentDefinition: PdfDocumentDefinition,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const pdfDoc = pdfMake.createPdf(documentDefinition);
        resolve(pdfDoc.getStream());
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  createSimpleDocument(content: string, title?: string): PdfDocumentDefinition {
    const contentArray: Content[] = [];

    if (title) {
      contentArray.push({ text: title, style: 'header' });
    }

    contentArray.push({ text: content });

    return {
      content: contentArray,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };
  }

  createTableDocument(
    headers: string[],
    rows: TableCell[],
    title?: string,
  ): PdfDocumentDefinition {
    const tableBody: TableCell[][] = [headers, rows];
    const contentArray: Content[] = [];

    if (title) {
      contentArray.push({ text: title, style: 'header' });
    }

    contentArray.push({
      table: {
        headerRows: 1,
        widths: Array(headers.length).fill('auto'),
        body: tableBody,
      },
    });

    return {
      content: contentArray,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 20],
        },
      },
    };
  }
}
