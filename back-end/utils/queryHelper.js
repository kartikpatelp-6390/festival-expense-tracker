// utils/queryHelper.js

const queryHelper = async (model, queryParams = {}, searchFields = [], populateOptions = []) => {
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = queryParams.sort || '-createdAt';
    const search = queryParams.search || null;

    // Build filter query object
    const queryObject = { ...queryParams };
    ['page', 'limit', 'sort', 'search'].forEach(param => delete queryObject[param]);

    // Apply search logic
    if (search && searchFields.length > 0) {
        queryObject.$or = searchFields.map(field => ({
            [field]: { $regex: `.*${search}.*`, $options: 'i' }
        }));
    }

    let query = model.find(queryObject);

    // Apply population
    if (populateOptions && populateOptions.length > 0) {
        populateOptions.forEach(populate => {
            query = query.populate(populate);
        });
    }

    // Apply sorting, pagination
    const total = await model.countDocuments(queryObject);
    const data = await query.sort(sortBy).skip(skip).limit(limit).exec();

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

module.exports = queryHelper;
