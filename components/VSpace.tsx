type Props = {
  size: "S" | "M" | "L";
};

export function VSpace(props: Props) {
  const sizeToClassName = {
    S: "mt-2",
    M: "mt-4",
    L: "mt-8",
  } as const;
  return <div className={sizeToClassName[props.size]} />;
}
