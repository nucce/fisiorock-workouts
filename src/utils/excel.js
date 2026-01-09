import { utils } from 'xlsx';

export function getRows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return utils.sheet_to_json(sheet, { header: 1, defval: "" });
}
