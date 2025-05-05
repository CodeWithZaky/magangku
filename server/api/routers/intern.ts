import { MagangStatus } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const internRouter = createTRPCRouter({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);

    // Get total interns
    const totalInterns = await ctx.prisma.intern.count();

    // Get active interns
    const activeInterns = await ctx.prisma.intern.count({
      where: { status: MagangStatus.AKTIF },
    });

    // Get completed interns
    const completedInterns = await ctx.prisma.intern.count({
      where: { status: MagangStatus.SELESAI },
    });

    // Get interns ending soon (within 7 days)
    const endingSoonInterns = await ctx.prisma.intern.count({
      where: {
        status: MagangStatus.AKTIF,
        endDate: {
          gte: today,
          lte: sevenDaysFromNow,
        },
      },
    });

    // Get list of interns ending soon
    const endingSoonInternsList = await ctx.prisma.intern.findMany({
      where: {
        status: MagangStatus.AKTIF,
        endDate: {
          gte: today,
          lte: sevenDaysFromNow,
        },
      },
      orderBy: { endDate: "asc" },
      take: 5,
    });

    return {
      totalInterns,
      activeInterns,
      completedInterns,
      endingSoonInterns,
      endingSoonInternsList,
    };
  }),

  getInterns: protectedProcedure
    .input(
      z.object({
        search: z.string().optional().default(""),
        status: z.string().optional(),
        page: z.number().optional().default(1),
        limit: z.number().optional().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      // Pastikan semua parameter memiliki nilai default
      const search = input.search || "";
      const status = input.status;
      const page = input.page || 1;
      const limit = input.limit || 10;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { institution: { contains: search, mode: "insensitive" } },
        ];
      }

      if (status) {
        where.status = status;
      }

      // Get interns with pagination
      const interns = await ctx.prisma.intern.findMany({
        where,
        orderBy: { startDate: "desc" },
        skip,
        take: limit,
      });

      // Get total count for pagination
      const totalCount = await ctx.prisma.intern.count({ where });
      const totalPages = Math.ceil(totalCount / limit);

      return {
        interns,
        totalCount,
        totalPages,
        currentPage: page,
      };
    }),

  getInternById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const intern = await ctx.prisma.intern.findUnique({
        where: { id: input.id },
      });

      if (!intern) {
        throw new Error("Peserta magang tidak ditemukan");
      }

      return intern;
    }),

  createIntern: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Nama harus diisi"),
        institution: z.string().min(1, "Asal instansi harus diisi"),
        startDate: z.date(),
        endDate: z.date(),
        status: z.enum([MagangStatus.AKTIF]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.intern.create({
        data: input,
      });
    }),

  updateIntern: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Nama harus diisi"),
        institution: z.string().min(1, "Asal instansi harus diisi"),
        startDate: z.date(),
        endDate: z.date(),
        status: z.enum([
          MagangStatus.AKTIF,
          MagangStatus.SELESAI,
          MagangStatus.DIBATALKAN,
          MagangStatus.TIDAK_LULUS,
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      return await ctx.prisma.intern.update({
        where: { id },
        data,
      });
    }),

  deleteIntern: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.intern.delete({
        where: { id: input.id },
      });
    }),
});
