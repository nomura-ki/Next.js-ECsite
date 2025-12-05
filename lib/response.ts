import { NextResponse } from "next/server";

export function successResponse<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json({ success: false, message }, { status });
}
