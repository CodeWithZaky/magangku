import { hash } from "bcrypt";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  createAdmin: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nama harus diisi"),
        email: z.string().email("Email tidak valid"),
        password: z.string().min(6, "Password minimal 6 karakter"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      // Check if admin with email already exists
      const existingAdmin = await ctx.prisma.admin.findUnique({
        where: { email },
      });

      if (existingAdmin) {
        throw new Error("Email sudah terdaftar");
      }

      // Hash password
      const passwordHash = await hash(password, 10);

      // Create admin
      return await ctx.prisma.admin.create({
        data: {
          name,
          email,
          passwordHash,
        },
      });
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const admin = await ctx.prisma.admin.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new Error("Admin tidak ditemukan");
    }

    return admin;
  }),
});
