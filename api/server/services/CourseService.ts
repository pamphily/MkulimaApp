import { db } from "../../prisma/PrismaClient"

interface AddCourse {
  id: string
//   code: string
}

export const courseService = {
  addCourse: async (payload: AddCourse) => {
    const course = await db.course.create({
      data: {
        id: payload.id,
      },
    })
    return course
  },
  fetchCourses: async () => {
    return await db.course.findMany()
  },

  fetchCourseById: async (id: string) => {
    return await db.course.findUnique({
      where: { id },
    })
  },
}
