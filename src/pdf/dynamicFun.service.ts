
import 'jspdf-autotable';

export const sample = () => {
  const title = (doc, title,) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    const pageWidth = doc.internal.pageSize.width;
    let x = pageWidth - 30;
    let y = 40;
    doc.text(title, x, y, { align: "right" });
  };

  const MainSectionOrgAddress = (doc, basePosition, fields) => {
    let position = basePosition
    for (let i of fields) {
      writeLeftText(doc, i, position);
      //writeLeftText1(doc,i,position);
      position += 5;
    }
  }

  const SecondSectionOrgAddress = (doc, basePosition, fields) => {
    let position = basePosition
    for (let i of fields) {
      writeLeftText1(doc, i, position);
      position += 5;
    }
  }
  const SecondSecBoldOrgAdress = (doc, fields) => {
    fields.forEach(([text = "N/A", x = 0, y = 0]) => {
      addBoldText(doc, String(text), Number(x), Number(y));
    });

  };

  const addBoldText = (doc, text, x, y) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(text, x, y);
  };
  const writeLeftText = (doc, text, y) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const x = 15; // Define a fixed x-coordinate for left alignment
    doc.text(text, x, y);
    //return doc.getTextWidth(text)
  };

  const writeLeftText1 = (doc, text, y) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    const x = 110;
    doc.text(text, x, y);
  };
  const addSectionHeader = (doc, text, y) => {
    const pageWidth = doc.internal.pageSize.width;
    doc.setFillColor(200, 200, 200);
    doc.rect(10.2, y - 5, pageWidth - 20.5, 7, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(text, 15, y);
  };

  return { title, SecondSectionOrgAddress, SecondSecBoldOrgAdress, addBoldText, writeLeftText, writeLeftText1, addSectionHeader, MainSectionOrgAddress };
};



export const addBorderToAllPages = (doc) => {

  const pageCount = doc.internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const bottomMargin = 30;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.rect(10, 10, pageWidth - 20, pageHeight - bottomMargin);
  }

};
//--footer------------------------------------------------

export function addFooter(doc) {

  doc.setFontSize(7);
  const footerText1 = "Hyderabad Construction Company";
  const footerText2 = "Hyderabad Address Line - 11Hyderabad Address Line - 2, Hyderabad 500064, Telangana, India";
  const footerText3 = "CIN: L17110MH1973PLC019700";
  const footerText4 = `Page ${doc.internal.getNumberOfPages()} of ${doc.internal.getNumberOfPages()}`; // Dynamic page number
  const footerText5 = "GSTIN: N/A | PAN: ABCTY1234B";

  const bottomMargin = 31  // Adjust the margin for the footer
  const pageHeight = doc.internal.pageSize.height;

  doc.setFont("helvetica", "normal");
  doc.text(footerText1, 90, pageHeight - bottomMargin + 15);
  doc.text(footerText2, 55, pageHeight - bottomMargin + 19);
  doc.text(footerText3, 90, pageHeight - bottomMargin + 23);
  doc.text(footerText4, 180, pageHeight - bottomMargin + 23);
  doc.text(footerText5, 90, pageHeight - bottomMargin + 27);


}
export function renderRemainingRows(doc,rows, subHeaders, columns) {
  // Draw these rows dynamically at the current cursor Y position
  doc.autoTable({
    startY: 10,
    head: [columns, subHeaders],
    body: rows,
    headStyles: {
      lineWidth: 0,
      lineColor: [200, 200, 200],
      fillColor: [200, 200, 200], // Set heading background color
      textColor: 0.2, // Set text color (black)
    },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    tableWidth: (doc.internal.pageSize.width - 20),
    margin: { top: 10.59, bottom: 25, left: 10, right: 10 }
  })
  const lastRowY = doc.lastAutoTable.finalY;
  console.log("lastRowY",lastRowY)
  return lastRowY;

}
export function renderRemainingDYnRows(doc,rows, columns) {
  // Draw these rows dynamically at the current cursor Y position
  doc.autoTable({
    startY: 10,
    head: [columns],
    body: rows,
    headStyles: {
      lineWidth: 0,
      lineColor: [200, 200, 200],
      fillColor: [200, 200, 200], // Set heading background color
      textColor: 0.2, // Set text color (black)
    },
    styles: {
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    tableWidth: (doc.internal.pageSize.width - 20),
    margin: { top: 10.59, bottom: 25, left: 10, right: 10 }
  })
  const lastRowY = doc.lastAutoTable.finalY;
  console.log("lastRowY",lastRowY)
  return lastRowY;

}

// export const generateTable = (doc, data, hasIgst, startY) => {
//   const pageWidth = doc.internal.pageSize.width;
//   const columns = hasIgst
//     ? ["S.No", "Material Name", "HSN/SAC", "Qty", "Rate", { content: "IGST", colSpan: 2 }, "Total"]
//     : ["S.No", "Material Name", "HSN/SAC", "Qty", "Rate", { content: "CGST", colSpan: 2 }, { content: "SGST", colSpan: 2 }, "Total"];

//   const subHeaders = hasIgst
//     ? [null, null, null, null, null, "%", "Amount", ""]
//     : [null, null, null, null, null, "%", "Amount", "%", "Amount", ""];

//   const rows = data.materials.map((item) => {
//     const taxRate = 0.06; // Example: 5% CGST and 5% SGST
//     const igstRate = 0.12;
//     if (hasIgst) {
//       const igst = item.total * igstRate;
//       return [
//         item.sno,
//         item.name,
//         item.hsn,
//         item.qty,
//         item.rate,
//         (igstRate * 100).toFixed(2),
//         igst.toFixed(2),
//         (item.total + igst).toFixed(2),
//       ];
//     } else {
//       const cgst = item.total * taxRate;
//       const sgst = item.total * taxRate;
//       return [
//         item.sno,
//         item.name,
//         item.hsn,
//         item.qty,
//         item.rate,
//         (taxRate * 100).toFixed(2),
//         cgst.toFixed(2),
//         (taxRate * 100).toFixed(2),
//         sgst.toFixed(2),
//         (item.total + cgst + sgst).toFixed(2),
//       ];
//     }
//   });

//   doc.autoTable({
//     startY,
//     head: [columns, subHeaders],
//     body: rows,
//     headStyles: {
//       lineWidth: 0,
//       lineColor: [200,200, 200],
//       fillColor: [200, 200, 200], // Set heading background color
//       textColor: 0.2, // Set text color (black)
//     },
//     columnStyles: {
//       0: { halign: 'left' },
//       1: { halign: 'left' },
//       2: { halign: 'left' },
//       3: { halign: 'left' },
//       4: { halign: 'right' },
//       5: { halign: 'right' },
//       6: { halign: 'right' },
//       7: { halign: 'right' },
//       8: { halign: 'right' },
//       9: { halign: 'right' },
//     },
//     styles: {
//       lineColor: [200, 200, 200], // Border color for cells
//       lineWidth: 0.1, // Border thickness for cells
//     },
//     tableWidth: (pageWidth - 20),  // Make the table width span the entire page
//     margin: { top: 10.59, bottom: 25, left: 10, right: 10 },
//     didDrawPage: function (data) {
//       const tableEndY = data.cursor.y; // Get the Y position where the table ends
//       if (tableEndY < doc.internal.pageSize.height - 100) { // Ensure there's enough space left on the page
//         addStaticContentAfterTable(doc, tableEndY); // Call the function to add static content after the table
//       }
//       addFooter(doc);
//       addBorderToAllPages(doc);
//     },
//   });
//   const finalY = doc.lastAutoTable.finalY;
//   const remainingHeight = doc.internal.pageSize.height - finalY - 50; // 30 is the height of the static table

//   // Check if there's enough space
//   if (remainingHeight < 30) {
//     doc.addPage(); // If not enough space, move to next page
//     addStaticContentAfterTable(doc, 20); // Start from top on next page
//   } else {
//     addStaticContentAfterTable(doc, finalY ); // Continue from where the table ended
//   }
//   addFooter(doc);
//   addBorderToAllPages(doc);
//   return doc;
// };
export function addStaticContentAfterTable(doc, tableEndY) {
  const marginY = 0; // Space after the table
  const startY = tableEndY + marginY
  doc.setDrawColor(200, 200, 200)
  doc.line(117.5, startY, 117.5, startY + 60)
  doc.text("Taxable Amount:", 150, startY + 10)
  doc.text("4500.00", 180, startY + 10)
  doc.text("CGST:", 162, startY + 15)
  doc.text("60.00", 180, startY + 15)
  doc.text("SGST:", 162, startY + 20)
  doc.text("60.00", 180, startY + 20)



  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Total In Words", 15, startY + 10)
  doc.text("Indian Rupee Eleven Hundred Rupees Only", 15, startY + 15)
  doc.text("Total:", 162, startY + 25)
  doc.text("1100", 180, startY + 25)


  doc.line(117.5, startY + 30, 200, startY + 30)

  doc.text("Autorized signature", 130, startY + 50)
  doc.line(117.5, startY + 60, 200, startY + 60)
  //doc.line(117.5,220.5,200,220.5)

  // Now, add Terms and Conditions on the next page (or below if enough space)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Terms and Conditions", 10, startY + 180);
  doc.setFont("helvetica", "normal");

  doc.text("1. TCN1", 15, startY + 190);
  doc.text("2. TCN2", 15, startY + 195);

}
export function addStaticContentAfterExtractTable(doc,lastRowYPosition) {
  //const extractTableY = renderRemainingRows.length;
 // console.log("extractTableY",extractTableY)
  // Space after the table
  const startY = lastRowYPosition
  
  console.log("starty",startY)
 
  doc.setDrawColor(200, 200, 200)
  doc.line(117.5, startY, 117.5, startY + 60)
  doc.text("Taxable Amount:", 150, startY + 10)
  doc.text("4500.00", 180, startY + 10)
  doc.text("CGST:", 162, startY + 15)
  doc.text("60.00", 180, startY + 15)
  doc.text("SGST:", 162, startY + 20)
  doc.text("60.00", 180, startY + 20)



  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Total In Words", 15, startY + 10)
  doc.text("Indian Rupee Eleven Hundred Rupees Only", 15, startY + 15)
  doc.text("Total:", 162, startY + 25)
  doc.text("1100", 180, startY + 25)


  doc.line(117.5, startY + 30, 200, startY + 30)

  doc.text("Autorized signature", 130, startY + 50)
  doc.line(117.5, startY + 60, 200, startY + 60)
  //doc.line(117.5,220.5,200,220.5)

  // Now, add Terms and Conditions on the next page (or below if enough space)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Terms and Conditions", 10, startY + 180);
  doc.setFont("helvetica", "normal");

  doc.text("1. TCN1", 15, startY + 190);
  doc.text("2. TCN2", 15, startY + 195);

}
