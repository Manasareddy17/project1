import { Module } from "@nestjs/common";
import { PdfController } from "./pdf.controller";
import { PdfService } from "./pdf.service";
import {PdfFunctionsService } from "./pdfFunctions.service";

@Module({
    imports:[],
    controllers:[PdfController],
    providers:[PdfService,PdfFunctionsService]
})
export class pdfModule{}