/**
 * Excel Native Chart Utilities
 *
 * Adds native Excel charts to xlsx files by manipulating the underlying XML structure.
 * Works in the browser using JSZip.
 */

import JSZip from 'jszip';

/**
 * Generate chart XML for Excel
 */
const generateChartXml = (chartType, title, categories, series, sheetName) => {
  const catCount = categories.length;

  // Escape XML special characters
  const escapeXml = (str) => {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  // Generate category string references
  const categoryPts = categories.map((cat, idx) =>
    `<c:pt idx="${idx}"><c:v>${escapeXml(cat)}</c:v></c:pt>`
  ).join('');

  // Generate series based on chart type
  let seriesXml = '';

  if (chartType === 'pie') {
    // Pie chart - single series with data point colors
    const s = series[0];
    const valuePts = s.values.map((val, idx) =>
      `<c:pt idx="${idx}"><c:v>${val}</c:v></c:pt>`
    ).join('');

    seriesXml = `
      <c:ser>
        <c:idx val="0"/>
        <c:order val="0"/>
        <c:tx><c:v>${escapeXml(s.name)}</c:v></c:tx>
        <c:cat>
          <c:strRef>
            <c:f>'${escapeXml(sheetName)}'!$A$4:$A$${3 + catCount}</c:f>
            <c:strCache>
              <c:ptCount val="${catCount}"/>
              ${categoryPts}
            </c:strCache>
          </c:strRef>
        </c:cat>
        <c:val>
          <c:numRef>
            <c:f>'${escapeXml(sheetName)}'!$B$4:$B$${3 + catCount}</c:f>
            <c:numCache>
              <c:formatCode>General</c:formatCode>
              <c:ptCount val="${catCount}"/>
              ${valuePts}
            </c:numCache>
          </c:numRef>
        </c:val>
      </c:ser>`;
  } else {
    // Bar/Line chart - multiple series
    const colors = ['4472C4', 'ED7D31', 'A5A5A5', 'FFC000', '5B9BD5', '70AD47'];

    seriesXml = series.map((s, idx) => {
      const colLetter = String.fromCharCode(66 + idx); // B, C, D...
      const color = colors[idx % colors.length];

      const valuePts = s.values.map((val, vidx) =>
        `<c:pt idx="${vidx}"><c:v>${val}</c:v></c:pt>`
      ).join('');

      return `
        <c:ser>
          <c:idx val="${idx}"/>
          <c:order val="${idx}"/>
          <c:tx><c:v>${escapeXml(s.name)}</c:v></c:tx>
          <c:spPr>
            <a:solidFill><a:srgbClr val="${color}"/></a:solidFill>
            <a:ln><a:noFill/></a:ln>
          </c:spPr>
          <c:invertIfNegative val="0"/>
          <c:cat>
            <c:strRef>
              <c:f>'${escapeXml(sheetName)}'!$A$4:$A$${3 + catCount}</c:f>
              <c:strCache>
                <c:ptCount val="${catCount}"/>
                ${categoryPts}
              </c:strCache>
            </c:strRef>
          </c:cat>
          <c:val>
            <c:numRef>
              <c:f>'${escapeXml(sheetName)}'!$${colLetter}$4:$${colLetter}$${3 + catCount}</c:f>
              <c:numCache>
                <c:formatCode>General</c:formatCode>
                <c:ptCount val="${catCount}"/>
                ${valuePts}
              </c:numCache>
            </c:numRef>
          </c:val>
        </c:ser>`;
    }).join('');
  }

  // Build chart-specific plot area content
  let plotContent;

  if (chartType === 'bar') {
    plotContent = `
      <c:barChart>
        <c:barDir val="col"/>
        <c:grouping val="clustered"/>
        <c:varyColors val="0"/>
        ${seriesXml}
        <c:dLbls>
          <c:showLegendKey val="0"/>
          <c:showVal val="0"/>
          <c:showCatName val="0"/>
          <c:showSerName val="0"/>
          <c:showPercent val="0"/>
          <c:showBubbleSize val="0"/>
        </c:dLbls>
        <c:gapWidth val="150"/>
        <c:axId val="100"/>
        <c:axId val="101"/>
      </c:barChart>
      <c:catAx>
        <c:axId val="100"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="b"/>
        <c:numFmt formatCode="General" sourceLinked="1"/>
        <c:majorTickMark val="out"/>
        <c:minorTickMark val="none"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="101"/>
        <c:crosses val="autoZero"/>
        <c:auto val="1"/>
        <c:lblAlgn val="ctr"/>
        <c:lblOffset val="100"/>
        <c:noMultiLvlLbl val="0"/>
      </c:catAx>
      <c:valAx>
        <c:axId val="101"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="l"/>
        <c:majorGridlines/>
        <c:numFmt formatCode="General" sourceLinked="1"/>
        <c:majorTickMark val="out"/>
        <c:minorTickMark val="none"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="100"/>
        <c:crosses val="autoZero"/>
        <c:crossBetween val="between"/>
      </c:valAx>`;
  } else if (chartType === 'line') {
    plotContent = `
      <c:lineChart>
        <c:grouping val="standard"/>
        <c:varyColors val="0"/>
        ${seriesXml}
        <c:dLbls>
          <c:showLegendKey val="0"/>
          <c:showVal val="0"/>
          <c:showCatName val="0"/>
          <c:showSerName val="0"/>
          <c:showPercent val="0"/>
          <c:showBubbleSize val="0"/>
        </c:dLbls>
        <c:marker val="1"/>
        <c:smooth val="0"/>
        <c:axId val="100"/>
        <c:axId val="101"/>
      </c:lineChart>
      <c:catAx>
        <c:axId val="100"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="b"/>
        <c:numFmt formatCode="General" sourceLinked="1"/>
        <c:majorTickMark val="out"/>
        <c:minorTickMark val="none"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="101"/>
        <c:crosses val="autoZero"/>
        <c:auto val="1"/>
        <c:lblAlgn val="ctr"/>
        <c:lblOffset val="100"/>
        <c:noMultiLvlLbl val="0"/>
      </c:catAx>
      <c:valAx>
        <c:axId val="101"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="l"/>
        <c:majorGridlines/>
        <c:numFmt formatCode="General" sourceLinked="1"/>
        <c:majorTickMark val="out"/>
        <c:minorTickMark val="none"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="100"/>
        <c:crosses val="autoZero"/>
        <c:crossBetween val="between"/>
      </c:valAx>`;
  } else {
    // Pie chart
    plotContent = `
      <c:pieChart>
        <c:varyColors val="1"/>
        ${seriesXml}
        <c:dLbls>
          <c:showLegendKey val="0"/>
          <c:showVal val="0"/>
          <c:showCatName val="0"/>
          <c:showSerName val="0"/>
          <c:showPercent val="1"/>
          <c:showBubbleSize val="0"/>
          <c:showLeaderLines val="1"/>
        </c:dLbls>
        <c:firstSliceAng val="0"/>
      </c:pieChart>`;
  }

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <c:date1904 val="0"/>
  <c:lang val="en-US"/>
  <c:roundedCorners val="0"/>
  <c:chart>
    <c:title>
      <c:tx>
        <c:rich>
          <a:bodyPr rot="0" vert="horz"/>
          <a:lstStyle/>
          <a:p>
            <a:pPr>
              <a:defRPr sz="1400" b="0" i="0"/>
            </a:pPr>
            <a:r>
              <a:rPr lang="en-US" sz="1400" b="0" i="0"/>
              <a:t>${escapeXml(title)}</a:t>
            </a:r>
          </a:p>
        </c:rich>
      </c:tx>
      <c:overlay val="0"/>
    </c:title>
    <c:autoTitleDeleted val="0"/>
    <c:plotArea>
      <c:layout/>
      ${plotContent}
    </c:plotArea>
    <c:legend>
      <c:legendPos val="b"/>
      <c:overlay val="0"/>
    </c:legend>
    <c:plotVisOnly val="1"/>
    <c:dispBlanksAs val="gap"/>
  </c:chart>
  <c:printSettings>
    <c:headerFooter/>
    <c:pageMargins b="0.75" l="0.7" r="0.7" t="0.75" header="0.3" footer="0.3"/>
    <c:pageSetup/>
  </c:printSettings>
</c:chartSpace>`;
};

/**
 * Generate drawing XML that positions the chart
 */
const generateDrawingXml = () => {
  // Position chart from column E (4) row 2 to column N (13) row 20
  // Using EMU (English Metric Units): 1 inch = 914400 EMU
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart">
  <xdr:twoCellAnchor>
    <xdr:from>
      <xdr:col>4</xdr:col>
      <xdr:colOff>0</xdr:colOff>
      <xdr:row>1</xdr:row>
      <xdr:rowOff>0</xdr:rowOff>
    </xdr:from>
    <xdr:to>
      <xdr:col>13</xdr:col>
      <xdr:colOff>0</xdr:colOff>
      <xdr:row>20</xdr:row>
      <xdr:rowOff>0</xdr:rowOff>
    </xdr:to>
    <xdr:graphicFrame macro="">
      <xdr:nvGraphicFramePr>
        <xdr:cNvPr id="2" name="Chart 1"/>
        <xdr:cNvGraphicFramePr>
          <a:graphicFrameLocks/>
        </xdr:cNvGraphicFramePr>
      </xdr:nvGraphicFramePr>
      <xdr:xfrm>
        <a:off x="0" y="0"/>
        <a:ext cx="0" cy="0"/>
      </xdr:xfrm>
      <a:graphic>
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
          <c:chart r:id="rId1"/>
        </a:graphicData>
      </a:graphic>
    </xdr:graphicFrame>
    <xdr:clientData/>
  </xdr:twoCellAnchor>
</xdr:wsDr>`;
};

/**
 * Add a native Excel chart to an existing xlsx buffer
 */
export const addNativeChart = async (xlsxBuffer, options) => {
  const { chartType, title, categories, series, sheetIndex = 1 } = options;

  // Sheet number in Excel file paths (1-based)
  const sheetNum = sheetIndex + 1;

  // Load the xlsx file
  const zip = await JSZip.loadAsync(xlsxBuffer);

  // Determine sheet name from workbook.xml
  let sheetName = 'Chart Data';
  try {
    const workbookXml = await zip.file('xl/workbook.xml')?.async('string');
    if (workbookXml) {
      const sheetMatch = workbookXml.match(/<sheet[^>]*name="([^"]*)"[^>]*sheetId="(\d+)"/g);
      if (sheetMatch && sheetMatch[sheetIndex]) {
        const nameMatch = sheetMatch[sheetIndex].match(/name="([^"]*)"/);
        if (nameMatch) {
          sheetName = nameMatch[1];
        }
      }
    }
  } catch (e) {
    console.warn('Could not read sheet name, using default');
  }

  // Generate chart XML
  const chartXml = generateChartXml(chartType, title, categories, series, sheetName);

  // Generate drawing XML
  const drawingXml = generateDrawingXml();

  // Create charts folder and add chart
  zip.file('xl/charts/chart1.xml', chartXml);

  // Create drawings folder and add drawing
  zip.file('xl/drawings/drawing1.xml', drawingXml);

  // Create drawing relationships
  const drawingRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart1.xml"/>
</Relationships>`;
  zip.file('xl/drawings/_rels/drawing1.xml.rels', drawingRelsXml);

  // Update the target worksheet to reference the drawing
  const sheetPath = `xl/worksheets/sheet${sheetNum}.xml`;
  let sheetXml = await zip.file(sheetPath)?.async('string');

  if (sheetXml) {
    // Add r namespace if not present
    if (!sheetXml.includes('xmlns:r=')) {
      sheetXml = sheetXml.replace(
        '<worksheet',
        '<worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
      );
    }

    // Add drawing reference before </worksheet>
    if (!sheetXml.includes('<drawing')) {
      sheetXml = sheetXml.replace(
        '</worksheet>',
        '  <drawing r:id="rId1"/>\n</worksheet>'
      );
    }

    zip.file(sheetPath, sheetXml);
  }

  // Create or update worksheet relationships
  const sheetRelsPath = `xl/worksheets/_rels/sheet${sheetNum}.xml.rels`;
  let sheetRelsXml = await zip.file(sheetRelsPath)?.async('string');

  if (!sheetRelsXml) {
    // Create new rels file
    sheetRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>
</Relationships>`;
  } else if (!sheetRelsXml.includes('drawing1.xml')) {
    // Add drawing relationship to existing rels
    // Find the highest rId and add one
    const rIdMatches = sheetRelsXml.match(/rId(\d+)/g) || [];
    const maxId = rIdMatches.reduce((max, id) => {
      const num = parseInt(id.replace('rId', ''), 10);
      return num > max ? num : max;
    }, 0);
    const newRId = `rId${maxId + 1}`;

    const newRel = `<Relationship Id="${newRId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>`;
    sheetRelsXml = sheetRelsXml.replace('</Relationships>', `  ${newRel}\n</Relationships>`);

    // Update sheet XML to use new rId
    if (sheetXml) {
      sheetXml = sheetXml.replace(/r:id="rId1"/, `r:id="${newRId}"`);
      zip.file(sheetPath, sheetXml);
    }
  }
  zip.file(sheetRelsPath, sheetRelsXml);

  // Update Content_Types.xml
  let contentTypes = await zip.file('[Content_Types].xml')?.async('string');
  if (contentTypes) {
    // Add chart content type if not present
    if (!contentTypes.includes('application/vnd.openxmlformats-officedocument.drawingml.chart+xml')) {
      contentTypes = contentTypes.replace(
        '</Types>',
        '  <Override PartName="/xl/charts/chart1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>\n</Types>'
      );
    }

    // Add drawing content type if not present
    if (!contentTypes.includes('application/vnd.openxmlformats-officedocument.drawing+xml')) {
      contentTypes = contentTypes.replace(
        '</Types>',
        '  <Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>\n</Types>'
      );
    }

    zip.file('[Content_Types].xml', contentTypes);
  }

  // Generate the modified xlsx
  const modifiedBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  return modifiedBlob;
};

const excelChartUtils = { addNativeChart };
export default excelChartUtils;
