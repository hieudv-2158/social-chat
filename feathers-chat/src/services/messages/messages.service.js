// Initializes the `messages` service on path `/messages`
const { Messages } = require('./messages.class');
const createModel = require('../../models/messages.model');
const hooks = require('./messages.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  // app.use('/messages', new Messages(options, app));
  app.use('/messages', {
    async find(params) {
      return [1];
    },
    async get(id, params) {},
    async create(data, params) {},
    async update(id, data, params) {},
    async patch(id, data, params) {},
    async remove(id, params) {},
    setup(app, path) {
      var self = this;

      app.get(path + '/count', function(req, res) {
        return res.send(1)
        self.count(function(error, data) {
          res.end(data);
        });
      });
    }
  });

  // Get our initialized service so that we can register hooks
  const service = app.service('messages');

  service.hooks(hooks);

  // Override the default publish so we only send data within
  // these channels
  service.publish((data, hook) => {
    console.log('bbb', data)
    return app.channel(`userIds/${data.to}`)
  })
};
