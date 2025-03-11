export const IconStar = ({ isFilled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.1875rem"
    height="1.1875rem"
    fill={isFilled ? "#EFBD4E" : "none"}
    viewBox="0 0 14 14"
  >
    <path
      stroke={isFilled ? "#EFBD4E" : "#6F787B"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.2"
      d="M7 2l1.544 3.128L12 5.674l-2.5 2.437.59 3.444L7 9.864l-3.09 1.691.59-3.444L2 5.674l3.456-.546L7 2z"
    ></path>
  </svg>
);

export default IconStar;
