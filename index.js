const uuidv1 = require("uuid/v1");
const triplesec = require("triplesec");

module.exports = function Keychain() {
  this.keys = {};

  this.addKey = key => {
    const id = uuidv1();
    this.keys[id] = key;

    return id;
  };

  this.removeKey = id => {
    if (!this.keys[id]) return false;

    delete this.keys[id];
    return true;
  };

  this.encrypt = password =>
    new Promise((resolve, reject) => {
      triplesec.encrypt(
        {
          data: new triplesec.Buffer(JSON.stringify(this.keys)),
          key: new triplesec.Buffer(password)
        },
        (err, buff) => {
          if (err) return reject(err);
          return resolve(buff.toString("hex"));
        }
      );
    });

  this.decrypt = (data, password) =>
    new Promise((resolve, reject) => {
      triplesec.decrypt(
        {
          data: new triplesec.Buffer(data, "hex"),
          key: new triplesec.Buffer(password)
        },
        (err, buff) => {
          if (err) return reject(err);
          this.keys = JSON.parse(buff.toString());
          return resolve(true);
        }
      );
    });
};
