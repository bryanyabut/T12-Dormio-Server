const SearchFilter = (req, searchField = []) => {
    const where = {};
    const AND = [];
    const OR = [];
    const search = req.query.search;

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

    return where;
    
}

module.exports = SearchFilter;