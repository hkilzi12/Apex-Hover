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
  const timestamp = new Date().toISOString()

  const workbook = new ExcelJS.Workbook()
  let worksheet

  try {
    await workbook.xlsx.readFile(excelFilePath)
    worksheet = workbook.getWorksheet('Submissions')
  } catch (error) {
    worksheet = workbook.addWorksheet('Submissions')
    const headerRow = worksheet.addRow([
      'Timestamp',
      'Full Name',
      'Email Address',
      'Subject',
      'Message',
    ])
    headerRow.font = { bold: true, color: { rgb: 'FFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { rgb: '1B365D' },
    }
  }

  const nextRowNumber = worksheet.actualRowCount + 1
  worksheet.insertRow(nextRowNumber, [
    timestamp,
    fullName,
    email,
    subject,
    message,
  ])

  worksheet.columns.forEach((column) => {
    let maxLen = 0
    column.eachCell({ includeEmpty: true }, (cell) => {
      const cellLen = cell.value ? cell.value.toString().length : 0
      if (cellLen > maxLen) maxLen = cellLen
    })
    column.width = Math.max(maxLen + 3, 12)
  })

  await workbook.xlsx.writeFile(excelFilePath)

  console.log(`Saved Excel row #${nextRowNumber} for ${fullName}`)
  res.status(200).send('Message Saved natively to Excel!')
})

app.listen(3000, () => console.log('Mock Excel backend running on port 3000'))
