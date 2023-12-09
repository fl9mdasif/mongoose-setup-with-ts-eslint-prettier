import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // search query method
  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (this?.query?.searchTerm) {
      this.modelQuery = this?.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }
    return this;
  }

  // filter query method
  filter() {
    // copy query
    const queryObj = { ...this.query };

    // filter
    const excludeQuery = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeQuery.forEach((el) => delete queryObj[el]);

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  // sort query
  sort() {
    const sort = this?.query?.sort || '-createdAt';

    this.modelQuery = this?.modelQuery.sort(sort as FilterQuery<T>);

    return this;
  }

  // paginate query

  paginate() {
    //limit response query

    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  // field query
  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
