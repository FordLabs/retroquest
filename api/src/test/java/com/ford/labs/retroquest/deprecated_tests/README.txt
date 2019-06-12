These unit tests are deprecated and are being transfered over into the /apiTest folder and being
turned into api tests, which are more flexible for refactoring.

Once all these tests get refactored into api tests there should only be a few unit tests, such as
security and validation because they are hard to test in controllers; at least they are currently.

If you want to add more unit tests add them in the folder directly above this one.

This is not mean't to completely stop unit tests, they are helpful, it's to stop writing unit tests
in favor of testing the functionality through the api endpoints, which allows us to be way more
flexible.

Thank you!