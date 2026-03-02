import { serve } from "bun";
import index from "./index.html";

const videoFiles = {
  "audio-recognition": "录音识别声音.mp4",
  "behavior-recognition": "视频行为.mp4",
  "emotion-recognition": "拍照识别情绪.mp4",
  "health-analysis": "健康分析.mp4",
  "smart-qa": "智能问答.mp4",
} as const;

const parseRange = (value: string, size: number): [number, number] | null => {
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim());

  if (!match) {
    return null;
  }

  const [, startText, endText] = match;

  if (startText === "" && endText === "") {
    return null;
  }

  let start = startText === "" ? Number.NaN : Number(startText);
  let end = endText === "" ? Number.NaN : Number(endText);

  if (Number.isNaN(start)) {
    if (Number.isNaN(end) || end <= 0) {
      return null;
    }

    start = Math.max(size - end, 0);
    end = size - 1;
  } else {
    if (start < 0 || start >= size) {
      return null;
    }

    if (Number.isNaN(end) || end >= size) {
      end = size - 1;
    }
  }

  if (end < start) {
    return null;
  }

  return [start, end];
};

const server = serve({
  port: 0,
  routes: {
    // Serve index.html at the root path.
    "/": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },

    "/videos/:id": async req => {
      const id = req.params.id;

      if (!(id in videoFiles)) {
        return new Response("Not found", { status: 404 });
      }

      const fileName = videoFiles[id as keyof typeof videoFiles];
      const file = Bun.file(new URL(`./assets/videos/${fileName}`, import.meta.url));

      if (!(await file.exists())) {
        return new Response("Not found", { status: 404 });
      }

      const size = file.size;
      const range = req.headers.get("range");
      const headers = {
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "video/mp4",
      };

      if (!range) {
        return new Response(file, {
          headers: {
            ...headers,
            "Content-Length": `${size}`,
          },
        });
      }

      const parsedRange = parseRange(range, size);

      if (!parsedRange) {
        return new Response(null, {
          status: 416,
          headers: {
            ...headers,
            "Content-Range": `bytes */${size}`,
          },
        });
      }

      const [start, end] = parsedRange;

      return new Response(file.slice(start, end + 1), {
        status: 206,
        headers: {
          ...headers,
          "Content-Length": `${end - start + 1}`,
          "Content-Range": `bytes ${start}-${end}/${size}`,
        },
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
