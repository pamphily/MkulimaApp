import { courseHandler } from "../handlers/courseHandler";

export function configureCourseRoutes(app) {
    return app
        .get("/:id", courseHandler.fetchById)
        .post("/", courseHandler.enrollUser)
}