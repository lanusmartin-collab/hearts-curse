import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { license_key } = body;

        if (!license_key) {
            return NextResponse.json({ error: 'License key is required' }, { status: 400 });
        }

        // 👑 ADMIN BYPASS / MASTER KEY
        // Use this key to unlock the app for yourself without paying
        if (license_key === "HEARTS-CURSE-MASTER-KEY") {
            return NextResponse.json({
                valid: true,
                license_key: "MASTER_OVERRIDE",
                meta: { variant_name: "Dungeon Master (Admin)" }
            });
        }

        const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                license_key: license_key,
            }),
        });

        const data = await response.json();

        // 404 means invalid key usually, but Lemon Squeezy returns 200 with "valid": false often.
        // Let's forward the relevant data.

        if (data.valid) {
            return NextResponse.json({
                valid: true,
                license_key: data.license_key,
                meta: data.meta
            });
        } else {
            return NextResponse.json({
                valid: false,
                error: data.error || "Invalid license key"
            }, { status: 400 });
        }

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
