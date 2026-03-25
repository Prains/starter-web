import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { call, ORPCError, type AnyProcedure } from "@orpc/server";
import type { prisma as starterPrisma } from "../../../prisma/client";

const testUsers = [
  {
    id: "notes-router-user-1",
    email: "notes-router-user-1@example.com",
    name: "Notes Router User 1",
  },
  {
    id: "notes-router-user-2",
    email: "notes-router-user-2@example.com",
    name: "Notes Router User 2",
  },
] as const;

type PrismaContract = typeof starterPrisma;
type NotesRouter = {
  list: AnyProcedure;
  create: AnyProcedure;
  update: AnyProcedure;
  delete: AnyProcedure;
};

type AuthenticatedUser = (typeof testUsers)[number];

type ProcedureContext = {
  prisma: PrismaContract;
  request: Request;
  session?: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
  user?: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    image: string | null;
  };
};

function assertORPCErrorCode(error: unknown, code: string): boolean {
  return error instanceof ORPCError && error.code === code;
}

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL must be set to run notes router integration tests.",
    );
  }

  return databaseUrl;
}

async function loadModules(): Promise<{
  prisma: PrismaContract;
  prismaPool: {
    end(): Promise<void>;
  } | null;
  notes: NotesRouter;
}> {
  process.env.DATABASE_URL = requireDatabaseUrl();

  const [prismaModule, notesModule] = await Promise.all([
    import("../../../prisma/client.ts"),
    import("../../../server/orpc/routers/notes.ts"),
  ]);

  return {
    prisma: (prismaModule as { prisma: PrismaContract }).prisma,
    prismaPool:
      (prismaModule as { prismaPool?: { end(): Promise<void> } }).prismaPool ??
      null,
    notes: notesModule.default as NotesRouter,
  };
}

function createContext(
  prisma: PrismaContract,
  user?: AuthenticatedUser,
): ProcedureContext {
  if (!user) {
    return {
      prisma,
      request: new Request("http://localhost/rpc"),
    };
  }

  return {
    prisma,
    request: new Request("http://localhost/rpc"),
    session: {
      id: `session-${user.id}`,
      userId: user.id,
      expiresAt: new Date("2030-01-01T00:00:00.000Z"),
    },
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: true,
      image: null,
    },
  };
}

async function resetTestUsers(prisma: PrismaContract): Promise<void> {
  await prisma.user.deleteMany({
    where: {
      email: {
        in: testUsers.map((user) => user.email),
      },
    },
  });
}

async function createUser(
  prisma: PrismaContract,
  user: AuthenticatedUser,
): Promise<void> {
  await prisma.user.create({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: true,
      image: null,
    },
  });
}

async function createNote(
  prisma: PrismaContract,
  input: {
    id: string;
    userId: string;
    title: string;
    content: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
): Promise<void> {
  await prisma.note.create({
    data: {
      id: input.id,
      user_id: input.userId,
      title: input.title,
      content: input.content,
      created_at: input.createdAt,
      updated_at: input.updatedAt,
    },
  });
}

describe("notes router", () => {
  beforeEach(async () => {
    const { prisma } = await loadModules();

    await resetTestUsers(prisma);
  });

  afterAll(async () => {
    try {
      const { prisma, prismaPool } = await loadModules();

      await prisma.$disconnect();
      await prismaPool?.end();
    } catch {
      // The RED phase runs before the router exists.
    }
  });

  it("rejects unauthenticated list/create/update/delete calls with UNAUTHORIZED", async () => {
    const { prisma, notes } = await loadModules();
    const context = createContext(prisma);

    await expect(call(notes.list, {}, { context })).rejects.toSatisfy(
      (error: unknown) => assertORPCErrorCode(error, "UNAUTHORIZED"),
    );
    await expect(
      call(
        notes.create,
        {
          data: {
            title: "Blocked create",
            content: "Blocked create",
          },
        },
        { context },
      ),
    ).rejects.toSatisfy(
      (error: unknown) => assertORPCErrorCode(error, "UNAUTHORIZED"),
    );
    await expect(
      call(
        notes.update,
        {
          where: {
            id: "missing-note",
          },
          data: {
            title: "Blocked update",
          },
        },
        { context },
      ),
    ).rejects.toSatisfy(
      (error: unknown) => assertORPCErrorCode(error, "UNAUTHORIZED"),
    );
    await expect(
      call(
        notes.delete,
        {
          where: {
            id: "missing-note",
          },
        },
        { context },
      ),
    ).rejects.toSatisfy(
      (error: unknown) => assertORPCErrorCode(error, "UNAUTHORIZED"),
    );
  });

  it("lists only the current user's notes ordered by updated_at desc", async () => {
    const { prisma, notes } = await loadModules();

    await createUser(prisma, testUsers[0]);
    await createUser(prisma, testUsers[1]);
    await createNote(prisma, {
      id: "notes-router-user-1-older",
      userId: testUsers[0].id,
      title: "Older user 1 note",
      content: null,
      createdAt: new Date("2026-03-25T09:00:00.000Z"),
      updatedAt: new Date("2026-03-25T09:00:00.000Z"),
    });
    await createNote(prisma, {
      id: "notes-router-user-2-note",
      userId: testUsers[1].id,
      title: "User 2 note",
      content: null,
      createdAt: new Date("2026-03-25T09:05:00.000Z"),
      updatedAt: new Date("2026-03-25T09:05:00.000Z"),
    });
    await createNote(prisma, {
      id: "notes-router-user-1-newer",
      userId: testUsers[0].id,
      title: "Newer user 1 note",
      content: "Most recent",
      createdAt: new Date("2026-03-25T09:10:00.000Z"),
      updatedAt: new Date("2026-03-25T09:10:00.000Z"),
    });

    const result = await call(notes.list, {}, {
      context: createContext(prisma, testUsers[0]),
    });

    expect(result.map((note) => note.id)).toEqual([
      "notes-router-user-1-newer",
      "notes-router-user-1-older",
    ]);
  });

  it("creates, updates, and deletes only the current user's notes", async () => {
    const { prisma, notes } = await loadModules();

    await createUser(prisma, testUsers[0]);

    const createdNote = await call(
      notes.create,
      {
        data: {
          title: "Created from procedure",
          content: "Initial content",
        },
      },
      {
        context: createContext(prisma, testUsers[0]),
      },
    );

    expect(createdNote.user_id).toBe(testUsers[0].id);
    expect(createdNote.title).toBe("Created from procedure");

    const updatedNote = await call(
      notes.update,
      {
        where: {
          id: createdNote.id,
        },
        data: {
          title: "Updated from procedure",
          content: "Updated content",
        },
      },
      {
        context: createContext(prisma, testUsers[0]),
      },
    );

    expect(updatedNote.title).toBe("Updated from procedure");
    expect(updatedNote.content).toBe("Updated content");

    const deletedNote = await call(
      notes.delete,
      {
        where: {
          id: createdNote.id,
        },
      },
      {
        context: createContext(prisma, testUsers[0]),
      },
    );

    expect(deletedNote.id).toBe(createdNote.id);
    expect(
      await prisma.note.findUnique({
        where: {
          id: createdNote.id,
        },
      }),
    ).toBeNull();
  });

  it("treats another user's note as NOT_FOUND for update and delete", async () => {
    const { prisma, notes } = await loadModules();

    await createUser(prisma, testUsers[0]);
    await createUser(prisma, testUsers[1]);
    await createNote(prisma, {
      id: "notes-router-user-2-protected",
      userId: testUsers[1].id,
      title: "Protected note",
      content: "Must stay untouched",
      createdAt: new Date("2026-03-25T09:00:00.000Z"),
      updatedAt: new Date("2026-03-25T09:00:00.000Z"),
    });

    await expect(
      call(
        notes.update,
        {
          where: {
            id: "notes-router-user-2-protected",
          },
          data: {
            title: "Should not update",
          },
        },
        {
          context: createContext(prisma, testUsers[0]),
        },
      ),
    ).rejects.toSatisfy((error: unknown) => assertORPCErrorCode(error, "NOT_FOUND"));
    await expect(
      call(
        notes.delete,
        {
          where: {
            id: "notes-router-user-2-protected",
          },
        },
        {
          context: createContext(prisma, testUsers[0]),
        },
      ),
    ).rejects.toSatisfy((error: unknown) => assertORPCErrorCode(error, "NOT_FOUND"));

    expect(
      await prisma.note.findUniqueOrThrow({
        where: {
          id: "notes-router-user-2-protected",
        },
      }),
    ).toMatchObject({
      title: "Protected note",
      user_id: testUsers[1].id,
    });
  });

  it("returns NOT_FOUND when updating or deleting a missing note", async () => {
    const { prisma, notes } = await loadModules();

    await createUser(prisma, testUsers[0]);

    await expect(
      call(
        notes.update,
        {
          where: {
            id: "missing-note",
          },
          data: {
            title: "No-op",
          },
        },
        {
          context: createContext(prisma, testUsers[0]),
        },
      ),
    ).rejects.toSatisfy((error: unknown) => assertORPCErrorCode(error, "NOT_FOUND"));
    await expect(
      call(
        notes.delete,
        {
          where: {
            id: "missing-note",
          },
        },
        {
          context: createContext(prisma, testUsers[0]),
        },
      ),
    ).rejects.toSatisfy((error: unknown) => assertORPCErrorCode(error, "NOT_FOUND"));
  });
});
