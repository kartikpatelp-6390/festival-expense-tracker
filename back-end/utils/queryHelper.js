// utils/queryHelper.js

const queryHelper = async (model, queryParams = {}, searchFields = [], populateOptions = []) => {
    const hasPagination =
        Object.prototype.hasOwnProperty.call(queryParams, 'page') &&
        Object.prototype.hasOwnProperty.call(queryParams, 'limit');
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = queryParams.sort || '-createdAt';
    const search = queryParams.search || null;

    // Build filter query object
    const queryObject = { ...queryParams };
    ['page', 'limit', 'sort', 'search'].forEach(param => delete queryObject[param]);

    // Convert boolean-like strings to real booleans (e.g. isDone = "true")
    Object.keys(queryObject).forEach((key) => {
        if (queryObject[key] === 'true') queryObject[key] = true;
        else if (queryObject[key] === 'false') queryObject[key] = false;
    });

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
    // Apply sorting
    query = query.sort(sortBy);

    // Apply pagination only if page & limit provided
    if (hasPagination) {
        query = query.skip(skip).limit(limit);
    }

    const data = await query.exec();

    const response = { data };

    // Include pagination metadata only if pagination is applied
    if (hasPagination) {
        response.pagination = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    return response;
};

module.exports = queryHelper;
