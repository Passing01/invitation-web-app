import { NextResponse } from 'next/server';
import { TEMPLATE_STYLES } from '@/lib/templates';

export async function GET() {
    try {
        // Transform the TEMPLATE_STYLES object into an array for easier consumption by Laravel or mobile
        const templatesArray = Object.values(TEMPLATE_STYLES).map(template => ({
            id: template.id,
            name: template.name,
            description: template.description,
            previewUrl: template.previewUrl,
            bgColor: template.bgColor,
            accentColor: template.accentColor,
            // We could also return the full page config if needed
        }));

        return NextResponse.json(templatesArray);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
