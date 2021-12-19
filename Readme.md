# The Rest Architecture

### Seperate API into logical resources

### Exposed structured, resource-based Urls

### Use HTTP methods (verbs)

### Send data as JSON (usually)

### Be Stateless

- State of the application should always be managed on the client side.
- Only use API's to handle the resources.


Implementation of API features: 
- Filtering and Advanced filtering like excluding gte, lte, gt and lt words from req.query
- Sorting data and results.
- Limit the number of fields for results
- Dynamic Pagination logic
- Aggregation pipeline to cater business logic via specific route handlers
- Virtual properties for Api results.

* Included a script to import data from JSON file and delete records from db.

- Authentication and Authorization workflows built in to API
