const express = require("express");

const router = express.Router();

router.post("/generate", async (req, res) => {
    try {
        const {
            platform,
            contentType,
            niche,
            goal,
            postsPerWeek
        } = req.body;

        if (!platform || !contentType || !niche || !goal) {
            return res.status(400).json({
                success: false,
                error: "All strategy fields are required"
            });
        }

        const ideas = [
            {
                title: `3 ${niche} mistakes beginners should avoid`,
                hook: `Stop making these ${niche} mistakes if you want faster growth.`,
                format: contentType,
                platform,
                goal
            },
            {
                title: `The truth about ${niche} nobody tells you`,
                hook: `Nobody talks about this side of ${niche}.`,
                format: contentType,
                platform,
                goal
            },
            {
                title: `5 tips to improve your ${niche} skills`,
                hook: `Here are 5 things I wish I knew when I started.`,
                format: contentType,
                platform,
                goal
            },
            {
                title: `${niche}: Beginner vs Expert`,
                hook: `Here's the difference between a beginner and an expert.`,
                format: contentType,
                platform,
                goal
            }
        ];

        res.json({
            success: true,
            context: {
                platform,
                contentType,
                niche,
                goal,
                postsPerWeek: Number(postsPerWeek)
            },
            ideas
        });

    } catch (error) {
        console.error("Strategy generation error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post("/script", async (req, res) => {
    try {
        const { title, hook } = req.body;

        if (!title || !hook) {
            return res.status(400).json({
                success: false,
                error: "Title and hook are required"
            });
        }

        const script = `
Hook:
${hook}

Introduction:
Start by directly addressing the viewer's problem related to "${title}".

Main Content:
Explain the key idea clearly in 3 short points.
Give one practical example that the audience can immediately understand.

Ending:
Ask viewers to follow for more useful content and share this with someone who needs it.
`;

        res.json({
            success: true,
            script
        });

    } catch (error) {
        console.error("Script generation error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});
module.exports = router;