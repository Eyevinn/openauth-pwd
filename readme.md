<h1 align="center">
  OpenAuth Password Service
</h1>

<div align="center">
  Password authentication service based on OpenAuth
  <br />
</div>

<div align="center">
<br />

[![made with hearth by Eyevinn](https://img.shields.io/badge/made%20with%20%E2%99%A5%20by-Eyevinn-59cbe8.svg?style=flat-square)](https://github.com/eyevinn)
[![Slack](http://slack.streamingtech.se/badge.svg)](http://slack.streamingtech.se)

</div>

Password authentication service based on [OpenAuth](https://github.com/openauthjs/openauth) ready to be deployed. Uses a CouchDB database for the user database. Emails are verified using a verification code.

## Requirements

- Docker

## Installation / Usage

```bash
docker build -t openauth-pwd:local .
docker run --rm \
  -e USER_DB_URL=https://<username>:<password>@<couchdb-host>/<user-database> \
  -e SMTP_MAILER_URL=smtp://<smtp-user>:<smtp-password>@<smtp-host>:<smtp-port> \
  -p 8000:8000 \
  openauth-pwd:local
```

Test it out by visiting `http://localhost:8000/.well-known/oauth-authorization-server`.

### Fake SMTP server for email verification

For testing you can use a fake SMTP server such as [Ethereal Email](https://ethereal.email).

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md)

## License

This project is licensed under the MIT License, see [LICENSE](LICENSE).

# Support

Join our [community on Slack](http://slack.streamingtech.se) where you can post any questions regarding any of our open source projects. Eyevinn's consulting business can also offer you:

- Further development of this component
- Customization and integration of this component into your platform
- Support and maintenance agreement

Contact [sales@eyevinn.se](mailto:sales@eyevinn.se) if you are interested.

# About Eyevinn Technology

[Eyevinn Technology](https://www.eyevinntechnology.se) is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor. As our way to innovate and push the industry forward we develop proof-of-concepts and tools. The things we learn and the code we write we share with the industry in [blogs](https://dev.to/video) and by open sourcing the code we have written.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
