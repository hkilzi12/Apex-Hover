const express = require('express')
const cors = require('cors')
const ExcelJS = require('exceljs')
const path = require('path')

const app = express()
app.use(cors())
app.use(express.json())

const excelFilePath = path.join(__dirname, 'messages.xlsx')

app.post('/api/contact', async (req, res) => {
  const { fullName, email, subject, message } = req.body
  const headers = ['Full Name', 'Email', 'Subject', 'Message']

  const workbook = new ExcelJS.Workbook()
  let worksheet

  try {
    await workbook.xlsx.readFile(excelFilePath)
    worksheet = workbook.getWorksheet('Submissions')
  } catch (error) {
    worksheet = workbook.addWorksheet('Submissions')
    const headerRow = worksheet.addRow(headers)

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 22, color: { argb: 'FF000000' } }
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF548CD5' },
      }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
      cell.alignment = { horizontal: 'center' }
    })
  }

  const dataRow = worksheet.addRow([fullName, email, subject, message])

  dataRow.eachCell((cell) => {
    cell.font = { size: 11, color: { argb: 'FF000000' } }
    cell.alignment = { wrapText: true, vertical: 'top' }
  })

  const minWidths = [17, 10, 12, 15]

  const maxColumnWidth = 80

  worksheet.columns.forEach((column, i) => {
    let maxLength = minWidths[i]

    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      if (rowNumber === 1) return
      const cellText = cell.value ? cell.value.toString() : ''
      if (cellText.length > maxLength) {
        maxLength = cellText.length
      }
    })

    column.width = Math.min(maxLength + 1, maxColumnWidth)
  })

  await workbook.xlsx.writeFile(excelFilePath)

  res.status(200).send('Saved to Excel!')
})

app.listen(3000, () => console.log('Excel backend running on port 3000'))
