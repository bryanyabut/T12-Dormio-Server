const SearchFilter = (req, searchField = []) => {
    const where = {};
    const search = req.query.search;

    if (search &&  searchField.length > 0) {
        where.OR = searchField.map(field => ({
            [field]: { contains: search, mode: 'insensitive' }
        }));
    }

    return where;
    
}

module.exports = SearchFilter;