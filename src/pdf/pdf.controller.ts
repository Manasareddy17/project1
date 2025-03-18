import { Body, Controller, Get, Logger, Post, Query, Res } from "@nestjs/common";
import { PdfService } from "./pdf.service";
import { Response } from "express";


@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) { }
  private logger = new Logger(this.constructor.name)
  @Post('generateDyn')
  async generateDynPdf(@Query('hasIgst') hasIgst: boolean, @Res() res: Response, @Body() body: any) {

    const data = {
      hasIgst: false,
      buyerDetails: {
        name: "Hyderabad Construction Company",
        addressLine1: "Hyderabad Address Line - 11 Hyderabad Address Line - 2",
        addressLine2: "Hyderabad, Telangana, 500064",
        country: "India",
        gstin: "29GGGGG1314R9Z9",
        pan: "ABCTY1934W",
        cin: "L17110MH1973PLC019700",
      },
      purchaseOrderDetails: {
        purchaseNumber: "PO/2024/12/000006",
        purchaseDate: "26-Dec-2024",
        terms: "Credit",
        creditDays: "90",
        placeofSupply: "Hyderabad",
        expectedShipmentDate: "31-Dec-2024",
        deliveryAddressString: "Hyderabad Address Line - 11,",
        addressLine1: "Hyderabad Address Line - 2,",
        city: " Hyderabad, Telangana, 500064,",
        country: "India",
        contactPerson: "Hyderabad Person",
        mobileNumber: "8297614167",

      },
      supplierDetails: {
        companyName: "Shree TMT",
        addressLine1: "TestAddress",
        addressLine2: "Hyderabad, Telangana, India, 500064",
        gstin: "29GGGGG1314R9Z9",
        pan: "ABCTY1234B",
        cin: "L17110MH1973PLC010796",
      },
      prOrder1: body.prOrder1,
      title: body.title,
      igst: body.Igst,
      cgst: body.cgst,
      materials: body.materials,
      
    };
    console.log(data.igst);
    
    try {
      const pdfBuffer = await this.pdfService.generate(data.hasIgst, data, body);
      //  this.logger.debug(`PDF Generated Successfully,${pdfBuffer}`);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=sample.pdf',
      });
      res.send(pdfBuffer);
    } catch (error) {
      this.logger.error('PDF Generation Failed', error);
      res.status(500).send('PDF Generation Failed');
    }
  }

 @Get('generateStaticPdf')
 async genratestcPdf(@Query('hasIgst') hasIgst: boolean, @Res() res: Response){
  const data = {
    hasIgst: false,
    buyerDetails: {
      name: "Hyderabad Construction Company",
      addressLine1: "Hyderabad Address Line - 11 Hyderabad Address Line - 2",
      addressLine2: "Hyderabad, Telangana, 500064",
      country: "India",
      gstin: "29GGGGG1314R9Z9",
      pan: "ABCTY1934W",
      cin: "L17110MH1973PLC019700",
    },
    purchaseOrderDetails: {
      purchaseNumber: "PO/2024/12/000006",
      purchaseDate: "26-Dec-2024",
      terms: "Credit",
      creditDays: "90",
      placeofSupply: "Hyderabad",
      expectedShipmentDate: "31-Dec-2024",
      deliveryAddressString: "Hyderabad Address Line - 11,",
      addressLine1: "Hyderabad Address Line - 2,",
      city: " Hyderabad, Telangana, 500064,",
      country: "India",
      contactPerson: "Hyderabad Person",
      mobileNumber: "8297614167",

    },
    supplierDetails: {
      companyName: "Shree TMT",
      addressLine1: "TestAddress",
      addressLine2: "Hyderabad, Telangana, India, 500064",
      gstin: "29GGGGG1314R9Z9",
      pan: "ABCTY1234B",
      cin: "L17110MH1973PLC010796",
    },
  
    materials1: [
      { sno: 1, name: "Material 1", hsn: 123443, qty: 10, rate: 90.00, cgst: 6, sgst: 6, total: 1000 },
      { sno: 2, name: "Material 2", hsn: 123443, qty: 5, rate: 90.00, cgst: 0, total: 1000 },
      { sno: 3, name: "Material 3", hsn: 123443, qty: 20, rate: 90.00, total: 1000 },
      { sno: 4, name: "Material 4", hsn: 123443, qty: 8, rate: 90.00, total: 1200 },
      { sno: 5, name: "Material 5", hsn: 123443, qty: 15, rate: 90.00, total: 900 },
      { sno: 6, name: "Material 6", hsn: 123443, qty: 7, rate: 90.00, total: 2100 },
      { sno: 7, name: "Material 7", hsn: 123443, qty: 10, rate: 90.00, total: 750 },
      { sno: 8, name: "Material 8", hsn: 123443, qty: 12, rate: 90.00, total: 1440 },
      { sno: 9, name: "Material 9", hsn: 123443, qty: 6, rate: 90.00, total: 480 },
      { sno: 10, name: "Material 10", hsn: 123443, qty: 9, rate: 90.00, total: 810 },
      { sno: 1, name: "Material 1", hsn: 123443, qty: 10, rate: 90.00, total: 1000 },
      { sno: 2, name: "Material 2", hsn: 123443, qty: 5, rate: 90.00, total: 1000 },
      { sno: 3, name: "Material 3", hsn: 123443, qty: 20, rate: 90.00, total: 1000 },
      { sno: 4, name: "Material 4", hsn: 123443, qty: 8, rate: 90.00, total: 1200 },
      { sno: 5, name: "Material 5", hsn: 123443, qty: 15, rate: 90.00, total: 900 },
      { sno: 6, name: "Material 6", hsn: 123443, qty: 7, rate: 90.00, total: 2100 },
      { sno: 7, name: "Material 7", hsn: 123443, qty: 10, rate: 90.00, total: 750 },
      { sno: 8, name: "Material 8", hsn: 123443, qty: 12, rate: 90.00, total: 1440 },
      { sno: 9, name: "Material 9", hsn: 123443, qty: 6, rate: 90.00, total: 480 },
      { sno: 10, name: "Material 10", hsn: 123443, qty: 9, rate: 90.00, total: 810 },
      { sno: 1, name: "Material 1", hsn: 123443, qty: 10, rate: 90.00, total: 1000 },
      { sno: 2, name: "Material 2", hsn: 123443, qty: 5, rate: 90.00, total: 1000 },
      { sno: 3, name: "Material 3", hsn: 123443, qty: 20, rate: 90.00, total: 1000 },
      { sno: 4, name: "Material 4", hsn: 123443, qty: 8, rate: 90.00, total: 1200 },
      { sno: 5, name: "Material 5", hsn: 123443, qty: 15, rate: 90.00, total: 900 },
      { sno: 6, name: "Material 6", hsn: 123443, qty: 7, rate: 90.00, total: 2100 },
      { sno: 7, name: "Material 7", hsn: 123443, qty: 10, rate: 90.00, total: 750 },
      { sno: 8, name: "Material 8", hsn: 123443, qty: 12, rate: 90.00, total: 1440 },
      { sno: 9, name: "Material 9", hsn: 123443, qty: 6, rate: 90.00, total: 480 },
      { sno: 10, name: "Material 10", hsn: 123443, qty: 9, rate: 90.00, total: 810 },
      { sno: 1, name: "Material 1", hsn: 123443, qty: 10, rate: 90.00, total: 1000 },
      { sno: 2, name: "Material 2", hsn: 123443, qty: 5, rate: 90.00, total: 1000 },
      { sno: 3, name: "Material 3", hsn: 123443, qty: 20, rate: 90.00, total: 1000 },
      { sno: 4, name: "Material 4", hsn: 123443, qty: 8, rate: 90.00, total: 1200 },
      { sno: 5, name: "Material 5", hsn: 123443, qty: 15, rate: 90.00, total: 900 },
      { sno: 6, name: "Material 6", hsn: 123443, qty: 7, rate: 90.00, total: 2100 },
      { sno: 7, name: "Material 7", hsn: 123443, qty: 10, rate: 90.00, total: 750 },
      { sno: 8, name: "Material 8", hsn: 123443, qty: 12, rate: 90.00, total: 1440 },
      { sno: 9, name: "Material 9", hsn: 123443, qty: 6, rate: 90.00, total: 480 },
      { sno: 10, name: "Material 10", hsn: 123443, qty: 9, rate: 90.00, total: 810 },
      { sno: 1, name: "Material 1", hsn: 123443, qty: 10, rate: 90.00, total: 1000 },
      { sno: 2, name: "Material 2", hsn: 123443, qty: 5, rate: 90.00, total: 1000 },
      { sno: 3, name: "Material 3", hsn: 123443, qty: 20, rate: 90.00, total: 1000 },
      { sno: 4, name: "Material 4", hsn: 123443, qty: 8, rate: 90.00, total: 1200 },
      // { sno: 5, name: "Material 5", hsn:123443,qty: 15, rate:90.00, total: 900 },
      // { sno: 6, name: "Material 6", hsn:123443,qty: 7, rate:90.00, total: 2100 },
      // { sno: 7, name: "Material 7", hsn:123443,qty: 10, rate:90.00, total: 750 },
      // { sno: 8, name: "Material 8", hsn:123443,qty: 12, rate:90.00, total: 1440 },
      // { sno: 9, name: "Material 9", hsn:123443,qty: 6, rate:90.00, total: 480 },
      // { sno: 10, name: "Material 10", hsn:123443,qty: 9, rate:90.00, total: 810 },


    ]

  };
  try {
    const pdfBuffer = await this.pdfService.generateStc(data.hasIgst, data);
    //  this.logger.debug(`PDF Generated Successfully,${pdfBuffer}`);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=sample.pdf',
    });
    res.send(pdfBuffer);
  } catch (error) {
    this.logger.error('PDF Generation Failed', error);
    res.status(500).send('PDF Generation Failed');
  }
  
 }

}