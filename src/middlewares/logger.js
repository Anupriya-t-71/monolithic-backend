export const apiLogs = [];

export const logMiddleware = (req, res, next) => {
  // Store original res.json function
  const originalJson = res.json.bind(res);

  res.json = function (data) {
    try {
      // Debugging: Log before modifying anything
      console.log("Before Logging: ", typeof data, data);

      // Ensure response data is JSON-safe
      const responseBody = JSON.stringify(data, (key, value) =>
        typeof value === "object" && value !== null ? "[Circular]" : value
      );

      apiLogs.unshift({
        method: req.method,
        endpoint: req.originalUrl,
        status: "success",
        message: "API call successful",
        requestBody: req.body ?? null,
        responseBody, // Store as string to prevent circular reference issues
        timestamp: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
        }),
      });

    } catch (error) {
      console.error("Logging error:", error.message);
    }

    // Ensure we return the response correctly
    return originalJson(data);
  };

  next();
};
