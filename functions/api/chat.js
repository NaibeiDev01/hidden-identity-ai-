
export async function onRequestPost({ request, env }) {
  try {
    const { message } = await request.json();

    if (
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return Response.json(
        { error: "Please enter a message." },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return Response.json(
        { error: "Your message is too long." },
        { status: 400 }
      );
    }

    const result = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          {
            role: "system",
            content:
              "You are Hidden Identity AI, a helpful assistant for learning, business, technology, and everyday questions. Give clear, accurate answers."
          },
          {
            role: "user",
            content: message.trim()
          }
        ]
      }
    );

    return Response.json({
      reply: result.response
    });
  } catch (error) {
    return Response.json(
      { error: "The AI service is temporarily unavailable." },
      { status: 500 }
    );
  }
}
