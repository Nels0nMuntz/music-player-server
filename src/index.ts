import "reflect-metadata";
import Fastify from "fastify";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { buildSchema } from "type-graphql";
import mercurius from "mercurius";
import routes from "./routes";
import { initializeDb } from "./utils/db";
import config from "./config";
import { GenresResolver } from "./models/genres";
import { TracksResolver } from "./models/tracks";

async function createSchema() {
  return buildSchema({
    resolvers: [GenresResolver, TracksResolver],
    validate: false,
  });
}

async function start() {
  try {
    // Log configuration on startup
    console.log(`Starting server in ${config.server.env} mode`);

    // Initialize database
    await initializeDb();

    const fastify = Fastify({
      logger: {
        level: config.logger.level,
        transport: config.isDevelopment
          ? {
              target: "pino-pretty",
              options: {
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
              },
            }
          : undefined,
      },
    });

    // Register plugins
    await fastify.register(cors, {
      origin: config.cors.origin,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    await fastify.register(multipart, {
      limits: {
        fileSize: config.upload.maxFileSize,
      },
    });

    // Serve static files (uploads)
    await fastify.register(fastifyStatic, {
      root: config.storage.uploadsDir,
      prefix: "/api/files/",
      decorateReply: false,
    });

    // Register Swagger
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: "Music Tracks API",
          description: "API for managing music tracks",
          version: "1.0.0",
        },
      },
    });

    // Register Swagger UI
    await fastify.register(swaggerUi, {
      routePrefix: "/documentation",
      uiConfig: {
        docExpansion: "list",
        deepLinking: true,
      },
    });

    const schema = await createSchema();
    await fastify.register(mercurius as any, {
      schema,
      resolvers: [GenresResolver, TracksResolver],
      graphiql: "playground",
    });

    // Register routes
    await fastify.register(routes);

    // Start server
    await fastify.listen({
      port: config.server.port,
      host: config.server.host,
    });

    console.log(
      `Server is running on http://${config.server.host}:${config.server.port}`
    );
    console.log(
      `Swagger documentation available on http://${config.server.host}:${config.server.port}/documentation`
    );
    console.log(`GraphQL endpoint at /graphql`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

start();
