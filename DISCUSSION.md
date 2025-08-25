### Strategy

For this assignment, my focus was on improving the current functionality of the application and increasing the resiliency, scalability, and usability of the existing code. To that end, I focused on improving the UX/UI to be clean, readable, and easy to navigate so the user could easily find the information they were looking for on whatever device they were using it on. I also ensured that that experience would continue long into data maturity by implementing pagination and filtering to the route handler, limiting the amount of data fetched at once. I further improved this functionality by adding data caching to the route handler. This helps limit the data transfer further validating if the data has changed before refetching, and otherwise storing the fetched data so that it may be reused, rather than refetching every time the page changes.

### Future Improvements

* **UI**
- Add the ability to add/edit advocates
- Provide profile pages for each advocate to expand the info available
- Branding/styling more in-line with Solace internal guidelines
- Better error handling and feedback

* **API**
- Connection pooling of database connections for reduced latency
- Rate limiting to prevent abuse of data retrieval
- Data validation and modeling
- Message Queueing with RabbitMQ or Kafka for better asynchronous data transfer

* **Testing**
- Unit Testing with Jest
- Integration/Component Testiing with a tool like Cypress/Selenium/Playwright
- Accessibility Training to maintain A11y compliance
- Static Application Security Testing for internal code based vulnerabilities
- Dynamic Application Security Testing for runtime vulnerabilities
- Software Composition Analysis for dependency safety

* **Infrastructure (assuming AWS)**
- Error logging and monitoring with Cloudwatch
- Container management and orchestration with ECS and EKS
- Infrastructure redundancy using multiple server instances across Availability Zones
- Managing high traffic with multiple server/db instances and Load Balancers
