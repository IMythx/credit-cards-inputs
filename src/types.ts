import creditCardType from "credit-card-type";

export type Inputs = {
  cardNumberInput: HTMLInputElement;
  cvvInput: HTMLInputElement;
  expInput: HTMLInputElement;
};

export interface CreditCardsInputsInterface {
  cardType: ReturnType<typeof creditCardType>[number]["type"];
  codeName: ReturnType<typeof creditCardType>[number]["code"]["name"];
  invalide: Record<keyof Inputs, boolean>;
  init(inputs: Inputs, options?: Options): void;
  cardNumberTypeChecker(e: Event): void;
  maskNumberInput(
    target: HTMLInputElement,
    cardType: Partial<
      Pick<ReturnType<typeof creditCardType>[number], "lengths" | "gaps">
    >,
  ): void;
  maskCvvInput(
    target: HTMLInputElement,
    size: Partial<ReturnType<typeof creditCardType>[number]["code"]["size"]>,
  ): void;

  removeError(
    target: HTMLInputElement,
    availableLengths: number[],
    errorId: string,
    targetType: keyof Inputs,
  ): void;

  validateNumberInput(
    target: HTMLInputElement,
    availableLengths: number[],
    targetType: keyof Inputs,
    errorId: string,
  ): void;

  validateExpInput(
    target: HTMLInputElement,
    inputFormat: string,
    targetType: keyof Inputs,
    errorId: string,
  ): void;
}

export type cardTypes = (typeof creditCardType.types)[string];

export type Icons = Record<cardTypes, string> & { default: string };

export type Errors = Record<keyof Inputs, string>;

export type Options = {
  customIcons?: Icons;
  customErrors?: Errors;
};
