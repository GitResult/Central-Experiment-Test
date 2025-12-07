/**
 * Excel Native Chart Utilities
 *
 * Adds native Excel charts to xlsx files by manipulating the underlying XML structure.
 * Works in the browser using JSZip.
 */

import JSZip from 'jszip';

/**
 * Chart XML templates for different chart types
 */
const getChartXml = (chartType, title, categories, series, sheetName = 'Chart Data') => {
  const catCount = categories.length;

  // Generate category cache
  const categoryCache = categories.map((cat, idx) =>
    `<c:pt idx="${idx}"><c:v>${cat}</c:v></c:pt>`
  ).join('');

  // Generate series XML
  const seriesXml = series.map((s, idx) => {
    const valueCache = s.values.map((val, vidx) =>
      `<c:pt idx="${vidx}"><c:v>${val}</c:v></c:pt>`
    ).join('');

    // Color for series
    const colors = ['4472C4', 'ED7D31', 'A5A5A5', 'FFC000', '5B9BD5', '70AD47'];
    const color = colors[idx % colors.length];

    if (chartType === 'pie') {
      return `
        <c:ser>
          <c:idx val="${idx}"/>
          <c:order val="${idx}"/>
          <c:tx>
            <c:v>${s.name}</c:v>
          </c:tx>
          <c:cat>
            <c:strRef>
              <c:f>'${sheetName}'!$A$4:$A$${3 + catCount}</c:f>
              <c:strCache>
                <c:ptCount val="${catCount}"/>
                ${categoryCache}
              </c:strCache>
            </c:strRef>
          </c:cat>
          <c:val>
            <c:numRef>
              <c:f>'${sheetName}'!$B$4:$B$${3 + catCount}</c:f>
              <c:numCache>
                <c:formatCode>General</c:formatCode>
                <c:ptCount val="${catCount}"/>
                ${valueCache}
              </c:numCache>
            </c:numRef>
          </c:val>
        </c:ser>`;
    }

    const colLetter = String.fromCharCode(66 + idx); // B, C, D...
    return `
      <c:ser>
        <c:idx val="${idx}"/>
        <c:order val="${idx}"/>
        <c:tx>
          <c:v>${s.name}</c:v>
        </c:tx>
        <c:spPr>
          <a:solidFill>
            <a:srgbClr val="${color}"/>
          </a:solidFill>
        </c:spPr>
        <c:cat>
          <c:strRef>
            <c:f>'${sheetName}'!$A$4:$A$${3 + catCount}</c:f>
            <c:strCache>
              <c:ptCount val="${catCount}"/>
              ${categoryCache}
            </c:strCache>
          </c:strRef>
        </c:cat>
        <c:val>
          <c:numRef>
            <c:f>'${sheetName}'!$${colLetter}$4:$${colLetter}$${3 + catCount}</c:f>
            <c:numCache>
              <c:formatCode>General</c:formatCode>
              <c:ptCount val="${catCount}"/>
              ${valueCache}
            </c:numCache>
          </c:numRef>
        </c:val>
      </c:ser>`;
  }).join('');

  // Chart-specific XML
  let chartContent;
  if (chartType === 'bar') {
    chartContent = `
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
        <c:axId val="1"/>
        <c:axId val="2"/>
      </c:barChart>
      <c:catAx>
        <c:axId val="1"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="b"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="2"/>
        <c:crosses val="autoZero"/>
        <c:auto val="1"/>
        <c:lblAlgn val="ctr"/>
        <c:lblOffset val="100"/>
      </c:catAx>
      <c:valAx>
        <c:axId val="2"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="l"/>
        <c:majorGridlines/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="1"/>
        <c:crosses val="autoZero"/>
        <c:crossBetween val="between"/>
      </c:valAx>`;
  } else if (chartType === 'line') {
    chartContent = `
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
        <c:axId val="1"/>
        <c:axId val="2"/>
      </c:lineChart>
      <c:catAx>
        <c:axId val="1"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="b"/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="2"/>
        <c:crosses val="autoZero"/>
        <c:auto val="1"/>
        <c:lblAlgn val="ctr"/>
        <c:lblOffset val="100"/>
      </c:catAx>
      <c:valAx>
        <c:axId val="2"/>
        <c:scaling><c:orientation val="minMax"/></c:scaling>
        <c:delete val="0"/>
        <c:axPos val="l"/>
        <c:majorGridlines/>
        <c:tickLblPos val="nextTo"/>
        <c:crossAx val="1"/>
        <c:crosses val="autoZero"/>
        <c:crossBetween val="between"/>
      </c:valAx>`;
  } else if (chartType === 'pie') {
    chartContent = `
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
          <a:bodyPr/>
          <a:lstStyle/>
          <a:p>
            <a:pPr>
              <a:defRPr sz="1400" b="0"/>
            </a:pPr>
            <a:r>
              <a:rPr lang="en-US"/>
              <a:t>${title}</a:t>
            </a:r>
          </a:p>
        </c:rich>
      </c:tx>
      <c:overlay val="0"/>
    </c:title>
    <c:autoTitleDeleted val="0"/>
    <c:plotArea>
      <c:layout/>
      ${chartContent}
    </c:plotArea>
    <c:legend>
      <c:legendPos val="b"/>
      <c:overlay val="0"/>
    </c:legend>
    <c:plotVisOnly val="1"/>
  </c:chart>
  <c:printSettings>
    <c:headerFooter/>
    <c:pageMargins b="0.75" l="0.7" r="0.7" t="0.75" header="0.3" footer="0.3"/>
    <c:pageSetup/>
  </c:printSettings>
</c:chartSpace>`;
};

/**
 * Get the drawing XML that positions the chart on the worksheet
 */
const getDrawingXml = (chartRId) => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
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
      <xdr:row>18</xdr:row>
      <xdr:rowOff>0</xdr:rowOff>
    </xdr:to>
    <xdr:graphicFrame macro="">
      <xdr:nvGraphicFramePr>
        <xdr:cNvPr id="2" name="Chart 1"/>
        <xdr:cNvGraphicFramePr/>
      </xdr:nvGraphicFramePr>
      <xdr:xfrm>
        <a:off x="0" y="0"/>
        <a:ext cx="0" cy="0"/>
      </xdr:xfrm>
      <a:graphic>
        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
          <c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" r:id="${chartRId}"/>
        </a:graphicData>
      </a:graphic>
    </xdr:graphicFrame>
    <xdr:clientData/>
  </xdr:twoCellAnchor>
</xdr:wsDr>`;
};

/**
 * Add a native Excel chart to an existing xlsx buffer
 *
 * @param {ArrayBuffer} xlsxBuffer - The xlsx file as ArrayBuffer
 * @param {Object} options - Chart options
 * @param {string} options.chartType - 'bar', 'line', or 'pie'
 * @param {string} options.title - Chart title
 * @param {string[]} options.categories - Category labels
 * @param {Array<{name: string, values: number[]}>} options.series - Data series
 * @param {number} options.sheetIndex - Which sheet to add chart to (0-based)
 * @returns {Promise<Blob>} - Modified xlsx as Blob
 */
export const addNativeChart = async (xlsxBuffer, options) => {
  const { chartType, title, categories, series, sheetIndex = 1 } = options;

  // Load the xlsx file
  const zip = await JSZip.loadAsync(xlsxBuffer);

  // Generate chart XML
  const chartXml = getChartXml(chartType, title, categories, series, 'Chart Data');

  // Add chart file
  zip.file('xl/charts/chart1.xml', chartXml);

  // Add drawing file
  const drawingXml = getDrawingXml('rId1');
  zip.file('xl/drawings/drawing1.xml', drawingXml);

  // Add drawing relationship file
  const drawingRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart1.xml"/>
</Relationships>`;
  zip.file('xl/drawings/_rels/drawing1.xml.rels', drawingRelsXml);

  // Update worksheet to reference drawing
  const sheetNum = sheetIndex + 1;
  const sheetPath = `xl/worksheets/sheet${sheetNum}.xml`;
  let sheetXml = await zip.file(sheetPath)?.async('string');

  if (sheetXml) {
    // Add drawing reference if not present
    if (!sheetXml.includes('<drawing')) {
      // Insert before closing worksheet tag
      sheetXml = sheetXml.replace(
        '</worksheet>',
        '<drawing r:id="rId1"/></worksheet>'
      );

      // Add namespace for relationships if not present
      if (!sheetXml.includes('xmlns:r=')) {
        sheetXml = sheetXml.replace(
          '<worksheet',
          '<worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"'
        );
      }

      zip.file(sheetPath, sheetXml);
    }

    // Add worksheet relationship for drawing
    const sheetRelsPath = `xl/worksheets/_rels/sheet${sheetNum}.xml.rels`;
    let sheetRels = await zip.file(sheetRelsPath)?.async('string');

    if (!sheetRels) {
      sheetRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>
</Relationships>`;
    } else if (!sheetRels.includes('drawing1.xml')) {
      // Add drawing relationship
      const newRel = '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>';
      sheetRels = sheetRels.replace('</Relationships>', newRel + '</Relationships>');
    }
    zip.file(sheetRelsPath, sheetRels);
  }

  // Update Content_Types.xml to include chart and drawing
  let contentTypes = await zip.file('[Content_Types].xml')?.async('string');
  if (contentTypes) {
    if (!contentTypes.includes('/xl/charts/chart1.xml')) {
      const chartOverride = '<Override PartName="/xl/charts/chart1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>';
      contentTypes = contentTypes.replace('</Types>', chartOverride + '</Types>');
    }
    if (!contentTypes.includes('/xl/drawings/drawing1.xml')) {
      const drawingOverride = '<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>';
      contentTypes = contentTypes.replace('</Types>', drawingOverride + '</Types>');
    }
    zip.file('[Content_Types].xml', contentTypes);
  }

  // Generate the modified xlsx
  const modifiedBlob = await zip.generateAsync({ type: 'blob' });
  return modifiedBlob;
};

const excelChartUtils = { addNativeChart };
export default excelChartUtils;
