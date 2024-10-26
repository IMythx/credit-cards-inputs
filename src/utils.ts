import { cardTypes, CreditCardsInputsInterface } from "./types";
import { Errors, Icons, Inputs, Options } from "./types";
import creditCardType from "credit-card-type";
import im from "inputmask";
import defaultIcon from "./assets/credit-card-duotone.svg";
import visaIcon from "./assets/visa.svg";
import mastercardIcon from "./assets/mastercard.svg";
import amexIcon from "./assets/amex.svg";
import discoverIcon from "./assets/discover.svg";
import dinersIcon from "./assets/diners.svg";
import jcbIcon from "./assets/jcb.svg";
import eloIcon from "./assets/elo.svg";
import mirIcon from "./assets/mir.svg";
import unionpayIcon from "./assets/unionpay.svg";
import hiperIcon from "./assets/hiper.svg";
import maestroIcon from "./assets/maestro.svg";
import hipercardIcon from "./assets/hipercard.svg";

const inputmask = (im as any).default || im;

const defaultErrors: Errors = {
  cardNumberInput: "Invalid card number",
  cvvInput: "Invalid CVV number",
  expInput: "Invalid expiry date",
};

const defaultIcons: Icons = {
  default: defaultIcon,
  visa: visaIcon,
  mastercard: mastercardIcon,
  "american-express": amexIcon,
  discover: discoverIcon,
  "diners-club": dinersIcon,
  jcb: jcbIcon,
  elo: eloIcon,
  mir: mirIcon,
  unionpay: unionpayIcon,
  hipercard: hipercardIcon,
  hiper: hiperIcon,
  maestro: maestroIcon,
};

export class CreditCardsInputs implements CreditCardsInputsInterface {
  #codeSize: ReturnType<typeof creditCardType>[number]["code"]["size"] = 3;
  #availableCardNumberLengths: number[] = [];
  #icons: Icons;
  #errors: Errors;
  invalide: Record<keyof Inputs, boolean> = {
    cardNumberInput: false,
    expInput: false,
    cvvInput: false,
  };
  cardType: ReturnType<typeof creditCardType>[number]["type"];
  codeName: ReturnType<typeof creditCardType>[number]["code"]["name"];

  constructor(inputs: Inputs, options?: Options) {
    this.#icons = { ...defaultIcons, ...options?.customIcons };

    this.#errors = { ...defaultErrors, ...options?.customErrors };

    this.init(inputs);
  }

  init(inputs: Inputs) {
    const cardNumberInput = inputs.cardNumberInput;

    const cvvInput = inputs.cvvInput;

    const expInput = inputs.expInput;

    if (cvvInput) {
      const cvvParent = cardNumberInput.parentElement;

      const cvvContainer = document.createElement("div");

      const cvvErrorId = "cvv-input-error";

      cvvContainer.className = "cci__container";

      cvvParent.insertBefore(cvvContainer, cvvInput);

      cvvContainer.appendChild(cvvInput);

      cvvInput.addEventListener("input", () =>
        this.removeError(cvvInput, [this.#codeSize], cvvErrorId, "cvvInput"),
      );

      cvvInput.addEventListener("blur", () =>
        this.validateNumberInput(
          cvvInput,
          [this.#codeSize],
          "cvvInput",
          cvvErrorId,
        ),
      );

      this.maskCvvInput(cvvInput, this.#codeSize);
    }

    if (cardNumberInput) {
      const cardNumberParent = cardNumberInput.parentElement;

      const cardNumberContainer = document.createElement("div");

      const cardNumberContainerInner = document.createElement("div");

      const img = document.createElement("img");

      cardNumberInput.type = "tel";

      img.className = "cci__container__img";

      cardNumberContainer.className = "cci__container";

      cardNumberContainerInner.className = "cci__container__inner";

      const inputHeight = cardNumberInput.getBoundingClientRect().height;

      cardNumberInput.style.paddingInlineEnd =
        inputHeight * 1.7 > 70 ? 70 + "px" : inputHeight * 1.7 + "px";

      img.style.maxWidth =
        inputHeight * 1.25 > 60 ? 60 + "px" : inputHeight * 1.25 + "px";

      img.id = "credit-card-icon";

      img.src = this.#icons.default;

      img.alt = "default";

      cardNumberParent.insertBefore(cardNumberContainer, cardNumberInput);

      cardNumberParent.insertBefore(cardNumberContainerInner, cardNumberInput);

      cardNumberContainerInner.appendChild(cardNumberInput);

      cardNumberContainerInner.appendChild(img);

      cardNumberContainer.appendChild(cardNumberContainerInner);

      cardNumberInput.addEventListener(
        "input",
        this.cardNumberTypeChecker.bind(this),
      );

      cardNumberInput.addEventListener("blur", () => {
        this.validateNumberInput(
          cardNumberInput,
          this.#availableCardNumberLengths,
          "cardNumberInput",
          "credit-card-input-error",
        );

        this.maskCvvInput(cvvInput, this.#codeSize);
      });

      this.maskNumberInput(cardNumberInput, { lengths: [10] });
    }

    if (expInput) {
      const expParent = expInput.parentElement;

      const expContainer = document.createElement("div");

      const inputFormat = "mm/yy";

      const expErrorId = "exp-input-error";

      expContainer.className = "cci__container";

      expParent.insertBefore(expContainer, expInput);

      expContainer.appendChild(expInput);

      expInput.addEventListener("blur", () =>
        this.validateExpInput(expInput, inputFormat, "expInput", expErrorId),
      );

      this.maskExpInput(expInput, expErrorId, inputFormat);
    }
  }

  cardNumberTypeChecker(e: Event) {
    const target = e.target as HTMLInputElement;

    const cardTypes = creditCardType(target.value);

    const icon = document.getElementById(
      "credit-card-icon",
    ) as HTMLImageElement;

    if (cardTypes.length === 1) {
      this.cardType = cardTypes[0].type;

      this.codeName = cardTypes[0].code.name;

      this.#codeSize = cardTypes[0].code.size;

      this.#availableCardNumberLengths = cardTypes[0].lengths;

      icon.src = this.#icons[cardTypes[0].type] || this.#icons.default;

      icon.alt = cardTypes[0].type;

      this.maskNumberInput(target, cardTypes[0]);

      this.removeError(
        target,
        cardTypes[0].lengths,
        "credit-card-input-error",
        "cardNumberInput",
      );
    } else {
      this.cardType = undefined;

      this.codeName = undefined;

      icon.src = this.#icons.default;
    }
  }

  maskNumberInput(
    target: HTMLInputElement,
    cardType: Partial<
      Pick<
        ReturnType<typeof creditCardType>[number],
        "lengths" | "gaps" | "type"
      >
    >,
  ) {
    //@ts-ignore
    const mask = "9".repeat(cardType.lengths.at(-1)).split("");

    cardType?.gaps?.forEach((gap, index) => {
      mask.splice(gap + index, 0, " ");
    });

    inputmask(mask.join(""), { placeholder: "", autoUnmask: true }).mask(
      target,
    );
  }

  maskCvvInput(
    target: HTMLInputElement,
    size: Partial<ReturnType<typeof creditCardType>[number]["code"]["size"]>,
  ) {
    const mask = "9".repeat(size);

    inputmask(mask, { placeholder: "", autoUnmask: true }).mask(target);
  }

  maskExpInput(target: HTMLInputElement, errorId: string, inputFormat: string) {
    target.placeholder = "MM/YY";

    inputmask("datetime", {
      inputFormat,
      placeholder: "",
      autoUnmask: true,
      jitMasking: true,
      showMaskOnFocus: false,
      showMaskOnHover: false,
      oncomplete: () => {
        const errorElement = document.getElementById(errorId);

        this.invalide["expInput"] = false;

        if (errorElement) {
          errorElement.remove();
        }
      },
    }).mask(target);
  }

  removeError(
    target: HTMLInputElement,
    availableLengths: number[],
    errorId: string,
    targetType: keyof Inputs,
  ) {
    const container = target.closest(".cci__container");

    const errorElement = container.querySelector(`#${errorId}`);

    if (availableLengths.includes(target.value.length)) {
      this.invalide[targetType] = false;

      if (errorElement) {
        container.removeChild(errorElement);
      }
    }
  }

  validateNumberInput(
    target: HTMLInputElement,
    availableLengths: number[],
    targetType: keyof Inputs,
    errorId: string,
  ): void {
    const error = document.getElementById(errorId);

    if (
      target.value.length &&
      !availableLengths.includes(target.value.length) &&
      !error
    ) {
      const errorElement = document.createElement("p");

      const container = target.closest(".cci__container");

      this.invalide[targetType] = true;

      errorElement.classList.add("cci__error");

      errorElement.id = errorId;

      errorElement.innerText = this.#errors[targetType];

      container.appendChild(errorElement);
    }
  }

  validateExpInput(
    target: HTMLInputElement,
    inputFormat: string,
    targetType: keyof Inputs,
    errorId: string,
  ): void {
    const now = new Date();

    const expDate = new Date();

    const month = target.value.split("/")[0];

    const year =
      now.getFullYear().toString().slice(0, 2) + target.value.split("/")[1];

    month && expDate.setMonth(parseInt(month));

    year && expDate.setFullYear(parseInt(year));

    const isValid =
      Inputmask.isValid(target.value, {
        alias: "datetime",
        inputFormat,
      }) && expDate > now;

    const error = document.getElementById(errorId);

    if (!isValid && !error && target.value.length) {
      const errorElement = document.createElement("p");

      const parent = target.parentElement;

      this.invalide[targetType] = true;

      errorElement.classList.add("cci__error");

      errorElement.id = errorId;

      errorElement.innerText = this.#errors[targetType];

      parent.appendChild(errorElement);
    }
  }
}

export const addNewCard = creditCardType.addCard;

export const updateCard: (
  type: cardTypes | string,
  options: Partial<
    Pick<ReturnType<typeof creditCardType>[number], "type" | "code" | "gaps">
  >,
) => void = creditCardType.updateCard;
