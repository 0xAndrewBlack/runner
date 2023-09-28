import { Router } from "express";

import exampleControllers from "./controllers/exampleController.js";
// import healthControllers from "./controllers/healthController";
import homeControllers from "./controllers/homeController.js";
// import kerdesControllers from "./controllers/kerdesController";
// import roomControllers from "./controllers/roomController";
// import superTokensControllers from "./controllers/superTokensController";

// import apiValidators from "./validators/apiValidator";
// import kerdesValidators from "./validators/kerdesValidator";
// import roomValidators from "./validators/roomValidator";
// import superTokensValidators from "./validators/superTokensValidator";

const router = () => {
  const router: Router = Router();

  router.get("/", homeControllers.home);

  router.get("/example", exampleControllers.example);

//   router.get("/health", healthControllers.healthcheck);
//   router.get("/health/live", healthControllers.healthcheckLive);
//   router.get("/health/ready", healthControllers.healthcheckReady);

  return router;
};

export default router;
