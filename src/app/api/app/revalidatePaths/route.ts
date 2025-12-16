export const dynamic = 'force-dynamic' // Force dynamic rendering for this route

import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET() {
    try {
        revalidatePath('/')
        revalidatePath('/blog')
        return NextResponse.json('ok')
    } catch (err: any) {
        console.error("Next API Error: ", err)
        return NextResponse.json({ error: err.code }, { status: err.status })
    }
}