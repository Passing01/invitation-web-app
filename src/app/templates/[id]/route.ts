import { NextResponse } from 'next/server';
import { TEMPLATE_STYLES } from '@/lib/templates';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Logic to find template:
    // 1. Try direct string ID (slug) e.g., 'royal'
    // 2. Try numeric ID e.g., '1'
    let template = TEMPLATE_STYLES[id];

    if (!template) {
        const found = Object.values(TEMPLATE_STYLES).find((t) => t.numericId.toString() === id);
        if (found) {
            template = found;
        }
    }

    if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
}
