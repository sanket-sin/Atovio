import { NextResponse } from "next/server";
import {
  BEYONDAQI_API_BASE,
  BEYONDAQI_REQUEST_TIMEOUT_MS,
  beyondaqiRequestHeaders,
} from "@/lib/config/beyondaqi-api";

export const dynamic = "force-dynamic";

/**
 * Server-side proxy for GET /api/accounts/feed-news/.
 *
 * Unlike the /api/aqi/* endpoints, the upstream feed-news route sends no
 * Access-Control-Allow-Origin header, so calling it straight from the browser fails CORS.
 * Server-to-server requests are not subject to CORS, so the page calls this instead.
 */
export async function GET() {
  // `content-length` is set by fetch itself; forwarding it upstream is rejected by undici.
  const { "content-length": _contentLength, ...headers } = beyondaqiRequestHeaders();

  try {
    const upstream = await fetch(`${BEYONDAQI_API_BASE}/api/accounts/feed-news/`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(BEYONDAQI_REQUEST_TIMEOUT_MS),
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { success: false, message: `Upstream feed-news responded ${upstream.status}` },
        { status: upstream.status }
      );
    }

    return NextResponse.json(await upstream.json());
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err instanceof Error ? err.message : "Feed news request failed",
      },
      { status: 502 }
    );
  }
}
