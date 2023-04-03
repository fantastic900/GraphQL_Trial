const Query = {
    greeting: () => 'Test Success, GraphQL server is up & running!!',
    sayHello:(root, args, context, info) => `Hi ${args.name} GraphQL server says Hello to you!`
}
module.exports = {Query}