import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json()

        if (!message || typeof message !== 'string' || message.trim() === '') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        })

        const sheets = google.sheets({ version: 'v4', auth })

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
            range: 'Sheet1!A:B',
            valueInputOption: 'RAW',
            requestBody: {
                values: [[new Date().toISOString(), message.trim()]],
            },
        })

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('send-message error:', err)
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }
}
