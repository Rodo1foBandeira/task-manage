
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest) {
    req.nextUrl.searchParams.get("tags")?.split(",").map(t =>
        revalidateTag(t)
    )
    return Response.json("ok")
}