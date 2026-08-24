const { z } = require("zod");

const envSchema = z.object({
    PORT: z.string().default("5000")
});

const env = envSchema.parse(process.env);

module.exports = env;