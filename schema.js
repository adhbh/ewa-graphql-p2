import {
	GraphQLInt,
	GraphQLBoolean,
	GraphQLID,
	GraphQLNonNull,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList
} from 'graphql'

import fetch from 'node-fetch'

const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: '...',
    fields: () => ({
        login: { type: GraphQLString },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        about: {
            type: GraphQLString,
            resolve: (user) => {
                return user.bio
            }
        },
        following: { type: GraphQLInt },
        followers: { type: GraphQLInt },
        followersList: {
            type: new GraphQLList(UserType),
            resolve: (user, args, { loaders }) => {
                return fetch('https://api.github.com/users/' + user.login + '/followers?client_id=f64f7957d1ad23b29a94&client_secret=7f8c1767535a86c48efc2fe34a03558d91f94eb4')
                    .then(res => res.json())
                    .then(followers => followers.map(follower => follower.url))
                    .then(urls => loaders.user.loadMany(urls))
            },
        },
    }),
})

const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',
    fields: {
        user: {
            type: UserType,
            args: {
                login: { type: GraphQLString }
            },
            resolve: (root, args) => fetch('https://api.github.com/users/' + args.login + '?client_id=f64f7957d1ad23b29a94&client_secret=7f8c1767535a86c48efc2fe34a03558d91f94eb4')
                    .then(res => res.json())
        },
    },
})

export default new GraphQLSchema({
	query: QueryType,
});