export type LineaProps = {
  size?: number
}

export const Linea = ({ size }: LineaProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 84 84"
      fill="none"
    >
      <mask
        id="mask0_71_11"
        contentStyleType="mask-type:luminance"
        maskUnits="userSpaceOnUse"
        x="19"
        y="18"
        width="45"
        height="48"
      >
        <path d="M63.5605 18.8015H19V65.7934H63.5605V18.8015Z" fill="white" />
      </mask>
      <g mask="url(#mask0_71_11)">
        <path
          d="M56.0076 65.7936H19V26.4269H27.4674V58.1641H56.0076V65.7895V65.7936Z"
          fill="white"
        />
        <path
          d="M56.0075 34.0521C60.1789 34.0521 63.5605 30.6381 63.5605 26.4268C63.5605 22.2155 60.1789 18.8015 56.0075 18.8015C51.8362 18.8015 48.4546 22.2155 48.4546 26.4268C48.4546 30.6381 51.8362 34.0521 56.0075 34.0521Z"
          fill="white"
        />
      </g>
    </svg>
  )
}

export default Linea
