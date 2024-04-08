const testLib = require('node:test'); // Renamed 'test' to 'testLib' to avoid conflicts with the test object
const assert = require('assert');
const fs = require('fs');

// Mock the file containing names
testLib.mock.method(fs, 'readFile', (file, options, callback) => {
    callback(null, 'John\nDoe\nSmith');
});

const { Application, MailSystem } = require('./main');

testLib('MailSystem - write() method writes mail content', () => { // Renamed 'test' to 'testLib'
    const mailSystem = new MailSystem();
    const name = 'Alice';
    const context = mailSystem.write(name);
    assert.strictEqual(context, 'Congrats, Alice!');
});

testLib('MailSystem - send() method sends mail to recipient successfully', () => { // Renamed 'test' to 'testLib'
    const mailSystem = new MailSystem();
    const name = 'Alice';
    testLib.mock.method(Math, 'random', () => 0.8); // Mock Math.random() to return 0.8
    assert.strictEqual(mailSystem.send(name, 'success'), true); // Confirm successful mail sending
});

testLib('MailSystem - send() method fails to send mail to recipient', () => { // Renamed 'test' to 'testLib'
    const mailSystem = new MailSystem();
    const name = 'Alice';
    testLib.mock.method(Math, 'random', () => 0.2); // Mock Math.random() to return 0.2
    assert.strictEqual(mailSystem.send(name, 'fail'), false); // Confirm failed mail sending
});

testLib('Application - getNames retrieves names from file', async () => { // Renamed 'test' to 'testLib'
    const application = new Application([], [], {});
    await application.getNames();
    assert.deepStrictEqual(application.people, ['John', 'Doe', 'Smith']);
});

testLib('Application - getRandomPerson returns a person', async () => { // Renamed 'test' to 'testLib'
    const application = new Application([], [], {});
    await application.getNames();
    const person = application.getRandomPerson();
    assert(['John', 'Doe', 'Smith'].includes(person));
});

testLib('Application - selectNextPerson selects a person', async () => { // Renamed 'test' to 'testLib'
    const app = new Application();
    const [names] = await app.getNames();
    app.selected = ['John'];
    let count = 0;
    testLib.mock.method(app, 'getRandomPerson', () => names[count++]);
    assert.strictEqual(app.selectNextPerson(), 'Doe');
    assert.deepStrictEqual(app.selected, ['John', 'Doe']);
    assert.strictEqual(app.selectNextPerson(), 'Smith');
    assert.deepStrictEqual(app.selected, ['John', 'Doe', 'Smith']);
    assert.strictEqual(app.selectNextPerson(), null);
});

testLib('Application - notifySelected notifies all selected people', async () => { // Renamed 'test' to 'testLib'
    const app = new Application();
    const [names] = await app.getNames();
    app.selected = names.slice(); // Select all names initially
    app.mailSystem.send = testLib.mock.fn(app.mailSystem.send);
    app.mailSystem.write = testLib.mock.fn(app.mailSystem.write);
    app.notifySelected();
    assert.strictEqual(app.mailSystem.send.mock.calls.length, names.length);
    assert.strictEqual(app.mailSystem.write.mock.calls.length, names.length);
});
