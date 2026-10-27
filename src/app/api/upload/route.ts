import { NextRequest, NextResponse } from "next/server";

/**
 * Media upload API endpoint
 * Simulates uploading product assets to CDN / local storage / Spring Boot multipart upload
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }

    // In mock mode, return standard public image placeholder or URL
    return NextResponse.json({
      success: true,
      url: `/images/products/p1-01.jpg`,
      message: "File uploaded successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

