const express = require('express');
const xml2js = require('xml2js');
const fs = require('fs');
const { json, urlencoded } = require('body-parser'); // declaring absolute paths before relative paths
const estimator = require('./estimator');


const app = express();
app.use(json());
app.use(urlencoded({ extended: false }));

const filePath = './src/logs.txt';
const xml = new xml2js.Builder({
  rootName: 'estimate',
  trim: true
});

app.post('/api/v1/on-covid-19', (req, res) => {
  const start = new Date();
  const request = '/api/v1/on-covid-19';
  const log = {
    method: 'POST',
    request
  };
  try {
    const estimate = estimator(req.body);
    res.status(200).json(estimate);
    const end = new Date();
    log.status = 200;
    log.responseTime = `${end - start}ms`;
    fs.readFile(filePath, (err, data) => {
      if (err) return false;
      let logs;
      try {
        logs = JSON.parse(data.toString()); // content it's retrieving must be parseable to JSON
      } catch (error) {
        logs = [];
      }

      logs.push(log);
      return fs.writeFile(filePath, JSON.stringify(logs), (error) => {
        if (error) return false;
        return true;
      });
    });
  } catch (er) {
    log.status = 400;
    log.responseTime = `${new Date() - start}ms`;
    return res.status(400).send({ error: 'invalid data provided' });
  }
  return true;
});

app.post('/api/v1/on-covid-19/:format', (req, res) => {
  const start = new Date();
  const { format } = req.params;
  const request = `/api/v1/on-covid-19/${format}`;
  const log = {
    method: 'POST',
    request
  };
  try {
    const estimate = estimator(req.body);

    const XMLEstimate = xml.buildObject(estimate);
    if (format === 'xml') {
      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(XMLEstimate);
    } else {
      res.status(200).json(estimate);
    }
    const end = new Date();
    log.status = 200;
    log.responseTime = `${end - start}ms`;

    fs.readFile(filePath, (err, data) => {
      if (err) {
        log.status = 500;
        log.responseTime = `${new Date() - start}ms`;
        return res.status(500).send({ error: 'server error' });
      }
      let logs;
      try {
        logs = JSON.parse(data.toString());
      } catch (error) {
        logs = [];
      }

      logs.push(log);
      return fs.writeFile(filePath, JSON.stringify(logs), (error) => {
        if (error) return false;
        return true;
      });
    });
  } catch (er) {
    log.status = 400;
    log.responseTime = `${new Date() - start}ms`;
    return res.status(400).send({ error: 'invalid data provided' });
  }
  return true;
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  const start = new Date();
  const request = '/api/v1/on-covid-19/logs';
  const newLog = {
    method: 'GET',
    request
  };
  fs.readFile(filePath, (err, data) => {
    if (err) {
      newLog.responseTime = `${new Date() - start}ms`;
      newLog.status = 500;
      return res.status(500).send({ error: 'server error' });
    }

    let logs;
    try {
      logs = JSON.parse(data.toString()); // content it's retrieving must be parseable to JSON
    } catch (error) {
      logs = [];
    }
    res.setHeader('Content-Type', 'text/plain');
    const end = new Date();
    newLog.status = 200;
    newLog.responseTime = `${end - start}ms`;

    logs.push(newLog);
    let logsText = '';
    logs.forEach((log) => {
      logsText += `${log.method}\t\t${log.request}\t\t${log.status}\t\t${log.responseTime}\n`;
    });

    return fs.writeFile(filePath, JSON.stringify(logs), (error) => {
      if (error) return false;
      return res.status(200).send(logsText);
    });
  });
});

const port = process.env.PORT || 3030;
app.listen(port);

module.exports = app;
