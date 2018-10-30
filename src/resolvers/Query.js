async function feed(parent, args, context) {
  const where = args.filter
    ? {
      OR: [
        { name_contains: args.filter },
        { category: { name_contains: args.filter } },
        { location: { name_contains: args.filter } },
        { people: { user: { OR: { name_contains: args.filter, email_contains: args.filter } } } },
      ],
    }
    : {};

  const queriedEvents = await context.db.query.events(
    {
      where, skip: args.skip, first: args.first, orderBy: args.orderBy,
    },
    '{ id }',
  );

  const countSelectionSet = `
    {
      aggregate {
        count
      }
    }
  `;
  const eventsConnection = await context.db.query.eventsConnection({}, countSelectionSet);

  return {
    count: eventsConnection.aggregate.count,
    eventIds: queriedEvents.map(event => event.id),
  };
}

module.exports = {
  feed,
};
