import { auth } from "@/lib/auth.server"
import { prisma } from "@/lib/prisma"

/**
 * Returns the authenticated user's DB record.
 * Falls back to email lookup if the JWT id is stale (e.g. after a DB reset
 * where the user was re-created with a new id). Creates only as a last resort.
 */
export async function requireUser() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) return null

  // Fast path: id matches
  let user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true },
  })

  // Stale JWT: user exists but was re-created with a different id
  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true },
    })
  }

  // Truly missing: create a passwordless placeholder row
  if (!user) {
    user = await prisma.user.create({
      data: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      },
      select: { id: true, name: true },
    })
  }

  return user
}
