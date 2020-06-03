{{#each @root.swagger.endpoints}}
import { router as {{this}}Route } from "./{{this}}Route";
{{/each}}
import { Router } from "express";

const router = Router();

/*
 * Routes
 */
{{#each @root.swagger.endpoints}}
router.use('/{{this}}', {{this}}Route);
{{/each}}

export { router };
