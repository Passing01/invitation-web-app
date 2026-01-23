import { NextResponse } from 'next/server';
import { TEMPLATE_STYLES } from '@/lib/templates';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const template = TEMPLATE_STYLES[id];

    if (!template) {
        return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
}
