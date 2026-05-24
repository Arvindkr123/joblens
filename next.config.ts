import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "@hello-pangea/dnd",
    ".prisma/client",
  ],
}

export default nextConfig