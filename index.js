const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session')
const { exec } = require("child_process");
const bodyParser = require('body-parser');
const axios = require('axios')
const fs = require('fs');

console.log('SERVER STARTED')


app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat'
}))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index.ejs');
  console.log(req.session)
});

app.get('/data', (req, res) => {
  res.sendFile('data.json', { root: '.' })
})

app.get('/input', (req, res) => {
  res.render('input.ejs')
})

app.get('/result', (req, res) => {
  const query = req.query.q;

  if (req.session.msglog) {
    let msg = JSON.parse(req.session.msglog);
    msg.push(query)

    req.session.msglog = JSON.stringify(msg)
  } else {
    req.session.msglog = JSON.stringify([query])
  }

  try {
    async function run() {
      let conversationLog = [
        {
          role: 'system', content: `You are a powerful ai, which when asked about this ${fs.readFileSync('./data.json').toString()} json data, you give accurate answers.`
        }
      ];

      if (JSON.parse(req.session.msglog).length != 1 && JSON.parse(req.session.replyLog)) {
        for (let i = 0; i < JSON.parse(req.session.msglog).length; i++) {
          conversationLog.push({
            role: 'user',
            content: JSON.parse(req.session.msglog)[i]
          });

          if (i != JSON.parse(req.session.msglog).length - 1) {
            conversationLog.push({
              role: 'assistant',
              content: JSON.parse(req.session.replyLog)[i]
            });
          }
        }
      } else {
        conversationLog.push({
          role: 'user',
          content: JSON.parse(req.session.msglog)[0]
        });
      }

      console.log(req.session.msglog)
      console.log(req.session.replyLog)
      console.log(conversationLog)


      const parms = new URLSearchParams();
      parms.append('query', JSON.stringify(conversationLog))

      axios.post('http://127.0.0.1:5000/chat', parms).then(response => {
        console.log(response.data)

        if (req.session.replyLog) {
          let msg = JSON.parse(req.session.replyLog);
          msg.push(response.data)
          req.session.replyLog = JSON.stringify(msg)
        } else {
          req.session.replyLog = JSON.stringify([response.data])
        }

        res.render('result.ejs', { query: query, result: response.data })
      }).catch(err => {
        console.error(err)
      })

      // openai
      //   .chat.completions.create({
      //     model: 'gpt-3.5-turbo',
      //     messages: conversationLog,
      //   })
      //   .then((result) => {
      //     console.log(result.choices[0].message)
      //     res.render('result.ejs', {query: query, result: result.choices[0].message.content})
      //   })
      //   .catch((error) => {
      //     console.log(`OPENAI ERR: ${error}`);
      //   });
    }

    run();
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
})

app.get('/command', (req, res) => {
  res.render('command.ejs', { directory: __dirname })
})

app.get('/gen-img', (req, res) => {
  res.render('image-gen.ejs')
})

app.get('/res', (req, res) => {
  const query = req.query.query;  
  const parms = new URLSearchParams();
  parms.append(query)
  axios.post('http://127.0.0.1:5000/gen-img', parms).then(response => {
    return res.send(`<img src='${response.data}' alt='image' />`)
  })
})

app.post('/command', (req, res) => {
  const command = req.body.command;
  console.log(command)

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.send(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      res.send(`stderr: ${stderr}`);
      return;
    }
    res.send(`stdout: ${stdout}`);
    console.log(stdout)
  });
})

app.listen(port, () => {
  console.log(`app listening on port ${port}!`);
}); 