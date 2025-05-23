export const dynamic = 'force-dynamic' // Force dynamic rendering for this route

import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { retryWithDelay } from 'src/helpers'
import { getToken } from '../../(helpers)'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export async function GET(request: NextRequest) {
    try {
        const token = await getToken(request)

        const { searchParams } = new URL(request.url)
        const queryParams = Object.fromEntries(searchParams.entries()) // Converts to { key1: value1, key2: value2, ... }

        const params = { ...queryParams, isAdmin: true }

        const config = {
            headers: { authorization: `Bearer ${token}` },
            params
        }

        const res = await retryWithDelay(() => axios.get(`${API_URL}/api/post/getAll`, config), 5, 100)
        return NextResponse.json(res.data)
    } catch (err: any) {
        console.error("Next API Error: ", err)
        return NextResponse.json({ error: err.code }, { status: err.status })
    }
}