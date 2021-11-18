class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //Build Query
    //1. Built a DEEP COPY of query request object
    const queryObj = { ...this.queryString };

    //2. Filtering Exclude special words for data fields
    const excludeSpecialWords = ['sort', 'limit', 'page', 'fields'];
    excludeSpecialWords.forEach((el) => delete queryObj[el]);

    //3. Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|lt|gt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      //Implement default query here.
      // this.query = this.query.sort('createdAt');
      //"-" use to sort results in descending order
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1; //setting default value if not specified
    const limit = this.queryString.limit * 1 || 100; //multiply string Number with 1 to convert type;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
