import { courseService } from "../services/CourseService";
import { enrollCallback } from "../utils/dlabs";
import { verifyToken } from "../utils/jwt";

export const courseHandler = {
    enrollUser: async ({params, cookie, set, headers}) => {
        const bearer = headers.authorization.split(" ")[1];
        const { id: userId } = verifyToken(cookie.auth?.value || bearer )
        // enroll on dlabs
        const enroll = await enrollCallback(userId, params.courseId)
    
        if (enroll) {
          await courseService.addCourse({
            id: params.id,
          })
        }
      },

    fetchAll: async() => {

    },

    fetchById: async(params, set) => {
        const course = await courseService.fetchCourseById(params.courseId)

        set.status= 200

        return {
            status: "success",
            message: "",
            data: course          
        }
    }
}