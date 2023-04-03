const db = require('./db')

const Query = {
    greeting: () => 'Test Success, GraphQL server is up & running!!',
    sayHello:(root, args, context, info) => `Hi ${args.name} GraphQL server says Hello to you!`,
    students: () => db.students.list(),
}

const Student = {
    college: (root) => {
        return db.colleges.get(root.collegeId);
    }
}

module.exports = {Query, Student}