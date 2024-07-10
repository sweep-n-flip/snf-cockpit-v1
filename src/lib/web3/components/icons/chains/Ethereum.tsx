export type EthereumProps = {
  size?: number
}

export const Ethereum = ({ size }: EthereumProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="16" height="16" rx="8" fill="#454A75" />
      <path d="M7.99885 6.69782V3L4.92993 8.0927L7.99885 6.69782Z" fill="white" />
      <path
        d="M7.99885 9.9072V6.69783L4.92993 8.0927L7.99885 9.9072ZM7.99885 6.69783L11.0684 8.0927L7.99885 3V6.69783Z"
        fill="white"
        fillOpacity="0.75"
      />
      <path
        d="M7.99902 6.69781V9.90718L11.0685 8.09268L7.99902 6.69781Z"
        fill="white"
        fillOpacity="0.5"
      />
      <path d="M7.99885 10.4884L4.92993 8.67496L7.99885 13V10.4884Z" fill="white" />
      <path
        d="M11.0702 8.67496L7.99902 10.4884V13L11.0702 8.67496Z"
        fill="white"
        fillOpacity="0.75"
      />
    </svg>
  )
}

export default Ethereum
