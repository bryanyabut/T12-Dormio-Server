const SearchFilter = (req, searchField = []) => {
    const where = {};
    const AND = [];
    const OR = [];
    let { search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc'} = req.query;

    if (sortBy && sortBy.includes(':')) {
        const [field, order] = sortBy.split(':');
        sortBy = field;
        sortOrder = order;
    }

    if (search &&  searchField.length > 0) {
        searchField.forEach(field => {
            if (field.includes('.')) {
                const [relation, subfield] = field.split('.');

                OR.push({
                    [relation]: {
                        [subfield]: { contains: search, mode: 'insensitive' }
                    }
                });
            } else {
                OR.push({
                    [field]: { 
                        contains: search, 
                        mode: 'insensitive'
                    }
                });
            }
        });
    }

    if (OR.length > 0) {
        AND.push({ OR });
    }

    if(AND.length > 0){
        where.AND = AND;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const take = Number(limit);
    
    const orderBy = { 
        [sortBy]: sortOrder 
    }

    return { where, skip, take, orderBy };
    
}

module.exports = SearchFilter;