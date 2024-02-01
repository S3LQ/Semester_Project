// middleware/loggerMiddleware.mjs
function loggerMiddleware(request, response, next) {
  // Loggerkode her
  console.log("Logger middleware: ", request.url);
  next();
}

export default loggerMiddleware;
