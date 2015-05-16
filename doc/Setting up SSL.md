Setting up SSL/TLS
==================

Unforget server only operates over SSL/TLS. This can be a bit of a pain to setup
if you don't already have the necessary certificates and keys lying around.

NOTE: I know absolutely nothing about security. Really. This could all be really
wrong. If it is, please tell me so I can fix it.

1. Creating a certificate
-------------------------

If you don't already have a certificate for your site (and your host etc.
doesn't provide one) you'll need to make one.

The following resources should help:

* http://www.akadia.com/services/ssh_test_certificate.html
* http://heyrod.com/snippet/s/node-https-ssl.html

Roughly, it's something like:

    openssl genrsa -des3 -out server.key 1024

(I have no idea if those are good defaults. Please tell me if they're not.)

If you're on Windows, you'll need to dig up an OpenSSL binary. I just used the
one that comes with my minimal mingw32 install used for building Firefox.

You'll need to enter a passphrase for the key.

    openssl req -new -key server.key -out server.csr

At this point, if you're on Windows you might get an error like:

    unable to load config info from /usr/local/ssl/openssl.cnf

If that's the case you'll need to do something like:

    set OPENSSL_CONF=c:/libs/openssl-0.9.8k/openssl.cnf

In my case, I had to do:

    export OPENSSL_CONF=/c/mozilla-build/msys/ssl/openssl.conf

(See the [StackOverflow
question](http://stackoverflow.com/questions/14459078/unable-to-load-config-info-from-usr-local-ssl-openssl-cnf))

You'll get asked a bunch of questions 

Then you need to self-sign the key:

    openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

You should now have a `server.key` and `server.crt` file. You need to keep the
key file safe.

NOTE: You might notice that there are key and crt files in the `test` directory.
Don't use these. They're just for testing. The private key file is available in
a public source repository so there's absolutely no security provided by using
them on a real installation.


2. Telling unforget server about the certificates
-------------------------------------------------

Once you've got your key and crt file you need to tell unforget server about
them. You can make up a config.json file with the details as follows.

    {
      "connection": {
        "key": "server.key",
        "cert": "server.crt",
        "passphrase": "passphrase"
      }
    }

Relative paths will be evaluated from the same folder as `index.js` is located
in (e.g. `test/cert/test.key').

Unforget server will look for a `config.json` file in the same folder as
`index.js` but you can also pass one in like so:

    node --harmony index.js --config config.json


3. Configuring clients to use self-signed certificates
------------------------------------------------------

If you created your own certificate and self-signed it (i.e. you followed the
instructions in step 1), you're going to need to tell your browser or OS that
the certificate is legitimate. Likewise, you'll need to tell Anki.

Here are the instructions for configuring different devices and programs:

* [Instructions for Firefox](http://superuser.com/questions/744308/how-to-add-a-self-signed-certificate-to-firefox-besides-adding-it-as-a-ca)
* [Instructions for iOS](https://blog.httpwatch.com/2013/12/12/five-tips-for-using-self-signed-ssl-certificates-with-ios/)
* TODO: Instructions for FirefoxOS
* TODO: Instructions for Anki
* TODO: Instructions for Android/IE/Chrome etc.
