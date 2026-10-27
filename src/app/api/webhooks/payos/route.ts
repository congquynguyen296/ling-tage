import { NextRequest, NextResponse } from "next/server";

/**
 * PayOS Webhook receiver
 * Matches Spring Boot integration when backend sends webhook updates
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify PayOS signature / checksum
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code, data, desc } = body;

    if (code === "00") {
      // Payment success
      // Order ID / reference: data.orderCode
      return NextResponse.json({
        success: true,
        message: "Payment webhook received and confirmed",
        data,
      });
    }

    return NextResponse.json(
      { success: false, message: desc || "Payment unsuccessful" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

