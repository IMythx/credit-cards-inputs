# credit-cards-inputs [![npm version](https://badge.fury.io/js/credit-cards-inputs.svg)](http://badge.fury.io/js/credit-cards-inputs) <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/IMythx/credit-cards-inputs" alt="License"></a> <a href="https://www.npmjs.com/package/credit-cards-inputs" rel="nofollow"><img src="https://img.shields.io/npm/dw/credit-cards-inputs.svg" alt="npm"></a> <a href="https://github.com/IMythx/credit-cards-inputs" rel="nofollow"><img src="https://img.shields.io/github/stars/IMythx/credit-cards-inputs" alt="stars"></a>

[![Release](https://github.com/IMythx/credit-cards-inputs/actions/workflows/release.yml/badge.svg)](https://github.com/IMythx/credit-cards-inputs/actions)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)

credit-cards-inputs is a vanilla JavaScript lightweight utility designed to handle the validation, formatting, and user-friendly input of credit card information. While primarily built with vanilla JavaScript, this library leverages two other specialized libraries to enhance functionality. It's ideal for enhancing payment forms with automatic card type detection, input masking, real-time validation, and card number formatting.

## Table of Contents

- [Key features](#key-features)
- [Getting started](#getting-started-using-a-cdn)
- [Basic exmaple & Live demo](#basic-example--live-demo)
  - [Basic example](#basic-example)
  - [Live demo](#live-demo)
- [API Reference](#api-reference)
- [Supported input types](#supported-input-types)

## Key features

1. **Card Type Detection**: Automatically detect and display the credit card brand (e.g., Visa, MasterCard, AmEx) based on the entered card number. This is typically done using a specific patterns ([see](https://github.com/braintree/credit-card-type?tab=readme-ov-file#pattern-detection)).

2. **Input Formatting**: The library formats the card number into groups (e.g., 1234 5678 9012 3456), expiration date as MM/YY, and the CVC/CVV field. It applies real-time input masking to help users enter the data correctly.

3. **Validation**:

   - CVV/CVC and Card number: done [using](https://www.npmjs.com/package/credit-card-type). <br/>
   - expDate: done [using](https://www.npmjs.com/package/inputmask).

4. **Input Restrictions**: Limit the input to numbers only for the credit card field, allow specific characters for expiration dates (/), and restrict the length based on the detected card type.

5. **Styling**: Allow customizable styles to seamlessly integrate with different website themes. Provide pre-built styles for error states (e.g., invalid card number)

## Getting Started (Using a CDN)

1. Add the CSS

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/credit-cards-inputs@latest/dist/assets/styles.css"
/>
```

2. Add the library script

```html
<script src="https://cdn.jsdelivr.net/npm/credit-cards-inputs@latest/dist/credit-cards-inputs.umd.js"></script>
```

## Getting Started (Using ESM modules)

1. Install with npm:

```bash
  //npm
  npm install credit-cards-inputs

  //yarn
  yarn add credit-cards-inputs

  //pnpm
  pnpm add credit-cards-inputs
```

2. Import the CSS:

```javascript
import "credit-cards-inputs/dist/assets/styles.css";
```

3. Import the js:

```javascript
import { CreditCardsInputs } from "credit-cards-inputs";
```

## Basic example & Live demo

### Basic example

1. Using a CDN

```html
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/credit-cards-inputs@latest/dist/assets/styles.css"
  />
</head>
<body>
  <input type="text" id="cardNumberInput" />
  <input type="text" id="cvvInput" />
  <input type="text" id="expinput" />
</body>
<script src="https://cdn.jsdelivr.net/npm/credit-cards-inputs@latest/dist/credit-cards-inputs.umd.js"></script>
<script>
  const cardNumberInput = document.getElementById("cardNumberInput");

  const cvvInput = document.getElementById("cvvInput");

  const expInput = document.getElementById("expinput");

  const inputs = new CCI.CreditCardsInputs({
    cardNumberInput,
    cvvInput,
    expInput,
  });
</script>
```

2. Using ESM modules

```javascript
import { CreditCardsInputs } from "credit-cards-inputs";
import "credit-cards-inputs/dist/assets/styles.css";

const cardNumberInput = document.getElementById("cardNumberInput");

const cvvInput = document.getElementById("cvvInput");

const expInput = document.getElementById("expinput");

const inputs = new CreditCardsInputs({
  cardNumberInput,
  cvvInput,
  expInput,
});
```

### Live demo:

- [demo](https://credit-cards-inputs-demo.vercel.app/)

## API Reference

1. ### `new CreditCardsInputs(inputs: Inputs, options: Options)` initialize CreditCardInputs with the following:

- Parameters:
  | Name | Type | Description |
  | --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
  | `inputs` | <pre>`{`<br/> `cardNumberInput: HTMLInputElement;`<br/> `cvvInput: HTMLInputElement;`<br/> `expInput:HTMLInputElement`<br/>`}`</pre> | inputs to apply masking and validation on |
  | `options` | <pre>`{`<br/> `customErrors: Record<keyof Inputs, string>;`<br/> `customIcons: Record<cardTypes, string>;`<br/>`}`</pre> | optional custom errors to show if the given card number doesn't match one of the card lengths and custom icon to show for the given card type |

- Return:
  | Name | Type | Description |
  | ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `cardType` | `string` | matched card type |
  | `codeName` | `string` | Card brands provide different nomenclature for their security codes as well as varying lengths [see](https://github.com/braintree/credit-card-type?tab=readme-ov-file#code). you can use it as a label for the code input |
  | `invalide` | `Record<keyof Inputs, boolean>` | validation status for each input |

2. ### `addNewCard(config: config)` add a new card type with the following:

- Parameters:
  | Name | Type | Description |
  | --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
  | `config` | <pre>`{`<br/> `niceType: string;`<br/> `type: string;`<br/> `patterns: number[];`<br/> `gaps: number[];`<br/> `lengths: number[];`<br/> `code: { name: string; size: number };`<br/>`}`</pre> | card type configuration [see](https://github.com/braintree/credit-card-type?tab=readme-ov-file#adding-new-cards) |

- Return: `void`

- Example

```javascript
import { addNewCard } from "credit-cards-inputs";

addNewCard({
  niceType: "Fancy card",
  type: "fancy card",
  patterns: [41111],
  gaps: [4, 8, 12],
  lengths: [13, 16, 19],
  code: {
    name: "CVV",
    size: 3,
  },
});
```

3. ### `updateCard(type: cardTypes | string, options: Partial<Pick<ReturnType<typeof creditCardType>[number], "type" | "code" | "gaps">>)` update the card type with the following:

- Parameters:
  | Name | Type | Description |
  | --------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
  | `type` | `cardTypes \| string` | card type to update |
  | `options` | <pre>`{`<br/> `type?: string;`<br/> `code?: Partial<Pick<ReturnType<typeof creditCardType>[number], "type" \| "code" \| "gaps">>;` <br/> `gaps?: number[];`<br/>`}`</pre> | optional card type options [see](https://github.com/braintree/credit-card-type?tab=readme-ov-file#updating-card-types) |

- Return: `void`

- Example

```javascript
import { updateCard } from "credit-cards-inputs";

updateCard("visa", {
  code: {
    name: "test",
  },
});
```

## Supported input types

**Please note that Text Mask supports input type of `text`, `tel`, `url`, `password`, and `search`. Due to a limitation in browser API, other input types, such as `email` or `number`, cannot be supported. However, it is normal to let the user enter an email or a number in an input type `text` combined the appropriate input mask.**
