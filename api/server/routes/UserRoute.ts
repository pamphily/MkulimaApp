import { usersHandler } from "../handlers/UserHandler";
// import { apiMiddleware } from "../middleware/ApiMiddleware";

export function configureUserRoutes(app) {
    return app
        .get("/", usersHandler.getUser)
        .guard({ body: usersHandler.validateCreateUser }, (guardApp) =>
            guardApp
                .post("/", usersHandler.createUser) 
        )
        // .get("/:id", usersHandler.getUserById, {
        //     // beforeHandle: apiMiddleware
        // })
        .delete("/:id", usersHandler.deleteUser, {
            // beforeHandle: apiMiddleware
        })
        .post("/login", usersHandler.loginUser)
}
