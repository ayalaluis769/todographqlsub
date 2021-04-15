const { GraphQLServer, PubSub } = require("graphql-yoga");
const pubsub = new PubSub();

let tasks = [
    {
        id: 1001,
        title: "Clean Room",
        importantance: "low",
        created: "2021 - 04 - 05",
        tobecompleted: "2021 - 04 - 08",
        status: "ACTIVE",
    },
    {
        id: 1002,
        title: "Organzie Closet",
        importantance: "low",
        created: "2021 - 04 - 05",
        tobecompleted: "2021 - 04 - 09",
        status: "ACTIVE",
    },
    {
        id: 1003,
        title: "Suit Shopping",
        importantance: "high",
        created: "2021 - 04 - 05",
        tobecompleted: "2021 - 06 - 15",
        status: "ACTIVE",
    },
    {
        id: 1004,
        title: "Paint house",
        importantance: "medium",
        created: "2021 - 04 - 05",
        tobecompleted: "2021 - 05 - 24",
        status: "ACTIVE",
    },
    {
        id: 1005,
        title: "Finish workshop",
        importantance: "high",
        created: "2021 - 04 - 05",
        tobecompleted: "2021 - 04 - 25",
        status: "ACTIVE",
    }
];

const schema = `
    type Query {
        allTasks: [Task]
    }

    input TaskDetails {
        id: Int
        title: String
        importance: String
        created: String
        tobecompleted: String
        status: String
    }

    type Mutation {
        createTask(taskDet:TaskDetails): Task
    }

    type Task {
      id: Int
      title: String
      importance: String
      created: String
      tobecompleted: String
      status: String
    }

    type Subscription {
    task: SubscriptionPayload
    }

  type SubscriptionPayload {
    mutation: String
    data: Task
  }
`;

const getAllTasks = () => {
    return tasks;
};

const createTask = (parent, args, { pubsub }) => {
    let length = tasks.length;
    tasks[length] = args.taskDet;

    pubsub.publish("task", {
        task: {
            mutation: "CREATED",
            data: task[length]
        },
    });

    return tasks[length];
};

const root = {
    Query: {
        allTasks: getAllTasks
    },
    Mutation: {
        createTask: createTask
    },
    Subscription: {
        task: {
            subscribe(parent, args, { pubsub }) {
                return pubsub.asyncIterator('task');
            },
        },
    },
};

const app = new GraphQLServer({
    typeDefs: schema,
    resolvers: root,
    context: {
        pubsub
    },
});

const ports = {
    port: 7000,
};

app.start(ports, ({ port }) => {
    console.log(`Server listening on port ${port}`);
});
