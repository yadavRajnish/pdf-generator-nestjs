import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { generatePDF } from './PDFGenerator';
import { Temp } from './Templates';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('pdf')
  async getPDFGenerate(@Res() response: Response) {
    try {
      const markup = renderToStaticMarkup(
        createElement(Temp, { test: 'test' }),
      );

      const style = fs
        .readFileSync(process.cwd() + '/src/Templates/style.css')
        .toString();

      const html = ` <!DOCTYPE html>
        <html>
          <head>
            <title>Report 1</title>
                 <style>
              ${style}
            </style>
          </head>
          <body>
           ${markup}
          </body>
        </html>`;

      const pdfBuffer = await generatePDF(html);
 

      response.header('Content-Disposition', `filename="Report.pdf"`);
      response.status(200).type('application/pdf').send(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      response.status(500).send('Error generating PDF');
    }
  }
}
