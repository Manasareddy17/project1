import { Injectable, Logger } from "@nestjs/common";
import { PdfFunctionsService } from "./pdfFunctions.service";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { addFooter, addStaticContentAfterExtractTable, addStaticContentAfterTable, renderRemainingDYnRows, renderRemainingRows, sample } from "./dynamicFun.service";
import { addBorderToAllPages } from "./dynamicFun.service";
import axios from "axios";
import { title } from "process";
import { Column } from "typeorm";
// import { KeyObject } from "crypto";
@Injectable()
export class PdfService {
  constructor(private readonly pdfFunctionsService: PdfFunctionsService) { }
  private logger = new Logger(this.constructor.name);



  async generate(hasIgst, data, body): Promise<Buffer> {
    const buyerDetails = data.buyerDetails;
    const PurchaseOrderDetails = data.purchaseOrderDetails;
    const SupplierDetails = data.supplierDetails;

    const doc = new jsPDF();
    const imageUrl = 'https://imgur.com/gpIvJ1r.png';
    try {

      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      const img = 'data:image/png;base64,' + imageBuffer.toString('base64');

      // Add the image to the PDF

      const { title, SecondSectionOrgAddress, SecondSecBoldOrgAdress, MainSectionOrgAddress, addSectionHeader } = sample();

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      addBorderToAllPages(doc);

      title(doc, body.title);
      //--------buyer details----------------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(buyerDetails.name, 15, 20)

      MainSectionOrgAddress(doc, 25, [
        buyerDetails.addressLine1,
        buyerDetails.addressLine2,
        buyerDetails.gstin,
        buyerDetails.pan,
        buyerDetails.cin,

      ])
      doc.line(10, 53, 200, 53);
      const verticalLineX = pageWidth / 2;
      doc.line(verticalLineX, 57, verticalLineX, pageHeight - 200);

      //--------purchase details----------------------------------

      MainSectionOrgAddress(doc, 60, body.prOrder)

      //---purchase order details---------------------------

      const prOrder1 = data.prOrder1
      console.log(prOrder1)
      SecondSectionOrgAddress(doc, 60, prOrder1)
      // console.log(SecondSecBoldOrgAdress1)

      //---purchaseOrder details left side---------------------------
      SecondSecBoldOrgAdress(doc, [
        [PurchaseOrderDetails.purchaseNumber, 55, 60],
        [PurchaseOrderDetails.purchaseDate, 55, 65],
        [PurchaseOrderDetails.terms, 55, 70],
        [PurchaseOrderDetails.creditDays, 55, 75],
        [PurchaseOrderDetails.placeofSupply, 150, 60],
        [PurchaseOrderDetails.expectedShipmentDate, 150, 65],
        [PurchaseOrderDetails.deliveryAddressString, 150, 70],
        [PurchaseOrderDetails.addressLine1, 150, 75],
        [PurchaseOrderDetails.city, 150, 80],
        [PurchaseOrderDetails.country, 150, 85],
        [PurchaseOrderDetails.contactPerson, 150, 90],
        [PurchaseOrderDetails.mobileNumber, 150, 95],
        [SupplierDetails.companyName, 15, 110],

      ]);
      //set box colour---------------------------------
      addSectionHeader(doc, "Supplier Details", 105);


      //supplier Details----------------------------------
      MainSectionOrgAddress(doc, 115, [
        SupplierDetails.addressLine1,
        SupplierDetails.addressLine2,
        SupplierDetails.gstin,
        SupplierDetails.pan,
        SupplierDetails.cin,
      ]);


      const generateTable = (doc, data, hasIgst, startY) => {
        this.logger.debug(`generateTable called with hasIgst: ${hasIgst}`);
        console.log(hasIgst)
        const pageWidth = doc.internal.pageSize.width;
        const igst = data.igst
        console.log('igst', igst)

        const cgst = data.cgst
        const columnsData = hasIgst ? igst : cgst;

        const columns1 = Object.keys(igst);
        console.log("columns", columns1);
        const columns = Object.values(igst);
        console.log("columns22", JSON.stringify(columns));
        let rows = data.materials.map((item) => {
          if (hasIgst) {
            const value = columns.map((e: any) => item[e]);
            console.log("value", value);
            return value;
          }
          else {
            const columns1 = Object.keys(cgst);
            console.log("columns", columns1);
            const columns = Object.values(cgst);
            const value = columns.map((e: any) => item[e]);
            console.log("value", value);
            return value;
          }
        })

        const extractedRows = rows.slice(-2);
        console.log("extractedRows",extractedRows)
        rows = rows.slice(0, -2);
        console.log("rows",rows)

        doc.autoTable({
          startY,
          head: [columnsData],
          body: rows,
          headStyles: {
            lineWidth: 0,
            lineColor: [200, 200, 200],
            fillColor: [200, 200, 200], // Set heading background color
            textColor: 0.2, // Set text color (black)
          },
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' },
            2: { halign: 'left' },
            3: { halign: 'left' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' },
            7: { halign: 'right' },
            8: { halign: 'right' },
            9: { halign: 'right' },
          },
          styles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          tableWidth: (pageWidth - 20),  // Make the table width span the entire page
          margin: { top: 10.59, bottom: 25, left: 10, right: 10 },

          didDrawPage: function (data) {
            const tableEndY = data.cursor.y; // Get the Y position where the table ends
            doc.addImage(img, 'JPEG', 10, 0, 15, 10);
            addFooter(doc);
            addBorderToAllPages(doc);
          },
        });
        const finalY = doc.lastAutoTable.finalY;
        const remainingHeight = doc.internal.pageSize.height - finalY - 50;

        if (remainingHeight < 30) {
         doc.addPage(); 
         const lastRowPosition= renderRemainingDYnRows(doc,extractedRows,columns)
         addStaticContentAfterExtractTable(doc, lastRowPosition); // Start from top on next page
        } else {
          addStaticContentAfterTable(doc, finalY); // Continue from where the table ended
        }
        doc.addImage(img, 'JPEG', 10, 0, 15, 10);;
        addFooter(doc);
        addBorderToAllPages(doc);

      };
      generateTable(doc, data, hasIgst, 145);

      const pdfBuffer = doc.output('arraybuffer');
      return Buffer.from(pdfBuffer);
    }

    catch (err) {
      this.logger.error('error', err);
      throw err
    }

  }

  async generateStc(hasIgst, data,): Promise<Buffer> {
    const buyerDetails = data.buyerDetails;
    const PurchaseOrderDetails = data.purchaseOrderDetails;
    const SupplierDetails = data.supplierDetails;

    const doc = new jsPDF();
    const imageUrl = 'https://imgur.com/gpIvJ1r.png';

    try {

      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');
      const img = 'data:image/png;base64,' + imageBuffer.toString('base64');

      const { SecondSectionOrgAddress, SecondSecBoldOrgAdress, MainSectionOrgAddress, addSectionHeader } = sample();

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      addBorderToAllPages(doc);


      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);

      doc.text("PURCHASE ORDER", pageWidth - 30, 40, { align: "right" });;

      //--------buyer details----------------------
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(buyerDetails.name, 15, 20)

      MainSectionOrgAddress(doc, 25, [
        buyerDetails.addressLine1,
        buyerDetails.addressLine2,
        buyerDetails.gstin,
        buyerDetails.pan,
        buyerDetails.cin,

      ])
      doc.line(10, 53, 200, 53);
      const verticalLineX = pageWidth / 2;
      doc.line(verticalLineX, 57, verticalLineX, pageHeight - 200);

      //--------purchase details----------------------------------

      MainSectionOrgAddress(doc, 60, [
        `Purchase Order Number:`,
        `Purchase Order Date:`,
        `Payment Terms:`,
        `Credit Days:`
      ])

      //---purchase order details---------------------------
      SecondSectionOrgAddress(doc, 60, [
        `Place of Supply`,
        `Expected Shipment Date:`,
        `Delivery Address`,
        ``,
        ``,
        '',
        `Contact Person`,
        `Mobile Number`
      ])


      //---purchaseOrder details left side---------------------------
      SecondSecBoldOrgAdress(doc, [
        [PurchaseOrderDetails.purchaseNumber, 55, 60],
        [PurchaseOrderDetails.purchaseDate, 55, 65],
        [PurchaseOrderDetails.terms, 55, 70],
        [PurchaseOrderDetails.creditDays, 55, 75],
        [PurchaseOrderDetails.placeofSupply, 150, 60],
        [PurchaseOrderDetails.expectedShipmentDate, 150, 65],
        [PurchaseOrderDetails.deliveryAddressString, 150, 70],
        [PurchaseOrderDetails.addressLine1, 150, 75],
        [PurchaseOrderDetails.city, 150, 80],
        [PurchaseOrderDetails.country, 150, 85],
        [PurchaseOrderDetails.contactPerson, 150, 90],
        [PurchaseOrderDetails.mobileNumber, 150, 95],
        [SupplierDetails.companyName, 15, 110],

      ]);
      //set box colour---------------------------------
      addSectionHeader(doc, "Supplier Details", 105);


      //supplier Details----------------------------------
      MainSectionOrgAddress(doc, 115, [
        SupplierDetails.addressLine1,
        SupplierDetails.addressLine2,
        SupplierDetails.gstin,
        SupplierDetails.pan,
        SupplierDetails.cin,
      ]);

      const generateTable = (doc, data, hasIgst, startY) => {
        this.logger.debug(`generateTable called with hasIgst: ${hasIgst}`);
        const pageWidth = doc.internal.pageSize.width;
        const columns = hasIgst
          ? ["S.No", "Material Name", "HSN/SAC", "Qty", "Rate", { content: "IGST", colSpan: 2 }, "Total"] :
          ["S.No", "Material Name", "HSN/SAC", "Qty", "Rate", { content: "CGST", colSpan: 2 }, { content: "SGST", colSpan: 2 }, "Total"];


        const subHeaders = hasIgst
          ? [null, null, null, null, null, "%", "Amount", ""]
          : [null, null, null, null, null, "%", "Amount", "%", "Amount", ""];

        console.log("columns", JSON.stringify(columns), JSON.stringify(subHeaders));


        let rows = data.materials1.map((item) => {
          const taxRate = 0.06; // Example: 5% CGST and 5% SGST
          const igstRate = 0.12;
          if (hasIgst) {
            console.log(hasIgst);
            const igst = item.total * igstRate;
            return [
              item.sno,
              item.name,
              item.hsn,
              item.qty,
              item.rate,
              (igstRate * 100).toFixed(2),
              igst.toFixed(2),
              (item.total + igst).toFixed(2),
            ];
          } else {
            const cgst = item.total * taxRate;
            const sgst = item.total * taxRate;
            return [
              item.sno,
              item.name,
              item.hsn,
              item.qty,
              item.rate,
              (taxRate * 100).toFixed(2),
              cgst.toFixed(2),
              (taxRate * 100).toFixed(2),
              sgst.toFixed(2),
              (item.total + cgst + sgst).toFixed(2),
            ];
          }
        })

        const extractedRows = rows.slice(-2);
        console.log("extractedRows",extractedRows)
        rows = rows.slice(0, -2);
        console.log("rows",rows)
        doc.autoTable({
          pageBreak: 'auto',
          startY,
          head: [columns, subHeaders],
          body: rows,
          headStyles: {
            lineWidth: 0,
            lineColor: [200, 200, 200],
            fillColor: [200, 200, 200], // Set heading background color
            textColor: 0.2, // Set text color (black)
          },
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' },
            2: { halign: 'left' },
            3: { halign: 'left' },
            4: { halign: 'right' },
            5: { halign: 'right' },
            6: { halign: 'right' },
            7: { halign: 'right' },
            8: { halign: 'right' },
            9: { halign: 'right' },
          },
          styles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
          },
          tableWidth: (pageWidth - 20),  // Make the table width span the entire page
          margin: { top: 10.59, bottom: 25, left: 10, right: 10 },

          didDrawPage: function (data) {
            const tableEndY = data.cursor.y;
            doc.addImage(img, 'JPEG', 10, 0, 15, 10);
            addBorderToAllPages(doc);
            addFooter(doc);

          }

        });

        const finalY = doc.lastAutoTable.finalY;
        const remainingHeight = doc.internal.pageSize.height - finalY - 50;
        console.log("remainingHeight", remainingHeight)
        if (remainingHeight < 25) {
          doc.addPage();
          const lastRowYPosition = renderRemainingRows(doc, extractedRows, subHeaders, columns);
          console.log("lastRowPosition", lastRowYPosition)
          addStaticContentAfterExtractTable(doc, lastRowYPosition);
        } else {
          // Add static content directly after the table if there's enough space on the page
          addStaticContentAfterTable(doc, finalY);
        }
        addFooter(doc);
        doc.addImage(img, 'JPEG', 10, 0, 15, 10);

        addBorderToAllPages(doc);
      };

      generateTable(doc, data, hasIgst, 145);

      const pdfBuffer = doc.output('arraybuffer');
      return Buffer.from(pdfBuffer);
    }
    
    catch (err) {
      this.logger.error('error', err);
      throw err
    }

  }

}