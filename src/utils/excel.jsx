//import { utils } from 'xlsx';
import * as XLSX from 'xlsx';

export function getRows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
}
