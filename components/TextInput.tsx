import clsx from "clsx";
import React, { useContext, useId } from "react";

type TextInputContextValue = {
  id: string;
  invalid: boolean;
};

const TextInputContext = React.createContext<TextInputContextValue | null>(
  null,
);

type TextInputProps = {
  invalid?: boolean;
  children: React.ReactNode;
};

export default function TextInput({ invalid, children }: TextInputProps) {
  const id = useId();

  return (
    // children がフラットになるとスタイルをあてるのが厄介になるので div を root にしておく
    <div>
      <TextInputContext.Provider value={{ id, invalid: !!invalid }}>
        {children}
      </TextInputContext.Provider>
    </div>
  );
}

type LabelProps = {
  children: React.ReactNode;
} & Omit<React.ComponentProps<"label">, "id" | "className">;

export function Label({ children, ...props }: LabelProps) {
  const id = useContext(TextInputContext)?.id;

  return (
    <label
      htmlFor={id}
      className="block text-sm font-medium leading-6 text-gray-900"
      {...props}
    >
      {children}
    </label>
  );
}

type InputProps = {
  type: React.HTMLInputTypeAttribute;
} & Omit<React.ComponentProps<"input">, "id" | "className" | "type">;

export function Input({ type, ...props }: InputProps) {
  const { id, invalid } = useContext(TextInputContext) ?? {};

  return (
    <input
      id={id}
      type={type}
      className={clsx(
        "block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200",
        invalid && "text-red-900 ring-red-300 focus:ring-red-500",
      )}
      {...props}
    />
  );
}

type HintProps = {
  children: React.ReactNode;
} & Omit<React.ComponentProps<"p">, "className">;

export function Hint({ children, ...props }: HintProps) {
  const invalid = useContext(TextInputContext)?.invalid;

  return (
    <p
      className={clsx("mt-2 text-sm text-gray-500", invalid && "text-red-600")}
      {...props}
    >
      {children}
    </p>
  );
}
