import { NextResponse } from 'next/server';
import { TEMPLATE_STYLES } from '@/lib/templates';

export async function GET() {
    const templatesArray = Object.values(TEMPLATE_STYLES).map(template => ({
        id: template.numericId,
        slug: template.id,
        name: template.name,
        description: template.description,
        previewUrl: template.previewUrl,
    }));

    return NextResponse.json(templatesArray);
}
