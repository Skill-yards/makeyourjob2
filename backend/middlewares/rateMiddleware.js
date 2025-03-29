
// More customizable options
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    
    // Skip certain requests (optional)
    skip: (req) => {
        // Example: Skip rate limiting for specific routes
        return req.path === '/api/v1/healthcheck';
    },
    
    // Custom key generator (optional)
    keyGenerator: (req) => {
        // You could use something other than IP, like user ID if authenticated
        return req.ip; 
    },
    
    // Store configuration (default is MemoryStore)
    // For production, consider using Redis
    // store: new RedisStore({ client: redisClient }),
    
    // Headers configuration
    headers: {
        'Retry-After': true,
        'X-RateLimit-Limit': true,
        'X-RateLimit-Remaining': true,
        'X-RateLimit-Reset': true
    }
});