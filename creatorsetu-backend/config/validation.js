const { z } = require("zod");

const testSchema = z.object({
    name: z.string().min(2)
});

module.exports = { testSchema };