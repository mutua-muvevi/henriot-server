const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../../index"); // Modify this path accordingly
const expect = chai.expect;

chai.use(chaiHttp);

describe("Fetch Assets Controller", () => {
	it("should fetch assets", async () => {
		const res = await chai.request(app).get("/api/assets/all"); // Adjust the route as needed

		expect(res).to.have.status(201); // Modify the expected status code
		expect(res.body.success).to.be.true;
		expect(res.body.data).to.be.an("array"); // Modify the expected data structure
	});

	// Add more tests if needed
});
