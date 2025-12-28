# Archived

This project has been archived and abandoned. I graduated from WPI in December of 2025 so I no longer have motivation to continue working on this.

Linked below is another student's more complete implementation. It relies on a constant polling of the remote data, which is not ideal, but the UX and completeness is far better.
https://github.com/lexm2/wpiplannerV2

In the event someone wants to use this code as a jumping off point for a better implementation than above, I am licensing my code under the MIT license. Just please leave a small accredation (and reach out!).

I had hoped to provide the successor to the program my mentor left behind, but that's OK! Please reach out to me if someone is looking to pick this up and would like help understanding the code.

# planner2
Created by Zen Dignan <zen@dignan.dev>

This project and repository is not affiliated with nor endorsed by Worcester Polytechnic Institute.

## Getting Started
You'll need the following installed:
- Git
- Node with NPM
- [Gompei's CORS Bypass](https://github.com/zenisbestwolf/gcbp) running on port `8081`.
### Developing
Set up the development environment like so:
1. Clone this repository.
2. In the repository directory, run `npm ci`.
3. Run `npm run start`.
4. Navigate to [localhost:8080](http://localhost:8080).

### Building for Deployment
You can deploy a production ready version of the application by serving the bundle.
1. Clone this repository.
2. In the repostiory directory, run `npm ci`.
3. Run `npm run build`.
4. Serve the `dist` folder as you see fit.

## Development Phases
### Phase 1
The first phase of the project is to be on-par with the exiting WPI Planner. This consists of:
1. Schedule building without conflicts
2. "Favoriting" schedules.
3. View Undergraduate and Graduate courses for a singular academic year, excluding summer courses.
4. Defining time preferences in order to avoid early or late courses.

### Phase 2
The second phase of the project is to augment it with basic improvements. This may require more intense HCI studies. The goals include:
1. Functional mobile support.
2. Support for summer terms.
3. Proper support for multi-year viewing.
4. Workday Schedule Importing (Optional)

### Phase 3
The third phase is the final phase that will involve intense work from the author. The application should achieve production quality stability, testing, and code organization. The project should live in this phase until additional work is planned by other teams.
