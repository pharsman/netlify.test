import MainButton from "masterComponents/MainButton";

function Button({ label, customStyle, onClick, type, disabled, size }) {
  return (
    <MainButton
      label={label}
      disabled={disabled}
      customStyle={{
        ...customStyle,
        backgroundColor: customStyle?.backgroundColor
          ? customStyle.backgroundColor
          : "#30ACD0",
      }}
      onClick={() => onClick()}
      type={type}
      size={size}
    ></MainButton>
  );
}

export default Button;
