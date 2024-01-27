const NodeCache = require('node-cache');
const cache = new NodeCache();

exports.handleCaching = async (cacheKey, model, successMessage, errorMessage, req, res) => {
    try {
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log(`${cacheKey} data served from cache`);
            return res.status(200).json({
                success: true,
                message: `${cacheKey} retrieved successfully`,
                data: JSON.parse(cachedData), // Parse the JSON string back to an object
            });
        }

        const allData = await model.find();

        // Store data in cache with a time-to-live (TTL) of 1 hour (in seconds)
        cache.set(cacheKey, JSON.stringify(allData), 3600);

        console.log(`${cacheKey} data fetched from the database`);
        res.status(200).json({
            success: true,
            message: successMessage,
            data: allData,
        });
    } catch (error) {
        console.error(`Error fetching ${cacheKey}:`, error);
        res.status(500).json({
            success: false,
            message: errorMessage,
            error: error.message,
        });
    }
};

