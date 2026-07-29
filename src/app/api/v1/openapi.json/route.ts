import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "AI0FY API",
      description: "AI Gateway SaaS - unified API endpoint with multi-provider auto-fallback, subscription management, and multi-tenant architecture",
      version: "0.1.0",
      contact: {
        name: "AI0FY",
        url: process.env.NEXT_PUBLIC_APP_URL ?? "https://ai0fy.ai",
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        description: process.env.NODE_ENV === "production" ? "Production" : "Development",
      },
    ],
    paths: {
      "/v1/chat/completions": {
        post: {
          operationId: "createChatCompletion",
          summary: "Create a chat completion",
          description: "Creates a model response for the given chat conversation. Compatible with OpenAI API.",
          security: [{ bearerAuth: [] }],
          tags: ["Chat"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["model", "messages"],
                  properties: {
                    model: {
                      type: "string",
                      description: "Model ID or combo preset (auto, fast, cheap). Supports 30+ providers.",
                      example: "gpt-4o",
                    },
                    messages: {
                      type: "array",
                      minItems: 1,
                      maxItems: 1000,
                      items: {
                        type: "object",
                        required: ["role"],
                        properties: {
                          role: {
                            type: "string",
                            enum: ["system", "user", "assistant", "tool", "function"],
                          },
                          content: {
                            oneOf: [
                              { type: "string" },
                              {
                                type: "array",
                                items: {
                                  type: "object",
                                  properties: {
                                    type: { type: "string" },
                                    text: { type: "string" },
                                    image_url: {
                                      type: "object",
                                      properties: {
                                        url: { type: "string" },
                                      },
                                    },
                                  },
                                },
                              },
                            ],
                          },
                          name: { type: "string" },
                        },
                      },
                    },
                    temperature: {
                      type: "number",
                      minimum: 0,
                      maximum: 2,
                      description: "Sampling temperature",
                    },
                    max_tokens: {
                      type: "integer",
                      minimum: 1,
                      maximum: 200000,
                      description: "Maximum tokens to generate",
                    },
                    stream: {
                      type: "boolean",
                      default: false,
                      description: "Enable streaming responses",
                    },
                    tools: {
                      type: "array",
                      maxItems: 128,
                      items: {
                        type: "object",
                        properties: {
                          type: { type: "string", enum: ["function"] },
                          function: {
                            type: "object",
                            properties: {
                              name: { type: "string" },
                              description: { type: "string" },
                              parameters: { type: "object" },
                            },
                          },
                        },
                      },
                    },
                    tool_choice: {
                      oneOf: [
                        { type: "string", enum: ["none", "auto", "required"] },
                        {
                          type: "object",
                          properties: {
                            type: { type: "string" },
                            function: {
                              type: "object",
                              properties: { name: { type: "string" } },
                            },
                          },
                        },
                      ],
                    },
                    response_format: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["text", "json_object", "json_schema"] },
                      },
                    },
                    seed: { type: "integer" },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Successful completion",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      object: { type: "string" },
                      created: { type: "integer" },
                      model: { type: "string" },
                      choices: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            index: { type: "integer" },
                            message: {
                              type: "object",
                              properties: {
                                role: { type: "string" },
                                content: { type: "string" },
                              },
                            },
                            finish_reason: { type: "string" },
                          },
                        },
                      },
                      usage: {
                        type: "object",
                        properties: {
                          prompt_tokens: { type: "integer" },
                          completion_tokens: { type: "integer" },
                          total_tokens: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
              headers: {
                "x-provider": {
                  schema: { type: "string" },
                  description: "The AI provider that served the request",
                },
                "x-model-used": {
                  schema: { type: "string" },
                  description: "The actual model used",
                },
                "x-latency-ms": {
                  schema: { type: "string" },
                  description: "Request latency in milliseconds",
                },
              },
            },
            "400": {
              description: "Invalid request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "object",
                        properties: {
                          code: { type: "string" },
                          message: { type: "string" },
                          details: { type: "object" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Unauthorized - Invalid or missing API key",
            },
            "429": {
              description: "Rate limited or quota exceeded",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: {
                        type: "object",
                        properties: {
                          code: { type: "string" },
                          message: { type: "string" },
                          retryAfter: { type: "integer" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        options: {
          operationId: "chatCompletionsOptions",
          summary: "CORS preflight",
          tags: ["Chat"],
          responses: {
            "204": { description: "CORS preflight successful" },
          },
        },
      },
      "/v1/models": {
        get: {
          operationId: "listModels",
          summary: "List available models",
          description: "Returns a list of all available AI models for the authenticated tenant.",
          security: [{ bearerAuth: [] }],
          tags: ["Models"],
          responses: {
            "200": {
              description: "List of models",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      object: { type: "string", example: "list" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            object: { type: "string", example: "model" },
                            created: { type: "integer" },
                            owned_by: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/health": {
        get: {
          operationId: "healthCheck",
          summary: "Health check",
          tags: ["System"],
          responses: {
            "200": { description: "Service is healthy" },
            "503": { description: "Service is unhealthy" },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "API key prefixed with 'ast_'",
        },
      },
    },
    tags: [
      { name: "Chat", description: "Chat completion endpoints" },
      { name: "Models", description: "Model listing endpoints" },
      { name: "System", description: "System health and status" },
    ],
  };

  return NextResponse.json(spec, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
