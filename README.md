# Email Verification

## Overview

The Email Verification tool is a simple utility that allows you to check whether an email address exists or not. It provides a straightforward way to validate the existence of an email address before sending any emails or engaging in any communication. This readme.md file serves as a guide to understand the functionality and usage of the Email Verification tool.

## Installation

```bash
npm install @toanerrors/check-email
```

or

```bash
yarn add @toanerrors/check-email
```

## Usage

```javascript
const { checkEmail } = require("@toanerrors/check-email");

checkEmail(email);
```

Cache function help you save time when you check email again

## Example

```javascript
const { checkEmail } = require("@toanerrors/check-email");

const email = "";
const result = await checkEmail(email);
console.log(result); // true or false
```

## Use cache

If you want to use cache, you need to create .env file and add this line

```bash
DNS_CACHE_TTL=3600
```

with 3600 is 1 hour

## Note

- This tool use dns cache to save time when you check email again
- This tool does not validate the format or syntax of an email address. It only checks if the email address exists or not.
- This tool does not send any emails to the email address being verified. It only checks if the email address exists or not.

## Meta

Toan Nguyen – [@toanerrors]()

## License

MIT
