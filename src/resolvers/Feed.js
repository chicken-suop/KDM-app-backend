function events(parent, args, context, info) {
  return context.db.query.events({ where: { id_in: parent.eventIds } }, info)
}

module.exports = {
  events,
}
